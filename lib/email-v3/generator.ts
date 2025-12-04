

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { detectDesignSystem, type DesignSystem } from '@/emails/lib/design-system-selector';
import { extractCodeFromMarkdown, cleanGeneratedCode } from '@/emails/lib/validator';
import { validateEmail, generateFixPrompt, getValidationSummary, type ValidationIssue } from '@/emails/lib/email-validator';
import { fetchImagesForPrompt, type ImageContext } from './image-service';
import { checkMismatchedQuotes, validateTsxSyntax } from './code-validator';
import { AI_MODEL, MAX_GENERATION_ATTEMPTS, GENERATION_TEMPERATURE } from '@/lib/ai/config';
import type { BrandIdentity } from '@/lib/types/brand';
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');

// Initialize Google AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface GeneratedEmail {
  filename: string;
  code: string;
  designSystemUsed: string;
  attempts: number;
  validationIssues: Array<{ severity: string; type: string; message: string }>;
  isValid: boolean;
}

/**
 * System instruction for React Email component generation with Design Systems
 */
const SYSTEM_INSTRUCTION = `You are an expert React Email developer creating production-ready email templates following comprehensive design systems.

# CRITICAL RULES

1. **IMPORTS - CRITICAL (CHECK BEFORE WRITING CODE)**
   ⚠️ BEFORE you write ANY code, identify ALL components you will use and import them.
   
   \`\`\`tsx
   // ALWAYS start with this import - include ALL components you'll use:
   import { 
     Html, Head, Body, Container, Preview,
     Section, Heading, Text, Button, Link,
     Column, Row, Img, Hr 
   } from '@react-email/components';
   \`\`\`
   
   - NEVER use a component without importing it first
   - FORBIDDEN: <Preview> without Preview in import
   - FORBIDDEN: <Link> without Link in import
   - Check your code - every <ComponentName> must be in the import statement

2. **COMPLETE REACT EMAIL STRUCTURE**
   - Root element MUST be <Html>
   - Include <Head /> for metadata and title
   - Use <Body> for the email body
   - Use <Container> for max-width (600px standard)

3. **AVAILABLE COMPONENTS (import ALL you use)**
   - Html, Head, Body, Container, Preview
   - Section, Heading, Text, Button, Link
   - Column, Row, Img, Hr
   - ALL imported from '@react-email/components'

4. **STYLING - INLINE STYLES ONLY (CRITICAL)**
   - **ALWAYS use inline styles via style prop**
   - **NEVER use className** - email clients strip className
   - All styles must be inline style objects
   - Example: style={{ padding: '24px', backgroundColor: '#ffffff' }}

5. **TYPESCRIPT & CONTENT - CRITICAL**
   - No props needed (or empty props interface)
   - **STATIC CONTENT ONLY**: Write ALL text directly in JSX
   - **NEVER use**: {variable}, {prop.text}, .map(), .forEach()
   - **INSTEAD**: Write all content as literal strings
   - Export as default function

6. **IMAGES - PREVENT STRETCHING (CRITICAL)**
   - Use <Img> component from '@react-email/components'
   - Real image URLs will be provided in the user prompt
   - ALWAYS include alt attributes (descriptive, 10-15 words)
   - Use the exact URLs provided (professional Unsplash images)
   - DO NOT use placeholder URLs
   - **EVERY <Img> MUST HAVE RESPONSIVE STYLES**:
     * REQUIRED: style={{ width: '100%', height: 'auto' }}
     * Set width and height as hints only: width={600} height={400}
     * These hints are for email clients, but style prop controls actual rendering
     * For hero/banner images: Add objectFit: 'cover' if needed
     * FORBIDDEN: Fixed height in styles (height: '400px') - this causes stretching
     * Correct: <Img src="..." width={600} height={400} style={{ width: '100%', height: 'auto' }} />
     * Wrong: <Img src="..." width={600} height={400} style={{ width: '100%', height: '400px' }} />

7. **HORIZONTAL RULES (Hr)**
   - Use <Hr> for visual dividers
   - ALWAYS constrain width with margin: <Hr style={{ margin: '24px 0' }} />
   - For full-width within container: <Hr style={{ margin: '32px 0', borderColor: '#e5e7eb' }} />
   - NEVER use absolute positioning or width: '100vw'
   - Example: <Hr style={{ margin: '24px 0', borderColor: '#d1d5db', borderWidth: '1px' }} />

8. **BUTTONS/CTAs - CRITICAL SIZE REQUIREMENTS**
   ⚠️ All buttons MUST have minimum 44px touch target height for accessibility.
   
   **REQUIRED button style:**
   \`\`\`tsx
   <Button 
     href="#" 
     style={{ 
       padding: '16px 32px',  // MINIMUM: 14px vertical, 24px horizontal
       fontSize: '16px',      // MINIMUM: 16px
       borderRadius: '8px',
       backgroundColor: '#primaryColor',
       color: '#ffffff',
       textDecoration: 'none',
       display: 'inline-block',
       textAlign: 'center',
     }}
   >
     Button Text
   </Button>
   \`\`\`
   
   - FORBIDDEN: padding: '8px 16px' (too small - fails accessibility)
   - FORBIDDEN: padding: '10px 20px' (too small)
   - MINIMUM: padding: '14px 28px' (achieves 44px+ height)
   - RECOMMENDED: padding: '16px 32px' (optimal)

9. **EMAIL BEST PRACTICES**
   - Max content width: 600px via Container
   - Include <Preview> text for email clients
   - Follow the design system specifications exactly
   - All images must have descriptive alt text
   - Minimum font size: 14px for all text (16px for body text)
   - For product grids: OK to have many CTAs if user requests multiple products

10. **COMPLETE CODE ONLY**
    - NO placeholders, NO "...", NO incomplete sections
    - NO {{variables}}, NO template syntax
    - EVERY section fully implemented with real text
    - NO TODO or FIXME comments

Generate COMPLETE, production-ready React Email components using INLINE STYLES ONLY.`;

/**
 * Generate a complete React Email component with retry logic
 */
export async function generateEmail(prompt: string, brand?: BrandIdentity | null): Promise<GeneratedEmail> {
  console.log(`🚀 [V3-GENERATOR] Generating email for: "${prompt}"`);
  if (brand) {
    console.log(`🎨 [V3-GENERATOR] Using brand: ${brand.companyName} (${brand.primaryColor})`);
  }
  
  // Detect appropriate design system based on keywords
  const designSystem = detectDesignSystem(prompt);
  
  // Fetch images with design system aesthetic (runs independently)
  const images = await fetchImagesForPrompt(prompt, designSystem);
  
  let lastError: Error | null = null;
  let previousIssues: ValidationIssue[] = [];
  
  // Retry loop for generation with auto-correction
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    console.log(`🔄 [V3-GENERATOR] Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);
    
    try {
      // Build user prompt with design system, images, brand identity, and previous validation issues
      const userPrompt = buildUserPrompt(prompt, designSystem, attempt, images, previousIssues, brand);
      
      // Generate with Gemini
      const result = await generateText({
        model: google(AI_MODEL),
        system: SYSTEM_INSTRUCTION,
        prompt: userPrompt,
        temperature: GENERATION_TEMPERATURE,
      });
      
      // Log token usage and cost (Gemini 2.0 Flash pricing)
      if (result.usage) {
        const usage = result.usage as any;
        const inputTokens = usage.inputTokens || 0;
        const outputTokens = usage.outputTokens || 0;
        const totalTokens = usage.totalTokens || 0;
        
        const inputCost = (inputTokens / 1000) * 0.00001875;
        const outputCost = (outputTokens / 1000) * 0.000075;
        const totalCost = inputCost + outputCost;
        
        console.log(`💰 [GENERATOR] Tokens: ${totalTokens} (in: ${inputTokens}, out: ${outputTokens}) | Cost: $${totalCost.toFixed(6)}`);
      }
      
      // Extract and clean code
      const extractedCode = extractCodeFromMarkdown(result.text);
      const code = cleanGeneratedCode(extractedCode);
      
      // NEW: Pre-render syntax validation (catches broken JSX before render fails)
      const quoteErrors = checkMismatchedQuotes(code);
      if (quoteErrors.length > 0) {
        console.log(`⚠️ [V3-GENERATOR] Found mismatched quotes, retrying...`);
        quoteErrors.forEach(err => console.log(`  ❌ ${err}`));
        previousIssues = quoteErrors.map(msg => ({ severity: 'error' as const, type: 'syntax' as const, message: msg }));
        continue;
      }
      
      // Validate TSX syntax using esbuild (catches all syntax errors before render)
      const syntaxError = await validateTsxSyntax(code);
      if (syntaxError) {
        console.log(`⚠️ [V3-GENERATOR] TSX syntax error, retrying...`);
        console.log(`  ❌ ${syntaxError}`);
        previousIssues = [{ severity: 'error' as const, type: 'syntax' as const, message: syntaxError }];
        continue;
      }
      
      // Multi-layer validation (context-aware based on design system)
      const validation = validateEmail(code, designSystem.id);
      const summary = getValidationSummary(validation);
      console.log(`📋 [V3-GENERATOR] Validation: ${summary}`);
      
      // Log issues for debugging
      if (validation.issues.length > 0) {
        validation.issues.forEach(issue => {
          const emoji = issue.severity === 'error' ? '❌' : '⚠️';
          console.log(`  ${emoji} [${issue.type}] ${issue.message}`);
        });
      }
      
      // If valid or on last attempt, save and return
      if (validation.isValid || attempt === MAX_GENERATION_ATTEMPTS) {
        // Save to filesystem
        const filename = await saveComponent(code);
        
        if (validation.isValid) {
          console.log(`✅ [V3-GENERATOR] Successfully generated: ${filename}`);
        } else {
          console.warn(`⚠️ [V3-GENERATOR] Generated with errors on final attempt: ${filename}`);
        }
        
        return {
          filename,
          code,
          designSystemUsed: designSystem.id,
          attempts: attempt,
          validationIssues: validation.issues.map(i => ({
            severity: i.severity,
            type: i.type,
            message: i.message
          })),
          isValid: validation.isValid,
        };
      }
      
      // Not valid and not last attempt - retry with feedback
      console.log(`🔄 [V3-GENERATOR] Retrying with validation feedback...`);
      previousIssues = validation.issues;
      continue;
      
    } catch (error: any) {
      console.error(`❌ [V3-GENERATOR] Attempt ${attempt} failed:`, error.message);
      lastError = error;
      
      if (attempt === MAX_GENERATION_ATTEMPTS) {
        throw new Error(
          `Code generation failed after ${MAX_GENERATION_ATTEMPTS} attempts. ` +
          `Last error: ${error.message}`
        );
      }
    }
  }
  
  throw lastError || new Error('Code generation failed for unknown reason');
}

/**
 * Build user prompt with design system specification, images, brand identity, and validation feedback
 */
function buildUserPrompt(
  prompt: string, 
  designSystem: DesignSystem, 
  attempt: number, 
  images: ImageContext,
  previousIssues: ValidationIssue[] = [],
  brand?: BrandIdentity | null
): string {
  let userPrompt = '';
  
  // Add brand identity context FIRST (highest priority) - only if enabled
  if (brand && brand.enabled !== false) {
    userPrompt += `# BRAND IDENTITY\n\n`;
    userPrompt += `Apply this brand identity to the email:\n`;
    userPrompt += `- **Company**: ${brand.companyName}\n`;
    userPrompt += `- **Primary Color**: ${brand.primaryColor} (use for buttons, CTAs, key accents)\n`;
    if (brand.secondaryColor) {
      userPrompt += `- **Secondary Color**: ${brand.secondaryColor} (use for text, borders)\n`;
    }
    if (brand.logoUrl) {
      userPrompt += `- **Logo URL**: ${brand.logoUrl} (use in email header)\n`;
    }
    if (brand.tone && brand.formality) {
      userPrompt += `- **Tone**: ${brand.tone}, ${brand.formality}\n`;
    }
    if (brand.personality) {
      userPrompt += `- **Voice**: ${brand.personality}\n`;
    }
    userPrompt += `\n**CRITICAL**: Replace ALL button/CTA colors with the brand primary color (${brand.primaryColor}). Replace ALL company names with "${brand.companyName}". Use the brand logo if provided.\n\n`;
    userPrompt += `---\n\n`;
  }
  
  // Add design system specification (replaces RAG patterns)
  userPrompt += `# DESIGN SYSTEM: ${designSystem.name}\n\n`;
  userPrompt += `${designSystem.system}\n\n`;
  userPrompt += `---\n\n`;
  userPrompt += `# COMPLETE REFERENCE EXAMPLE\n\n`;
  userPrompt += `Study this complete, production-ready email that follows the design system:\n\n`;
  userPrompt += `\`\`\`tsx\n${designSystem.exampleEmail}\n\`\`\`\n\n`;
  userPrompt += `---\n\n`;
  
  // Add image URLs to use
  userPrompt += '# IMAGES TO USE\n\n';
  userPrompt += 'Use these professional images from Unsplash (10 images available):\n\n';
  
  if (images.hero) {
    userPrompt += `**1. Hero/Header Image**:\n`;
    userPrompt += `- URL: ${images.hero.url}\n`;
    userPrompt += `- Dimensions: ${images.hero.width}x${images.hero.height}\n`;
    userPrompt += `- Alt: "${images.hero.alt}"\n`;
    userPrompt += `- Use in: Main header section, hero banner\n\n`;
  }
  
  if (images.logo) {
    userPrompt += `**2. Logo**:\n`;
    userPrompt += `- URL: ${images.logo.url}\n`;
    userPrompt += `- Dimensions: ${images.logo.width}x${images.logo.height}\n`;
    userPrompt += `- Alt: "Company logo"\n`;
    userPrompt += `- Use in: Top of email, header branding\n\n`;
  }
  
  if (images.feature1) {
    userPrompt += `**3. Feature Image 1**:\n`;
    userPrompt += `- URL: ${images.feature1.url}\n`;
    userPrompt += `- Dimensions: ${images.feature1.width}x${images.feature1.height}\n`;
    userPrompt += `- Alt: "${images.feature1.alt}"\n`;
    userPrompt += `- Use in: Main feature section, content highlight\n\n`;
  }
  
  if (images.feature2) {
    userPrompt += `**4. Feature Image 2**:\n`;
    userPrompt += `- URL: ${images.feature2.url}\n`;
    userPrompt += `- Dimensions: ${images.feature2.width}x${images.feature2.height}\n`;
    userPrompt += `- Alt: "${images.feature2.alt}"\n`;
    userPrompt += `- Use in: Secondary feature, additional content\n\n`;
  }
  
  if (images.feature3) {
    userPrompt += `**5. Feature Image 3**:\n`;
    userPrompt += `- URL: ${images.feature3.url}\n`;
    userPrompt += `- Dimensions: ${images.feature3.width}x${images.feature3.height}\n`;
    userPrompt += `- Alt: "${images.feature3.alt}"\n`;
    userPrompt += `- Use in: Tertiary feature, additional content\n\n`;
  }
  
  if (images.product1) {
    userPrompt += `**6. Product Image 1**:\n`;
    userPrompt += `- URL: ${images.product1.url}\n`;
    userPrompt += `- Dimensions: ${images.product1.width}x${images.product1.height}\n`;
    userPrompt += `- Alt: "${images.product1.alt}"\n`;
    userPrompt += `- Use in: Product showcase, vertical card\n\n`;
  }
  
  if (images.product2) {
    userPrompt += `**7. Product Image 2**:\n`;
    userPrompt += `- URL: ${images.product2.url}\n`;
    userPrompt += `- Dimensions: ${images.product2.width}x${images.product2.height}\n`;
    userPrompt += `- Alt: "${images.product2.alt}"\n`;
    userPrompt += `- Use in: Second product, additional showcase\n\n`;
  }
  
  if (images.destination1) {
    userPrompt += `**8. Destination/Location Image 1**:\n`;
    userPrompt += `- URL: ${images.destination1.url}\n`;
    userPrompt += `- Dimensions: ${images.destination1.width}x${images.destination1.height}\n`;
    userPrompt += `- Alt: "${images.destination1.alt}"\n`;
    userPrompt += `- Use in: Travel destination, location card\n\n`;
  }
  
  if (images.destination2) {
    userPrompt += `**9. Destination/Location Image 2**:\n`;
    userPrompt += `- URL: ${images.destination2.url}\n`;
    userPrompt += `- Dimensions: ${images.destination2.width}x${images.destination2.height}\n`;
    userPrompt += `- Alt: "${images.destination2.alt}"\n`;
    userPrompt += `- Use in: Second destination, location showcase\n\n`;
  }
  
  if (images.icon) {
    userPrompt += `**10. Icon/Badge**:\n`;
    userPrompt += `- URL: ${images.icon.url}\n`;
    userPrompt += `- Dimensions: ${images.icon.width}x${images.icon.height}\n`;
    userPrompt += `- Alt: "${images.icon.alt}"\n`;
    userPrompt += `- Use in: Small icons, badges, decorative elements\n\n`;
  }
  
  userPrompt += `**CRITICAL - Image Usage Rules**:\n`;
  userPrompt += `✅ Use these EXACT URLs in <Img> components\n`;
  userPrompt += `✅ ALWAYS add responsive styles: style={{ width: '100%', height: 'auto' }}\n`;
  userPrompt += `✅ Include width and height as hints only: width={600} height={400}\n`;
  userPrompt += `✅ Include descriptive alt text\n`;
  userPrompt += `✅ Example: <Img src="..." width={600} height={400} style={{ width: '100%', height: 'auto' }} alt="..." />\n`;
  userPrompt += `❌ DO NOT use baseUrl or process.env.VERCEL_URL\n`;
  userPrompt += `❌ DO NOT use /static/ paths or placeholders\n`;
  userPrompt += `❌ DO NOT use placeholder.com or via.placeholder.com\n`;
  userPrompt += `❌ DO NOT use fixed height in styles - ALWAYS use height: 'auto'\n\n`;
  
  // Add CRITICAL content rules
  userPrompt += `# 🚨 CRITICAL REQUIREMENTS 🚨\n\n`;
  userPrompt += `**FOLLOW THE DESIGN SYSTEM ABOVE EXACTLY**\n\n`;
  userPrompt += `FORBIDDEN (will cause errors):\n`;
  userPrompt += `❌ className attributes - email clients strip them! Use inline styles ONLY\n`;
  userPrompt += `❌ {variableName} or {{variable}} syntax in JSX\n`;
  userPrompt += `❌ {item.field} or {data.property}\n`;
  userPrompt += `❌ .map() loops or array iterations\n`;
  userPrompt += `❌ Props interface with content fields\n`;
  userPrompt += `❌ Placeholder text like "Lorem ipsum" or "Your Company"\n\n`;
  userPrompt += `REQUIRED:\n`;
  userPrompt += `✅ INLINE STYLES ONLY: style={{ padding: '24px', color: '#1a1a1a' }}\n`;
  userPrompt += `✅ Write full text directly: <Text style={{...}}>Complete sentence here.</Text>\n`;
  userPrompt += `✅ Follow design system colors, typography, spacing EXACTLY\n`;
  userPrompt += `✅ Every image must have descriptive alt text (10-15 words)\n`;
  userPrompt += `✅ Make content relevant to the topic\n\n`;
  
  // Add user's request
  userPrompt += `# USER REQUEST\n\n`;
  userPrompt += `Generate a complete React Email component for:\n\n`;
  userPrompt += `"${prompt}"\n\n`;
  userPrompt += `Requirements:\n`;
  userPrompt += `- Follow the ${designSystem.name} design system above\n`;
  userPrompt += `- Use INLINE STYLES ONLY (no className)\n`;
  userPrompt += `- Root element: <Html>\n`;
  userPrompt += `- Include <Head />, <Body>, <Container style={{ maxWidth: '600px' }}>\n`;
  userPrompt += `- Include <Preview> text\n`;
  userPrompt += `- Write ALL content as static text (no variables)\n`;
  userPrompt += `- NO props interface needed\n`;
  userPrompt += `- Complete code with NO placeholders\n`;
  userPrompt += `- Study the reference example and match that quality\n\n`;
  
  if (attempt > 1) {
    userPrompt += `# IMPORTANT - RETRY ATTEMPT ${attempt}\n\n`;
    userPrompt += `Previous attempts failed validation. CRITICAL FIXES NEEDED:\n\n`;
    userPrompt += `**MOST COMMON ERRORS TO FIX:**\n`;
    userPrompt += `1. ❌ Using className → ✅ Use inline styles only: style={{ padding: '24px' }}\n`;
    userPrompt += `2. ❌ Missing imports → ✅ Import ALL components you use: import { Html, Head, Body, Container, Preview, Section, Heading, Text, Button, Link, Column, Row, Img, Hr } from '@react-email/components'\n`;
    userPrompt += `3. ❌ {{placeholder}} syntax → ✅ Write actual static text\n`;
    userPrompt += `4. ❌ Missing alt text on images → ✅ Every <Img> needs descriptive alt="..."\n`;
    userPrompt += `5. ❌ Small buttons → ✅ REQUIRED: padding: '16px 32px' minimum for 44px+ touch target. NEVER use padding smaller than '14px 28px'\n\n`;
    userPrompt += `**CRITICAL - INLINE STYLES ONLY:**\n`;
    userPrompt += `Every HTML attribute like padding, color, fontSize, etc. MUST be in a style prop object.\n`;
    userPrompt += `Example: <Section style={{ padding: '48px 24px', backgroundColor: '#ffffff' }}>\n`;
    userPrompt += `NEVER: <Section className="p-12 bg-white">\n\n`;
    
    // Add structured validation feedback
    if (previousIssues.length > 0) {
      const fixPrompt = generateFixPrompt(previousIssues);
      userPrompt += fixPrompt;
    }
  }
  
  userPrompt += `\nReturn ONLY the complete TSX code. Study the reference example above and match that exact structure and quality.`;
  
  return userPrompt;
}

/**
 * Save component to filesystem with unique filename
 */
async function saveComponent(code: string): Promise<string> {
  // Ensure directory exists
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `Email_${timestamp}_${random}.tsx`;
  const filepath = path.join(GENERATED_DIR, filename);
  
  // Save file
  fs.writeFileSync(filepath, code, 'utf-8');
  
  console.log(`💾 [V3-GENERATOR] Saved to: ${filepath}`);
  
  return filename;
}

/**
 * Delete a generated email file
 */
export function deleteGeneratedEmail(filename: string): void {
  const filepath = path.join(GENERATED_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    console.log(`🗑️ [V3-GENERATOR] Deleted: ${filename}`);
  }
}

