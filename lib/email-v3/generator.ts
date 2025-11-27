/**
 * V3 Email Generator - Standard React Email Components
 * 
 * Uses existing RAG system to generate React Email components
 * Generates complete components with Html/Head/Body/Container structure
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { initializeRAG, retrievePatternsByEmbedding } from '@/emails/lib/rag';
import type { Pattern } from '@/emails/lib/patterns';
import { validateGeneratedCode, extractCodeFromMarkdown, cleanGeneratedCode } from '@/emails/lib/validator';
import fs from 'fs';
import path from 'path';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');
const MAX_GENERATION_ATTEMPTS = 3;

// Initialize Google AI
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export interface GeneratedEmail {
  filename: string;
  code: string;
  patternsUsed: string[];
  attempts: number;
}

/**
 * System instruction for React Email component generation with Tailwind
 */
const SYSTEM_INSTRUCTION = `You are an expert React Email developer creating production-ready email templates using Tailwind CSS.

# CRITICAL RULES

1. **COMPLETE REACT EMAIL STRUCTURE**
   - Root element MUST be <Html>
   - Include <Head /> for metadata
   - Wrap entire content in <Tailwind> component (import from '@react-email/components')
   - Use <Body> inside Tailwind wrapper
   - Use <Container> for max-width (600px recommended)
   - Import all components from '@react-email/components'

2. **AVAILABLE COMPONENTS**
   - Html, Head, Body, Container, Preview, Tailwind
   - Section, Heading, Text, Button, Link
   - Column, Row, Img, Hr
   - ALL imported from '@react-email/components'

3. **STYLING - TAILWIND CLASSES**
   - Use Tailwind utility classes via className prop
   - Semantic classes: text-sm, text-lg, font-bold, text-center
   - Colors: bg-blue-500, text-gray-600, border-gray-300
   - Spacing: p-4, px-6, py-3, m-0, mt-4, mb-8
   - Layout: flex, flex-col, items-center, justify-center
   - Responsive: max-w-xl, w-full
   - Email-safe: Use standard Tailwind classes (React Email converts them)
   - **CRITICAL - NEVER USE**: hover:, focus:, active:, group-, dark:, or any pseudo-class selectors
   - **REASON**: These cannot be inlined and will cause rendering errors in emails
   - **INSTEAD**: Use static colors and styles only (e.g., text-blue-600 instead of hover:text-blue-600)

4. **TYPESCRIPT & CONTENT - CRITICAL**
   - Define proper interface for props (optional, with defaults)
   - **STATIC CONTENT ONLY**: Write ALL text directly in JSX
   - **NEVER use**: {variable}, {prop.text}, {item.description}, .map(), .forEach()
   - **NEVER use**: Arrays or loops for repeated sections
   - **INSTEAD**: If user wants "3 articles", write 3 separate Section components with full text
   - **Example**: User asks for newsletter with articles → Write Section 1 fully, Section 2 fully, Section 3 fully
   - Props can be used for URLs or names ONLY (not for body content)
   - Export as default function

5. **EMAIL BEST PRACTICES**
   - Max content width: 600px via Container
   - Include <Preview> text for email clients
   - Clear visual hierarchy with Tailwind
   - Accessible color contrast (text-gray-900 on white, etc.)
   - Mobile-responsive with Tailwind utilities

6. **COMPLETE CODE ONLY**
   - NO placeholders, NO "...", NO incomplete sections
   - EVERY section fully implemented
   - NO TODO or FIXME comments
   - NO template literals with missing values

# EXAMPLE STRUCTURE

\`\`\`tsx
import { Html, Head, Body, Container, Section, Heading, Text, Button, Preview, Tailwind } from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Preview>Welcome to our platform!</Preview>
          <Container className="mx-auto my-8 bg-white rounded-lg max-w-xl">
            <Section className="p-8 text-center">
              <Heading className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Our Platform!
              </Heading>
              <Text className="text-base text-gray-600 leading-relaxed mb-4">
                We're excited to have you on board. Your account has been successfully created and you're ready to get started.
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                Explore our features, customize your settings, and join thousands of users who are already benefiting from our platform.
              </Text>
            </Section>
            
            <Section className="px-8 pb-8 text-center">
              <Button 
                href="https://example.com/get-started"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Get Started Now
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
\`\`\`

# CONTENT GUIDELINES - CRITICAL

**ALWAYS USE STATIC, COMPLETE TEXT:**
- Write full sentences and paragraphs directly in the JSX
- DO NOT use variables like {item.text} or {data.description}
- DO NOT use .map() loops or array iterations
- If the prompt asks for "multiple articles" or "several sections", write them out individually

Examples:
✅ CORRECT: <Text>Discover the latest trends in artificial intelligence and how they're shaping the future of technology.</Text>
❌ WRONG: <Text>{article.description}</Text>
❌ WRONG: {articles.map(a => <Text>{a.text}</Text>)}

# TAILWIND GUIDELINES

- Use semantic sizes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
- Use color scales: gray-50 to gray-900, blue-500, green-600, red-500
- Use spacing scale: p-2, p-4, p-6, p-8 (multiples of 4px)
- Common patterns:
  - Headers: bg-blue-600 text-white p-8
  - Body text: text-gray-700 text-base leading-relaxed
  - CTAs: bg-blue-500 text-white px-6 py-3 rounded font-semibold
  - Footer: text-gray-500 text-sm text-center

Generate COMPLETE, production-ready React Email components with Tailwind classes.`;

/**
 * Generate a complete React Email component with retry logic
 */
export async function generateEmail(prompt: string): Promise<GeneratedEmail> {
  console.log(`🚀 [V3-GENERATOR] Generating email for: "${prompt}"`);
  
  // Initialize RAG and retrieve relevant patterns
  const patternsWithEmbeddings = await initializeRAG();
  const relevantPatterns = await retrievePatternsByEmbedding(
    prompt,
    patternsWithEmbeddings,
    3 // Get top 3 patterns
  );
  
  if (relevantPatterns.length === 0) {
    console.warn('⚠️ [V3-GENERATOR] No patterns found, proceeding without examples');
  } else {
    console.log(`📚 [V3-GENERATOR] Using ${relevantPatterns.length} patterns: ${relevantPatterns.map(p => p.name).join(', ')}`);
  }
  
  let lastError: Error | null = null;
  
  // Retry loop for generation
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    console.log(`🔄 [V3-GENERATOR] Attempt ${attempt}/${MAX_GENERATION_ATTEMPTS}`);
    
    try {
      // Build user prompt with pattern context
      const userPrompt = buildUserPrompt(prompt, relevantPatterns, attempt);
      
      // Generate with Gemini
      const result = await generateText({
        model: google('gemini-2.0-flash-exp'),
        system: SYSTEM_INSTRUCTION,
        prompt: userPrompt,
        temperature: 0.7,
      });
      
      // Extract and clean code
      const extractedCode = extractCodeFromMarkdown(result.text);
      const code = cleanGeneratedCode(extractedCode);
      
      // Validate code
      const validation = validateGeneratedCode(code);
      
      if (validation.warnings.length > 0) {
        console.warn(`⚠️ [V3-GENERATOR] Warnings:`, validation.warnings);
      }
      
      if (!validation.valid) {
        console.error(`❌ [V3-GENERATOR] Validation failed:`, validation.errors);
        if (attempt < MAX_GENERATION_ATTEMPTS) {
          lastError = new Error(`Validation failed: ${validation.errors.join(', ')}`);
          continue;
        }
        throw new Error(
          `Code generation failed after ${MAX_GENERATION_ATTEMPTS} attempts. ` +
          `Errors: ${validation.errors.join(', ')}`
        );
      }
      
      // Save to filesystem
      const filename = await saveComponent(code);
      
      console.log(`✅ [V3-GENERATOR] Successfully generated: ${filename}`);
      
      return {
        filename,
        code,
        patternsUsed: relevantPatterns.map(p => p.name),
        attempts: attempt,
      };
      
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
 * Build user prompt with pattern examples
 */
function buildUserPrompt(prompt: string, patterns: Pattern[], attempt: number): string {
  let userPrompt = '';
  
  // Add pattern examples if available
  if (patterns.length > 0) {
    userPrompt += '# RELEVANT PATTERN EXAMPLES\n\n';
    userPrompt += 'Learn from these similar patterns:\n\n';
    
    patterns.forEach((pattern, index) => {
      userPrompt += `## Pattern ${index + 1}: ${pattern.name}\n`;
      userPrompt += `Description: ${pattern.description}\n`;
      userPrompt += `Use Case: ${pattern.useCase}\n`;
      userPrompt += `\`\`\`tsx\n${pattern.code.substring(0, 2000)}\n\`\`\`\n\n`;
    });
  }
  
  // Add CRITICAL content rules
  userPrompt += `# 🚨 CRITICAL - STATIC CONTENT ONLY 🚨\n\n`;
  userPrompt += `**YOU MUST WRITE ALL TEXT CONTENT DIRECTLY IN THE JSX - NO EXCEPTIONS**\n\n`;
  userPrompt += `FORBIDDEN (will cause errors):\n`;
  userPrompt += `❌ {variableName} in JSX content (e.g., <Text>{title}</Text>)\n`;
  userPrompt += `❌ {item.field} or {data.property}\n`;
  userPrompt += `❌ .map() loops or array iterations\n`;
  userPrompt += `❌ hover:, focus:, active:, dark: pseudo-classes\n`;
  userPrompt += `❌ Props interface with content fields (title, description, etc.)\n\n`;
  userPrompt += `REQUIRED (write static content):\n`;
  userPrompt += `✅ Write full text directly: <Text>Welcome to our platform! We're excited to have you here.</Text>\n`;
  userPrompt += `✅ Write each section separately instead of using loops\n`;
  userPrompt += `✅ If request says "3 articles", write 3 complete <Section> blocks with full text\n`;
  userPrompt += `✅ Make content relevant to the topic - don't use generic placeholders\n\n`;
  
  // Add user's request
  userPrompt += `# USER REQUEST\n\n`;
  userPrompt += `Generate a complete React Email component for:\n\n`;
  userPrompt += `"${prompt}"\n\n`;
  userPrompt += `Requirements:\n`;
  userPrompt += `- Root element MUST be <Html>\n`;
  userPrompt += `- Wrap content in <Tailwind> component\n`;
  userPrompt += `- Include <Head />, <Body>, <Container>\n`;
  userPrompt += `- Include <Preview> text\n`;
  userPrompt += `- Write ALL content as static text (no {variables} in JSX)\n`;
  userPrompt += `- NO interface with props (or empty interface)\n`;
  userPrompt += `- Complete code with NO placeholders or "..."\n`;
  userPrompt += `- Use Tailwind classes via className (NO hover: or pseudo-classes)\n`;
  userPrompt += `- Import Tailwind from '@react-email/components'\n\n`;
  
  if (attempt > 1) {
    userPrompt += `# IMPORTANT - ATTEMPT ${attempt}\n\n`;
    userPrompt += `Previous attempts failed validation. Avoid:\n`;
    userPrompt += `- Dynamic content like {variable} in JSX\n`;
    userPrompt += `- .map() loops or iterations\n`;
    userPrompt += `- hover:, focus:, or other pseudo-classes\n`;
    userPrompt += `- Incomplete code with "..." or "rest of code" comments\n`;
    userPrompt += `- Missing imports or exports\n`;
    userPrompt += `- Missing <Tailwind> wrapper\n`;
    userPrompt += `- Mismatched braces or parentheses\n\n`;
  }
  
  userPrompt += `Return ONLY the complete TSX code with static content written directly in JSX.`;
  
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

