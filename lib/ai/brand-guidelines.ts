/**
 * Brand Guidelines Builder
 * 
 * Extracts and formats brand kit information for AI refinement context
 */

import { createClient } from '@/lib/supabase/server';

export interface BrandGuidelines {
  companyName: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  fontStyle?: string;
  tone?: string;
  formattedGuidelines: string; // Ready for AI prompt
}

/**
 * Fetch brand kit and format as guidelines for AI
 */
export async function getBrandGuidelines(userId: string): Promise<BrandGuidelines> {
  const supabase = await createClient();

  // Fetch user's active brand kit
  const { data: brandKit, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error || !brandKit) {
    // Return default guidelines if no brand kit found
    return {
      companyName: 'Your Company',
      colors: {
        primary: '#2563eb',
        secondary: '#3b82f6',
        accent: '#f59e0b',
      },
      fontStyle: 'modern',
      formattedGuidelines: buildGuidelinesText({
        companyName: 'Your Company',
        colors: {
          primary: '#2563eb',
          secondary: '#3b82f6',
          accent: '#f59e0b',
        },
        fontStyle: 'modern',
      }),
    };
  }

  const guidelines: BrandGuidelines = {
    companyName: brandKit.company_name || 'Your Company',
    colors: {
      primary: brandKit.primary_color || '#2563eb',
      secondary: brandKit.secondary_color,
      accent: brandKit.accent_color,
    },
    fontStyle: brandKit.font_style,
    formattedGuidelines: '',
  };

  guidelines.formattedGuidelines = buildGuidelinesText(guidelines);

  return guidelines;
}

/**
 * Build formatted guidelines text for AI prompt
 */
function buildGuidelinesText(guidelines: Omit<BrandGuidelines, 'formattedGuidelines'>): string {
  return `
**Brand Guidelines (Reference Only):**

- **Company Name:** ${guidelines.companyName}
- **Primary Color:** ${guidelines.colors.primary}
${guidelines.colors.secondary ? `- **Secondary Color:** ${guidelines.colors.secondary}` : ''}
${guidelines.colors.accent ? `- **Accent Color:** ${guidelines.colors.accent}` : ''}
${guidelines.fontStyle ? `- **Font Style:** ${guidelines.fontStyle}` : ''}
${guidelines.tone ? `- **Tone:** ${guidelines.tone}` : ''}

**CRITICAL - Priority Rules:**
1. **User's explicit request ALWAYS overrides these guidelines**
   - If user says "change company name to X", use X (not the brand guideline value)
   - If user says "make button color Y", use Y (not the brand color)
   
2. **Use brand guidelines ONLY when:**
   - User asks to "add company name" without specifying what
   - User asks to "use brand colors" without specifying which
   - Filling in missing information that user didn't specify

3. **Examples:**
   - User: "change company name to Acme Corp" → Use "Acme Corp" (NOT "${guidelines.companyName}")
   - User: "you forgot the company name" → Use "${guidelines.companyName}" (from guidelines)
   - User: "make CTA blue" → Use blue (NOT "${guidelines.colors.primary}")
   - User: "add a CTA using brand color" → Use "${guidelines.colors.primary}" (from guidelines)

**Important:**
- Explicit user values take precedence over brand guidelines
- These are defaults/references, not hard requirements
- When in doubt, follow the user's exact words
`.trim();
}

/**
 * Get formatted brand guidelines for a specific campaign
 * (useful if we want to include campaign-specific context in the future)
 */
export async function getCampaignBrandGuidelines(
  userId: string,
  campaignId: string
): Promise<BrandGuidelines> {
  // For now, just get user's brand guidelines
  // In the future, could include campaign-specific overrides
  return getBrandGuidelines(userId);
}

