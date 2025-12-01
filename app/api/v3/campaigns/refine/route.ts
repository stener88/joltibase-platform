import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { detectIntent } from '@/lib/email-v3/intent-detector';
import { resolveImage, extractImageKeyword } from '@/lib/email-v3/image-resolver';
import { processCodeChanges } from '@/lib/email-v3/refiner-streaming';
import { parseAndInjectIds } from '@/lib/email-v3/tsx-parser';
import { getDesignSystemById } from '@/emails/lib/design-system-selector';
import type { BrandIdentity } from '@/lib/types/brand';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

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

2. **STATIC CONTENT ONLY**
   - ❌ NEVER use: {variables}, {props.text}, .map(), .forEach()
   - ✅ Write all text directly in JSX
   - ✅ If asked for "3 buttons", write 3 separate <Button> components

3. **STYLING - MIXED APPROACH**
   
   **TAILWIND (className) - SAFE for:**
   - Colors: bg-blue-500, text-gray-600
   - Typography: text-sm, text-lg, font-bold, text-center
   - Basic spacing: p-4, px-6, py-3, m-0, mt-4

   **INLINE STYLES (style prop) - REQUIRED for:**
   - Layout gaps: style={{display: 'flex', gap: '12px'}}
   - Spacing between siblings: style={{marginBottom: '16px'}}
   - Complex positioning

   **FORBIDDEN CLASSES**:
   - ❌ space-x-*, space-y-*, gap-*, divide-*
   - ❌ hover:, focus:, active:, group-, dark:

4. **IMAGES**
   - When adding new images, use descriptive alt text and a placeholder URL like "https://placeholder.com/image"
   - The system will automatically fetch real images based on your alt text
   - If an image URL is explicitly provided in the prompt, use that exact URL
   - For existing images, keep the current src attribute unless asked to change it

# OUTPUT FORMAT
Return ONLY the complete modified TSX code. No explanations, no markdown, just code.`;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { campaignId, currentTsxCode, userMessage, selectedComponentId, selectedComponentType, brandSettings } = 
      await request.json();

    if (!campaignId || !currentTsxCode || !userMessage) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Log brand settings if present
    if (brandSettings) {
      console.log(`🎨 [REFINE-SDK] Using brand: ${brandSettings.companyName}`);
    }

    console.log(`🔄 [REFINE-SDK] User message: "${userMessage}"`);
    if (selectedComponentId) {
      console.log(`🎯 [REFINE-SDK] Target component: ${selectedComponentType} (${selectedComponentId})`);
    }

    // Parse componentMap
    let componentMap;
    try {
      const parsed = parseAndInjectIds(currentTsxCode);
      componentMap = parsed.componentMap;
    } catch (error) {
      componentMap = undefined;
    }

    // Detect intent
    const intent = detectIntent(userMessage);
    console.log(`[REFINE-SDK] Intent: ${intent}`);

    // CONSULTATION MODE - Answer questions
    if (intent === 'question') {
      const result = await generateText({
        model: google('gemini-2.0-flash-exp'),
        system: CONSULTATION_PROMPT,
        prompt: `# THE EMAIL CODE\n\n\`\`\`tsx\n${currentTsxCode}\n\`\`\`\n\n# USER'S QUESTION\n\n"${userMessage}"\n\nProvide 2-3 specific, actionable suggestions.`,
        temperature: 0.8,
      });

      return Response.json({
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
          console.log(`🎨 [REFINE-SDK] Enhanced image keyword with ${designSystem.name} aesthetic: "${keyword}"`);
        }
      }
      
      const imageResult = await resolveImage(keyword, {
        orientation: 'landscape',
        width: 600,
        height: 300,
      });
      imageUrl = imageResult.url;
      console.log(`[REFINE-SDK] Resolved image: ${imageUrl.substring(0, 60)}... (source: ${imageResult.source})`);
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
      model: google('gemini-2.0-flash-exp'),
      system: EXECUTION_PROMPT,
      prompt: executionPrompt,
      temperature: 0.7,
    });

    // Extract code from AI response
    const { text, usage } = aiResult;
    const codeMatch = text.match(/```(?:tsx|typescript)?\n([\s\S]*?)\n```/);
    let finalCode = codeMatch ? codeMatch[1].trim() : text.trim();

    // Smart image fetching: Replace placeholder/broken image URLs with real ones
    const imgMatches = finalCode.matchAll(/<Img[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']+)["'][^>]*?>/g);
    const imagesToFetch: Array<{ url: string; alt: string }> = [];
    
    for (const match of imgMatches) {
      const [fullMatch, srcUrl, altText] = match;
      // Check if URL looks like a placeholder or broken link
      const isPlaceholder = srcUrl.includes('placeholder') || 
                           srcUrl.includes('example.com') ||
                           srcUrl.includes('...') ||
                           !srcUrl.startsWith('http');
      
      // Don't replace brand logo (if brand is active and logo exists)
      const isBrandLogo = brandSettings?.enabled !== false && 
                          brandSettings?.logoUrl && 
                          srcUrl === brandSettings.logoUrl;
      
      if (isPlaceholder && altText && !isBrandLogo) {
        imagesToFetch.push({ url: srcUrl, alt: altText });
      }
    }

    // Fetch real images for placeholders
    if (imagesToFetch.length > 0) {
      console.log(`🖼️ [REFINE-SDK] Fetching ${imagesToFetch.length} real images...`);
      
      for (const { url: placeholderUrl, alt } of imagesToFetch) {
        try {
          // Extract keyword from alt text
          const keyword = alt.split(' ').slice(0, 3).join(' '); // First 3 words
          
          const imageResult = await resolveImage(keyword, {
            orientation: 'landscape',
            width: 600,
            height: 400,
          });
          
          // Replace placeholder URL with real URL
          finalCode = finalCode.replace(placeholderUrl, imageResult.url);
          console.log(`✅ [REFINE-SDK] Replaced "${keyword}" image: ${imageResult.url.substring(0, 60)}...`);
        } catch (error) {
          console.error(`❌ [REFINE-SDK] Failed to fetch image for "${alt}":`, error);
        }
      }
    }

    // Validate and generate diff
    const processResult = processCodeChanges({
      oldCode: currentTsxCode,
      newCode: finalCode,
      userMessage,
    });

    console.log(`[REFINE-SDK] Validation: ${processResult.valid ? '✅ Valid' : '❌ Invalid'}`);
    console.log(`[REFINE-SDK] Changes: ${processResult.changes.length}`);

    // Log telemetry
    if (usage && usage.totalTokens) {
      const totalTokens = usage.totalTokens;
      const estimatedInputTokens = Math.floor(totalTokens * 0.6);
      const estimatedOutputTokens = totalTokens - estimatedInputTokens;
      
      const cost = (estimatedInputTokens / 1000) * 0.00001875 + 
                   (estimatedOutputTokens / 1000) * 0.000075;
      
      console.log(`💰 [REFINE-SDK] Tokens: ${totalTokens} | Cost: ~$${cost.toFixed(6)}`);
    }

    // Return simple JSON response
    return Response.json({
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
    console.error('[REFINE-SDK] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to refine email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

