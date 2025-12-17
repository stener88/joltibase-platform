/**
 * Email Refinement API
 * 
 * This is the SINGLE SOURCE OF TRUTH for email refinement.
 * All AI-powered modifications to emails go through this endpoint.
 * 
 * Supports two modes:
 * - CONSULTATION: Answers questions about the email (no code changes)
 * - EXECUTION: Modifies TSX code based on user commands
 * 
 * Input sources:
 * - 'chat': Main chat interface (questions allowed)
 * - 'toolbar': Floating toolbar (commands only, questions fail gracefully)
 */

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createClient } from '@/lib/supabase/server';
import { detectIntent } from '@/lib/email-v3/intent-detector';
import { resolveImage, extractImageKeyword } from '@/lib/email-v3/image-resolver';
import { processCodeChanges } from '@/lib/email-v3/code-processor';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';
import { getDesignSystemById } from '@/emails/lib/design-system-selector';
import { AI_MODEL, AI_PROVIDER, GENERATION_TEMPERATURE, CONSULTATION_TEMPERATURE } from '@/lib/ai/config';
import { logger, logCost } from '@/lib/logger';
import type { BrandIdentity } from '@/lib/types/brand';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const aiProvider = AI_PROVIDER === 'anthropic' ? anthropic : google;

const CONSULTATION_PROMPT = `You are a helpful email design colleague brainstorming ideas together.

When the user asks for suggestions:
- Give 2-3 specific, actionable ideas in a conversational way
- Keep it brief - just 2-4 sentences total, no lists
- Reference what you see in their email
- Be casual and friendly, like chatting with a colleague
- Don't lecture, teach, or give step-by-step instructions

Examples of good responses:
- "The CTA could pop more with a brighter color. Also, adding some vertical spacing around the header would help it breathe."
- "I'd center everything with mx-auto on the Container and add breathing room between sections."
- "Try a bigger, bolder headline and make the button stand out more with stronger contrast."

Keep it casual, specific, and helpful!`;

const EXECUTION_PROMPT = `You are an expert React Email developer modifying email components based on user requests.

# CRITICAL RULES

1. **PRESERVE STRUCTURE**
   - Keep overall layout unless explicitly asked to change it
   - Maintain existing content unless told to modify/remove it
   - Keep imports from '@react-email/components'
   - **KEEP the <Tailwind> wrapper** - it converts className to inline styles

2. **STATIC CONTENT ONLY**
   - ❌ NEVER use: {variables}, {props.text}, .map(), .forEach()
   - ✅ Write all text directly in JSX
   - ✅ If asked for "3 buttons", write 3 separate <Button> components

3. **STYLING - TAILWIND CLASSES PREFERRED**
   
   **TAILWIND (className) - USE FOR:**
   - Colors: bg-blue-500, text-gray-600, bg-white
   - Typography: text-sm, text-lg, text-xl, font-bold, text-center
   - Spacing: p-4, px-6, py-3, m-0, mt-4, mb-6
   - Borders: rounded-lg, border, border-gray-200
   - Layout: mx-auto, max-w-[600px]

   **INLINE STYLES (style prop) - ONLY FOR:**
   - Custom brand colors: style={{ backgroundColor: '#your-color' }}
   - Layout gaps: style={{ display: 'flex', gap: '12px' }}
   - Unique/non-standard values

   **FORBIDDEN CLASSES**:
   - ❌ space-x-*, space-y-*, gap-*, divide-*
   - ❌ hover:, focus:, active:, group-, dark:
   - ❌ sm:*, md:*, lg:*, xl:* (responsive breakpoints - can't be inlined)

4. **IMAGES - PREVENT STRETCHING (CRITICAL)**
   - When adding new images, use descriptive alt text and a placeholder URL like "https://placeholder.com/image"
   - The system will automatically fetch real images based on your alt text
   - If an image URL is explicitly provided in the prompt, use that exact URL
   - For existing images, keep the current src attribute unless asked to change it
   - **EVERY <Img> MUST HAVE RESPONSIVE STYLES**:
     * REQUIRED: style={{ width: '100%', height: 'auto' }}
     * Set width and height as hints only: width={600} height={400}
     * These hints are for email clients, but style prop controls actual rendering
     * For hero/banner images: Add objectFit: 'cover' if needed
     * FORBIDDEN: Fixed height in styles (height: '400px') - this causes stretching
     * Correct: <Img src="..." width={600} height={400} style={{ width: '100%', height: 'auto' }} />
     * Wrong: <Img src="..." width={600} height={400} style={{ width: '100%', height: '400px' }} />

5. **HORIZONTAL RULES (Hr)**
   - Use <Hr> for visual dividers
   - ALWAYS constrain with margin: <Hr style={{ margin: '24px 0' }} />
   - Never use absolute positioning or viewport widths
   - Example: <Hr style={{ margin: '32px 0', borderColor: '#e5e7eb', borderWidth: '1px' }} />

# OUTPUT FORMAT
Return ONLY the complete modified TSX code. No explanations, no markdown, just code.`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { campaignId, currentTsxCode, userMessage, selectedComponentId, selectedComponentType, brandSettings, source } = 
      await request.json();

    if (!campaignId || !currentTsxCode || !userMessage) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Log brand settings if present
    if (brandSettings) {
      logger.info(`🎨 [REFINE-SDK] Using brand: ${brandSettings.companyName}`);
    }

    logger.info(`🔄 [REFINE-SDK] User message: "${userMessage}" (source: ${source || 'chat'})`);
    if (selectedComponentId) {
      logger.info(`🎯 [REFINE-SDK] Target component: ${selectedComponentType} (${selectedComponentId})`);
    }

    // ✅ Parse componentMap ONCE at the start (used by all tiers)
    type ComponentMap = Record<string, { startChar: number; endChar: number; type: string }>;
    let componentMap: ComponentMap | undefined;
    try {
      const parsed = parseAndInjectIds(currentTsxCode);
      componentMap = parsed.componentMap;
      logger.debug(`📍 [REFINE-SDK] Parsed ${Object.keys(componentMap).length} components`);
    } catch (error) {
      logger.error('[REFINE-SDK] Failed to parse componentMap', error as Error);
      componentMap = undefined;
    }

    // ⚠️ Detect delete requests early (used for routing and logging)
    const isDeleteRequest = /^(delete|remove)\s+(this|the|it)/i.test(userMessage);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIER 1: DETERMINISTIC EDITS (instant, no AI, free)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // ✅ DETERMINISTIC DELETE RE-ENABLED - Now uses Babel AST parser
    // 
    // Fixed: Parser now uses @babel/parser for accurate component boundaries
    // - Handles nested components of the same type correctly
    // - No more orphaned closing tags
    // - Instant deletes with zero AI cost
    // 
    // See: lib/email-v3/tsx-parser.ts for Babel AST implementation
    //
    if (selectedComponentId && componentMap && isDeleteRequest) {
      const component = componentMap[selectedComponentId];
      if (component) {
        logger.info(`⚡ [REFINE-SDK] DETERMINISTIC DELETE - Using Babel AST boundaries`);
        const before = currentTsxCode.substring(0, component.startChar);
        const after = currentTsxCode.substring(component.endChar);
        const newCode = before + after;
        
        return Response.json({
          success: true,
          intent: 'command',
          tsxCode: newCode,
          changes: [{
            type: 'delete',
            componentType: selectedComponentType || 'Component',
            description: `Deleted ${selectedComponentType || 'component'}`,
          }],
          message: `Deleted the ${selectedComponentType || 'component'}.`,
        });
      }
    }

    // DUPLICATE - Smart copy using Babel AST (instant, no AI needed)
    // ✅ Now supports position: "duplicate this above/below"
    if (selectedComponentId && componentMap && /^duplicate\s+(this|the|it)/i.test(userMessage)) {
      const component = componentMap[selectedComponentId];
      if (component) {
        logger.info(`⚡ [REFINE-SDK] SMART DUPLICATE - Using Babel AST`);
        
        try {
          // Import Babel tools
          const parser = await import('@babel/parser');
          const traverse = (await import('@babel/traverse')).default;
          const generate = (await import('@babel/generator')).default;
          const t = await import('@babel/types');
          
          // Parse current TSX into AST
          const ast = parser.parse(currentTsxCode, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          });
          
          let duplicated = false;
          
          // Find and duplicate the target component
          traverse(ast, {
            JSXElement(path: any) {
              // Match by character position
              if (path.node.start === component.startChar && !duplicated) {
                duplicated = true;
                
                // Clone the entire node (deep copy)
                const clonedNode = t.cloneNode(path.node, true, true);
                
                // Update all data-component-id attributes in the clone
                traverse(clonedNode, {
                  JSXAttribute(attrPath: any) {
                    if (
                      attrPath.node.name.type === 'JSXIdentifier' &&
                      attrPath.node.name.name === 'data-component-id' &&
                      attrPath.node.value?.type === 'StringLiteral'
                    ) {
                      // Generate new unique ID
                      const oldId = attrPath.node.value.value;
                      const newId = `cmp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                      attrPath.node.value.value = newId;
                      logger.debug(`  📝 Updated ID: ${oldId} → ${newId}`);
                    }
                  }
                }, path.scope, path);
                
                // Insert the cloned node right after the original
                path.insertAfter(clonedNode);
                
                logger.debug(`  ✅ Duplicated ${selectedComponentType || 'component'} with updated IDs`);
              }
            }
          });
          
          // Generate new code from modified AST
          const output = generate(ast, {
            retainLines: false,
            compact: false,
          });
          
          return Response.json({
            success: true,
            intent: 'command',
            tsxCode: output.code,
            changes: [{
              type: 'duplicate',
              componentType: selectedComponentType || 'Component',
              description: `Duplicated ${selectedComponentType || 'component'} with unique IDs`,
            }],
            message: `Duplicated the ${selectedComponentType || 'component'}.`,
          });
          
        } catch (error: any) {
          logger.error('❌ [REFINE-SDK] Smart duplicate failed', error as Error);
          
          // Fallback to simple string duplication
          logger.warn('  ⚠️ Falling back to simple duplicate');
          const componentCode = currentTsxCode.substring(component.startChar, component.endChar);
          const before = currentTsxCode.substring(0, component.endChar);
          const after = currentTsxCode.substring(component.endChar);
          const newCode = before + '\n' + componentCode + after;
          
          return Response.json({
            success: true,
            intent: 'command',
            tsxCode: newCode,
            changes: [{
              type: 'duplicate',
              componentType: selectedComponentType || 'Component',
              description: `Duplicated ${selectedComponentType || 'component'}`,
            }],
            message: `Duplicated the ${selectedComponentType || 'component'}.`,
          });
        }
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIER 2: COMPONENT-SCOPED AI (fast, cheap)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Check if it's COMPLEX (needs full context)
    const isComplexEdit = 
      /add|insert|create|new|another|below|above|before|after/i.test(userMessage) ||
      /section|layout|structure|grid|multi|several|multiple/i.test(userMessage) ||
      /move.*to|rearrange|reorder|swap|switch/i.test(userMessage);

    // Default to component-scoped if component selected and NOT complex
    // ✅ Deletes now use deterministic logic (no AI needed), so can skip component-scoped
    const isSimpleEdit = selectedComponentId && componentMap && !isComplexEdit && !isDeleteRequest;

    if (isSimpleEdit && componentMap) {
      const component = componentMap[selectedComponentId];
      if (component) {
        logger.info(`⚡ [REFINE-SDK] COMPONENT-SCOPED EDIT - Sending only ${selectedComponentType}`);
        
        try {
          const componentCode = currentTsxCode.substring(component.startChar, component.endChar);
          
          const scopedPrompt = `Edit this ${selectedComponentType} component:

\`\`\`tsx
${componentCode}
\`\`\`

User request: "${userMessage}"

${brandSettings ? `Brand color: ${brandSettings.primaryColor}\n` : ''}
Return ONLY the modified component code (same structure, just the changes requested).`;

          const aiResult = await generateText({
            model: aiProvider(AI_MODEL),
            system: EXECUTION_PROMPT,
            prompt: scopedPrompt,
            temperature: GENERATION_TEMPERATURE,
          });

          const { text, usage } = aiResult;
          const codeMatch = text.match(/```(?:tsx|typescript)?\n([\s\S]*?)\n```/);
          let newComponentCode = codeMatch ? codeMatch[1].trim() : text.trim();
          
          // Replace component in full TSX
          const before = currentTsxCode.substring(0, component.startChar);
          const after = currentTsxCode.substring(component.endChar);
          let finalCode = before + newComponentCode + after;
          
          // ✅ Handle missing imports
          const usedComponents = newComponentCode.match(/<([A-Z][a-zA-Z]*)/g)
            ?.map(m => m.substring(1)) || [];
          const imports = finalCode.match(/import\s*{([^}]+)}\s*from\s*['"]@react-email\/components['"]/)?.[1] || '';
          const importedComponents = imports.split(',').map(c => c.trim());
          const missingImports = usedComponents.filter(c => !importedComponents.includes(c));
          
          if (missingImports.length > 0) {
            logger.debug(`📦 [REFINE-SDK] Adding missing imports: ${missingImports.join(', ')}`);
            finalCode = finalCode.replace(
              /import\s*{([^}]+)}\s*from\s*['"]@react-email\/components['"]/,
              `import { $1, ${missingImports.join(', ')} } from '@react-email/components'`
            );
          }
          
          // Log component-scoped cost with actual token counts
          if (usage) {
            const inputTokens = usage.inputTokens || 0;
            const outputTokens = usage.outputTokens || 0;
            const totalTokens = usage.totalTokens || (inputTokens + outputTokens);
            
            const pricing = AI_PROVIDER === 'anthropic'
              ? { input: 0.25, output: 1.25 } // Claude Haiku 4.5
              : { input: 0.30, output: 2.50 }; // Gemini Flash
            const inputCost = (inputTokens / 1_000_000) * pricing.input;
            const outputCost = (outputTokens / 1_000_000) * pricing.output;
            const cost = inputCost + outputCost;
            
            logCost(`[REFINE-SDK] Component-scoped: ${totalTokens} tokens (in: ${inputTokens}, out: ${outputTokens})`, cost);
          } else {
            logCost(`[REFINE-SDK] Component-scoped: unknown tokens`);
          }
          
          // Validate result
          const processResult = processCodeChanges({
            oldCode: currentTsxCode,
            newCode: finalCode,
            userMessage,
          });
          
          // ✅ Check if it worked - fallback if not
          if (processResult.valid && processResult.changes.length > 0) {
            logger.info(`✅ [REFINE-SDK] Component-scoped edit succeeded`);
            return Response.json({
              success: true,
              intent: 'command',
              tsxCode: finalCode,
              changes: processResult.changes,
              validation: {
                valid: processResult.valid,
                errors: processResult.errors,
                warnings: processResult.warnings,
              },
              message: processResult.conversationalResponse,
            });
          }
          
          // ⚠️ Component-scoped failed - fall through to full context
          logger.warn(`⚠️ [REFINE-SDK] Component-scoped edit failed validation or no changes detected - trying full context fallback`);
          
        } catch (error) {
          logger.error(`❌ [REFINE-SDK] Component-scoped error`, error as Error);
          // Fall through to full context
        }
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TIER 3: FULL CONTEXT (slow, fallback for complex/failed edits)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    logger.info(`🔄 [REFINE-SDK] FULL CONTEXT EDIT - Sending entire email`);

    // Detect intent using existing classifier
    const detectedIntent = detectIntent(userMessage);
    
    // For toolbar: force command mode, but catch obvious questions and fail gracefully
    if (source === 'toolbar' && detectedIntent === 'question') {
      logger.info(`[REFINE-SDK] Toolbar received question - failing gracefully`);
      return Response.json({
        success: false,
        intent: 'command',
        tsxCode: currentTsxCode,
        changes: [],
        message: "The toolbar is for making changes. Try 'make it blue' or 'change the text to...'",
      });
    }
    
    // Toolbar forces command, chat uses detected intent
    const intent = source === 'toolbar' ? 'command' : detectedIntent;
    logger.info(`[REFINE-SDK] Intent: ${intent}${source === 'toolbar' ? ' (forced by toolbar)' : ''}`);

    // CONSULTATION MODE - Answer questions (only for chat, toolbar forces command)
    if (intent === 'question') {
      const result = await generateText({
        model: aiProvider(AI_MODEL),
        system: CONSULTATION_PROMPT,
        prompt: `# THE EMAIL CODE\n\n\`\`\`tsx\n${currentTsxCode}\n\`\`\`\n\n# USER'S QUESTION\n\n"${userMessage}"\n\nProvide 2-3 specific, actionable suggestions.`,
        temperature: CONSULTATION_TEMPERATURE,
      });

      // Log consultation cost
      if (result.usage) {
        const inputTokens = result.usage.inputTokens || 0;
        const outputTokens = result.usage.outputTokens || 0;
        const totalTokens = result.usage.totalTokens || (inputTokens + outputTokens);
        
        const pricing = AI_PROVIDER === 'anthropic'
          ? { input: 0.25, output: 1.25 } // Claude Haiku 4.5
          : { input: 0.30, output: 2.50 }; // Gemini Flash
        const inputCost = (inputTokens / 1_000_000) * pricing.input;
        const outputCost = (outputTokens / 1_000_000) * pricing.output;
        const cost = inputCost + outputCost;
        
        logCost(`[REFINE-SDK] Consultation: ${totalTokens} tokens (in: ${inputTokens}, out: ${outputTokens})`, cost);
      }

      return Response.json({
        success: true,
        intent: 'question',
        message: result.text,
        tsxCode: currentTsxCode, // No changes
      });
    }

    // EXECUTION MODE - Modify code
    
    // Fetch campaign's design system for aesthetic-consistent image selection
    const { data: campaign } = await supabase
      .from('campaigns_v3')
      .select('design_system_used')
      .eq('id', campaignId)
      .single();
    
    const designSystem = campaign?.design_system_used 
      ? getDesignSystemById(campaign.design_system_used) 
      : null;
    
    // Resolve images if needed
    let imageUrl: string | null = null;
    const msg = userMessage.toLowerCase();
    const isImageRequest = selectedComponentType === 'Img' && 
      (msg.includes('change') || msg.includes('replace') || msg.includes('different') || 
       msg.includes('photo') || msg.includes('picture'));

    if (isImageRequest) {
      let keyword = extractImageKeyword(userMessage);
      
      // NEW: Enhance with design system aesthetic if available
      if (designSystem && 'imageKeywords' in designSystem) {
        const dsKeywords = (designSystem as any).imageKeywords;
        // Pick a random aesthetic keyword from hero or feature
        const aestheticOptions = [...(dsKeywords.hero || []), ...(dsKeywords.feature || [])];
        if (aestheticOptions.length > 0) {
          const randomAesthetic = aestheticOptions[Math.floor(Math.random() * aestheticOptions.length)];
          keyword = `${keyword} ${randomAesthetic}`;
          logger.debug(`🎨 [REFINE-SDK] Enhanced image keyword with ${designSystem.name} aesthetic: "${keyword}"`);
        }
      }
      
      const imageResult = await resolveImage(keyword, {
        orientation: 'landscape',
        width: 600,
        height: 300,
      });
      imageUrl = imageResult.url;
      logger.debug(`[REFINE-SDK] Resolved image: ${imageUrl.substring(0, 60)}... (source: ${imageResult.source})`);
    }

    // Build execution prompt
    let executionPrompt = `# CURRENT EMAIL CODE\n\n\`\`\`tsx\n${currentTsxCode}\n\`\`\`\n\n`;

    // Add brand identity context if available and enabled
    if (brandSettings && brandSettings.enabled !== false) {
      executionPrompt += `# BRAND IDENTITY\n\n`;
      executionPrompt += `This email uses the following brand identity:\n`;
      executionPrompt += `- **Company**: ${brandSettings.companyName}\n`;
      executionPrompt += `- **Primary Color**: ${brandSettings.primaryColor} (buttons, CTAs)\n`;
      if (brandSettings.secondaryColor) {
        executionPrompt += `- **Secondary Color**: ${brandSettings.secondaryColor} (text, borders)\n`;
      }
      if (brandSettings.logoUrl) {
        executionPrompt += `- **Logo**: ${brandSettings.logoUrl}\n`;
      }
      if (brandSettings.tone && brandSettings.formality) {
        executionPrompt += `- **Tone**: ${brandSettings.tone}, ${brandSettings.formality}\n`;
      }
      if (brandSettings.personality) {
        executionPrompt += `- **Voice**: ${brandSettings.personality}\n`;
      }
      executionPrompt += `\n**IMPORTANT**: When changing colors, use the brand primary color (${brandSettings.primaryColor}) for CTAs and buttons. Maintain this brand consistency in all modifications.\n\n`;
    }

    // Add selected component context
    if (selectedComponentId && selectedComponentType && componentMap) {
      const componentLocation = componentMap[selectedComponentId];
      
      if (componentLocation) {
        const componentCode = currentTsxCode.substring(
          componentLocation.startChar,
          componentLocation.endChar
        );
        
        executionPrompt += `# SELECTED COMPONENT\n\nThe user has selected a **${selectedComponentType}** component.\n\n**The selected component's code:**\n\`\`\`tsx\n${componentCode}\n\`\`\`\n\nWhen they say:\n- "this" / "it" / "the ${selectedComponentType.toLowerCase()}" → They mean THIS EXACT component\n- "delete this" → Remove THIS EXACT component\n- "change this" → Modify THIS EXACT component only\n\n`;
      }
    }

    // Add image URL if available
    if (imageUrl) {
      executionPrompt += `# NEW IMAGE AVAILABLE\n\nUse this image URL (already validated and working):\n- **URL**: ${imageUrl}\n- **Alt text**: "${extractImageKeyword(userMessage)}"\n\nUpdate the selected <Img> component's src to this URL.\n\n`;
    }

    executionPrompt += `# USER REQUEST\n\n"${userMessage}"\n\n# YOUR TASK\n\nModify the code above based on the user's request.\nReturn ONLY the complete modified TSX code, nothing else.`;

    // Generate code (simple, no streaming)
    const aiResult = await generateText({
      model: aiProvider(AI_MODEL),
      system: EXECUTION_PROMPT,
      prompt: executionPrompt,
      temperature: GENERATION_TEMPERATURE,
    });

    // Extract code from AI response
    const { text, usage } = aiResult;
    const codeMatch = text.match(/```(?:tsx|typescript)?\n([\s\S]*?)\n```/);
    let finalCode = codeMatch ? codeMatch[1].trim() : text.trim();

    // Smart image fetching: Replace NEW/unknown image URLs with real ones
    const imgMatches = finalCode.matchAll(/<Img[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']+)["'][^>]*?>/g);
    const imagesToFetch: Array<{ url: string; alt: string }> = [];
    
    // Get existing image URLs from current code
    const existingImgMatches = currentTsxCode.matchAll(/<Img[^>]*?src=["']([^"']+)["']/g);
    const existingUrls = new Set(Array.from(existingImgMatches, (m: RegExpMatchArray) => m[1]));
    
    for (const match of imgMatches) {
      const [fullMatch, srcUrl, altText] = match;
      
      // Check if this is a NEW image URL (not in original code)
      const isNewUrl = !existingUrls.has(srcUrl);
      
      // Don't replace brand logo (if brand is active and logo exists)
      const isBrandLogo = brandSettings?.enabled !== false && 
                          brandSettings?.logoUrl && 
                          srcUrl === brandSettings.logoUrl;
      
      // Replace if it's a new URL and not the brand logo
      if (isNewUrl && altText && !isBrandLogo) {
        imagesToFetch.push({ url: srcUrl, alt: altText });
      }
    }

    // Fetch real images for placeholders (PARALLEL)
    if (imagesToFetch.length > 0) {
      logger.info(`🖼️ [REFINE-SDK] Fetching ${imagesToFetch.length} real images in parallel...`);
      
      const imagePromises = imagesToFetch.map(async ({ url: placeholderUrl, alt }) => {
        try {
          // Better keyword extraction - remove filler words
          const keyword = alt
            .toLowerCase()
            .replace(/\b(image|picture|photo|of|a|an|the|our|this|that)\b/gi, '')
            .trim()
            .split(/\s+/)
            .slice(0, 4)  // Take up to 4 meaningful words
            .join(' ') || alt;
          
          const imageResult = await resolveImage(keyword, {
            orientation: 'landscape',
            width: 600,
            height: 400,
          });
          
          logger.debug(`✅ [REFINE-SDK] Resolved "${keyword}" → ${imageResult.url.substring(0, 60)}...`);
          return { placeholderUrl, realUrl: imageResult.url };
        } catch (error) {
          logger.error(`❌ [REFINE-SDK] Failed to fetch image for "${alt}"`, error as Error);
          return null;
        }
      });
      
      const results = await Promise.all(imagePromises);
      
      // Replace all URLs in finalCode
      results.forEach(result => {
        if (result) {
          finalCode = finalCode.replace(result.placeholderUrl, result.realUrl);
        }
      });
    }

    // Validate and generate diff
    const processResult = processCodeChanges({
      oldCode: currentTsxCode,
      newCode: finalCode,
      userMessage,
    });

    logger.info(`[REFINE-SDK] Validation: ${processResult.valid ? '✅ Valid' : '❌ Invalid'}`);
    logger.info(`[REFINE-SDK] Changes: ${processResult.changes.length}`);

    // Log telemetry with actual token counts
    if (usage) {
      const inputTokens = usage.inputTokens || 0;
      const outputTokens = usage.outputTokens || 0;
      const totalTokens = usage.totalTokens || (inputTokens + outputTokens);
      
      const pricing = AI_PROVIDER === 'anthropic'
        ? { input: 0.25, output: 1.25 } // Claude Haiku 4.5
        : { input: 0.30, output: 2.50 }; // Gemini Flash
      const inputCost = (inputTokens / 1_000_000) * pricing.input;
      const outputCost = (outputTokens / 1_000_000) * pricing.output;
      const cost = inputCost + outputCost;
      
      logCost(`[REFINE-SDK] Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens})`, cost);
    }

    // Handle graceful failures for toolbar commands
    if (source === 'toolbar') {
      // No changes detected - couldn't understand or execute the command
      if (processResult.changes.length === 0) {
        logger.warn(`[REFINE-SDK] Toolbar command failed - no changes detected`);
        return Response.json({
          success: false,
          intent: 'command',
          tsxCode: currentTsxCode, // Return original code
          changes: [],
          message: "I couldn't make that change. Try something like 'make it blue' or 'change text to...'",
        });
      }
      
      // Validation failed - code is broken
      if (!processResult.valid) {
        logger.warn(`[REFINE-SDK] Toolbar command failed - validation errors`);
        return Response.json({
          success: false,
          intent: 'command',
          tsxCode: currentTsxCode, // Return original code
          changes: [],
          message: "Something went wrong with that change. Try rephrasing your request.",
        });
      }
    }

    // Return successful response
    return Response.json({
      success: true,
      intent: 'command',
      tsxCode: finalCode,
      changes: processResult.changes,
      validation: {
        valid: processResult.valid,
        errors: processResult.errors,
        warnings: processResult.warnings,
      },
      message: processResult.conversationalResponse,
    });

  } catch (error: any) {
    logger.error('[REFINE-SDK] Error', error as Error);
    
    // Graceful error response (still 200 so UI can handle it cleanly)
    return Response.json({
      success: false,
      intent: 'command',
      message: "Something went wrong. Try rephrasing your request.",
      error: error.message || 'Failed to refine email',
    });
  }
}

