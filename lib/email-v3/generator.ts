import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { detectDesignSystem, type DesignSystem } from '@/emails/lib/design-system-selector';
import { extractCodeFromMarkdown, cleanGeneratedCode } from '@/emails/lib/validator';
import { validateEmail, generateFixPrompt, getValidationSummary, type ValidationIssue } from '@/emails/lib/email-validator';
import { fetchImagesForPrompt, type ImageContext } from './image-service';
import { checkMismatchedQuotes, validateTsxSyntax } from './code-validator';
import { ensureAltText } from './alt-text-fixer';
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
 * Optimized for single-pass generation
 */
const SYSTEM_INSTRUCTION = `You are an expert React Email developer. Generate production-ready email components.

# STRUCTURE

\`\`\`tsx
import { Html, Head, Body, Container, Tailwind, Section, Text, Button, Link, Img, Row, Column, Hr, Preview, Font } from '@react-email/components';

export default function Email() {
  return (
    <Html>
      <Tailwind>
        <Head><Preview>Preview text here</Preview></Head>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] p-6">
            {/* Content */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
\`\`\`

# STYLING

- Use Tailwind className for standard styling (bg-*, text-*, p-*, m-*, rounded-*, font-*)
- Use inline style={{ }} for brand colors and custom values
- FORBIDDEN classes: space-x-*, space-y-*, gap-*, hover:*, focus:*, sm:*, md:*, lg:*, xl:*, dark:*

# IMAGES

- Use provided Unsplash URLs exactly
- REQUIRED: style={{ width: '100%', height: 'auto' }} on all <Img>
- Include descriptive alt text

# HORIZONTAL RULES (Hr)

- REQUIRED: style={{ width: '100%', maxWidth: '100%', margin: '24px 0' }}
- NEVER use viewport widths (100vw) or fixed widths wider than container
- ALWAYS constrain width to 100% of parent
- For centered decorative dividers: style={{ maxWidth: '80px', margin: '32px auto', borderWidth: '2px' }}
- Example: <Hr style={{ width: '100%', margin: '32px 0', borderColor: '#e5e7eb' }} />
- Example (decorative): <Hr style={{ maxWidth: '80px', margin: '32px auto', borderWidth: '4px', borderColor: '#000' }} />

# BUTTONS

- Minimum padding: '14px 28px' (44px touch target)
- Include: backgroundColor, color, borderRadius, textDecoration: 'none'

# CONTENT

- Static text only - NO {variables}, .map(), or template syntax
- Write complete, real content directly in JSX
- Export as default function, no props interface needed

Generate complete, production-ready code following the design system provided.`;

/**
 * Generate a complete React Email component (single-pass)
 */
export async function generateEmail(prompt: string, brand?: BrandIdentity | null): Promise<GeneratedEmail> {
  const totalStart = Date.now();
  console.log(`🚀 [V3-GENERATOR] Generating email for: "${prompt}"`);
  if (brand) {
    console.log(`🎨 [V3-GENERATOR] Using brand: ${brand.companyName} (${brand.primaryColor})`);
  }
  
  // Detect appropriate design system based on keywords
  const designSystem = detectDesignSystem(prompt);
  
  // Fetch images with design system aesthetic (runs independently)
  const imageStart = Date.now();
  const images = await fetchImagesForPrompt(prompt, designSystem);
  console.log(`⏱️ [GENERATOR] Image fetch: ${((Date.now() - imageStart) / 1000).toFixed(1)}s`);
  
  let lastError: Error | null = null;
  let previousIssues: ValidationIssue[] = [];
  
  // Retry loop for generation with auto-correction
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    console.log(`🔄 [V3-GENERATOR] Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);
    
    try {
      // Build user prompt with design system, images, brand identity, and previous validation issues
      const userPrompt = buildUserPrompt(prompt, designSystem, attempt, images, previousIssues, brand);
      
      // Generate with Gemini (TIMED)
      const llmStart = Date.now();
      console.log(`⏱️ [GENERATOR] Starting LLM call (model: ${AI_MODEL})...`);
      
      const result = await generateText({
        model: google(AI_MODEL),
        system: SYSTEM_INSTRUCTION,
        prompt: userPrompt,
        temperature: GENERATION_TEMPERATURE,
      });
      
      const llmDuration = Date.now() - llmStart;
      console.log(`⏱️ [GENERATOR] LLM call completed in ${(llmDuration / 1000).toFixed(1)}s`);
      
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
      let code = cleanGeneratedCode(extractedCode);
      
      // Auto-fix missing alt text (prevents accessibility errors and retries)
      code = ensureAltText(code);
      
      // Pre-render syntax validation (catches broken JSX before render fails)
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
        
        const totalDuration = Date.now() - totalStart;
        console.log(`\n━━━ GENERATION COMPLETE ━━━`);
        console.log(`⏱️ [TOTAL] ${(totalDuration / 1000).toFixed(1)}s`);
        
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
  
  // Add brand identity context - only if enabled
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
    
    // Add custom font instructions if brand has a font
    if (brand.fontFamily) {
      userPrompt += `- **Font**: ${brand.fontFamily}\n`;
      userPrompt += `\n**FONT SETUP (REQUIRED FOR THIS BRAND)**:\n`;
      userPrompt += `1. Import Font: \`import { ..., Font } from '@react-email/components';\`\n`;
      userPrompt += `2. Add in <Head>:\n`;
      userPrompt += `\`\`\`tsx
<Font
  fontFamily="${brand.fontFamily}"
  fallbackFontFamily={["Helvetica Neue", "Helvetica", "Arial", "sans-serif"]}
  webFont={{
    url: 'https://fonts.gstatic.com/s/${brand.fontFamily.toLowerCase()}/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
    format: 'woff2',
  }}
  fontWeight={400}
  fontStyle="normal"
/>
\`\`\`\n`;
      userPrompt += `3. Apply on <Body>: \`style={{ fontFamily: '${brand.fontFamily}, Helvetica Neue, sans-serif' }}\`\n\n`;
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
  
  
  userPrompt += `**CRITICAL - Image Usage Rules**:\n`;
  userPrompt += `✅ Use Unsplash URLs for CONTENT IMAGES (hero images, feature images, tip images, destination photos)\n`;
  userPrompt += `✅ ALWAYS add responsive styles: style={{ width: '100%', height: 'auto' }}\n`;
  userPrompt += `✅ Include width and height as hints only: width={600} height={400}\n`;
  userPrompt += `✅ Include descriptive alt text\n`;
  userPrompt += `✅ Example: <Img src="..." width={600} height={400} style={{ width: '100%', height: 'auto' }} alt="..." />\n`;
  userPrompt += `❌ DO NOT use baseUrl or process.env.VERCEL_URL\n`;
  userPrompt += `❌ DO NOT use /static/ paths or placeholders\n`;
  userPrompt += `❌ DO NOT use fixed height in styles - ALWAYS use height: 'auto'\n\n`;
  
  // Add CRITICAL content rules
  userPrompt += `# 🚨 CRITICAL REQUIREMENTS 🚨\n\n`;
  userPrompt += `**FOLLOW THE DESIGN SYSTEM ABOVE EXACTLY**\n\n`;
  userPrompt += `FORBIDDEN (will cause errors):\n`;
  userPrompt += `❌ {variableName} or {{variable}} syntax in JSX\n`;
  userPrompt += `❌ {item.field} or {data.property}\n`;
  userPrompt += `❌ .map() loops or array iterations\n`;
  userPrompt += `❌ Props interface with content fields\n`;
  userPrompt += `❌ Placeholder text like "Lorem ipsum" or "Your Company"\n`;
  userPrompt += `❌ Tailwind classes: space-x-*, space-y-*, gap-*, hover:, focus:, dark:, sm:*, md:*, lg:*, xl:*\n\n`;
  userPrompt += `REQUIRED:\n`;
  userPrompt += `✅ WRAP entire email in <Tailwind> component inside <Html>\n`;
  userPrompt += `✅ USE Tailwind classes: className="p-6 bg-white text-gray-900"\n`;
  userPrompt += `✅ Use inline style ONLY for custom brand colors or gaps\n`;
  userPrompt += `✅ Write full text directly: <Text className="text-base">Complete sentence here.</Text>\n`;
  userPrompt += `✅ Follow design system colors, typography, spacing EXACTLY\n`;
  userPrompt += `✅ Every image must have descriptive alt text (10-15 words)\n`;
  userPrompt += `✅ Make content relevant to the topic\n\n`;
  
  // Add user's request
  userPrompt += `# USER REQUEST\n\n`;
  userPrompt += `Generate a complete React Email component for:\n\n`;
  userPrompt += `"${prompt}"\n\n`;
  userPrompt += `Requirements:\n`;
  userPrompt += `- Follow the ${designSystem.name} design system above\n`;
  userPrompt += `- USE Tailwind classes inside <Tailwind> wrapper\n`;
  userPrompt += `- Structure: <Html><Tailwind><Head /><Body><Container>...</Container></Body></Tailwind></Html>\n`;
  userPrompt += `- Include <Preview> text after <Head />\n`;
  userPrompt += `- Write ALL content as static text (no variables)\n`;
  userPrompt += `- NO props interface needed\n`;
  userPrompt += `- Complete code with NO placeholders\n`;
  userPrompt += `- Study the reference example and match that quality\n\n`;
  
  if (attempt > 1) {
    userPrompt += `# IMPORTANT - RETRY ATTEMPT ${attempt}\n\n`;
    userPrompt += `Previous attempts failed validation. CRITICAL FIXES NEEDED:\n\n`;
    userPrompt += `**MOST COMMON ERRORS TO FIX:**\n`;
    userPrompt += `1. ❌ Missing <Tailwind> wrapper → ✅ Wrap entire content: <Html><Tailwind>...</Tailwind></Html>\n`;
    userPrompt += `2. ❌ Missing imports → ✅ Import ALL components INCLUDING Tailwind: import { Html, Head, Body, Container, Preview, Section, Heading, Text, Button, Link, Column, Row, Img, Hr, Tailwind } from '@react-email/components'\n`;
    userPrompt += `3. ❌ {{placeholder}} syntax → ✅ Write actual static text\n`;
    userPrompt += `4. ❌ Missing alt text on images → ✅ Every <Img> needs descriptive alt="..."\n`;
    userPrompt += `5. ❌ Small buttons → ✅ REQUIRED: className="py-4 px-8" or padding: '16px 32px' minimum for 44px+ touch target\n\n`;
    userPrompt += `**CRITICAL - USE TAILWIND CLASSES:**\n`;
    userPrompt += `Use className for colors, typography, spacing. Only use style prop for custom brand colors or gaps.\n`;
    userPrompt += `Example: <Section className="py-12 px-6 bg-white">\n`;
    userPrompt += `For custom colors: <Section className="py-12 px-6" style={{ backgroundColor: '#your-brand-color' }}>\n\n`;
    
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

