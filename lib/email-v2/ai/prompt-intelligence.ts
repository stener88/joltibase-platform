/**
 * Prompt Intelligence Layer
 * 
 * Analyzes user prompts to extract intent, structure, and preferences
 * before sending to AI for generation
 */

/**
 * Detect email type from user prompt
 * 
 * Analyzes keywords and patterns to classify the email type
 * 
 * @param prompt - User's natural language prompt
 * @returns Detected email type
 */
export function detectEmailType(prompt: string): 'marketing' | 'transactional' | 'newsletter' {
  const lower = prompt.toLowerCase();
  
  // Newsletter indicators (check first - most specific)
  const newsletterKeywords = [
    'newsletter',
    'weekly update',
    'monthly update',
    'digest',
    'roundup',
    'news update',
    'quarterly report',
    'annual report',
    'investor update',
    'portfolio update',
    'company update',
    'team update',
    'product roundup',
    'feature roundup',
  ];
  
  for (const keyword of newsletterKeywords) {
    if (lower.includes(keyword)) {
      return 'newsletter';
    }
  }
  
  // Transactional indicators
  const transactionalKeywords = [
    'confirm',
    'confirmation',
    'receipt',
    'order confirmation',
    'password reset',
    'reset password',
    'verify',
    'verification',
    'welcome email',
    'onboarding',
    'activation',
    'invoice',
    'shipping',
    'delivery',
    'receipt',
    'payment',
    'subscription',
  ];
  
  for (const keyword of transactionalKeywords) {
    if (lower.includes(keyword)) {
      return 'transactional';
    }
  }
  
  // Marketing indicators (explicit)
  const marketingKeywords = [
    'launch',
    'product launch',
    'announcement',
    'promote',
    'promotion',
    'sale',
    'discount',
    'limited time',
    'special offer',
    'new feature',
    'upgrade',
    'trial',
    'demo',
    'webinar',
    'event invitation',
    'press release',
    'movie',
    'film',
    'campaign',
    'marketing',
  ];
  
  for (const keyword of marketingKeywords) {
    if (lower.includes(keyword)) {
      return 'marketing';
    }
  }
  
  // Check sentence structure patterns
  
  // Newsletter patterns: "Can you make me a newsletter...", "Create a newsletter..."
  if (lower.match(/\b(make|create|generate|build)\s+(me\s+)?a\s+newsletter/)) {
    return 'newsletter';
  }
  
  // Transactional patterns: "Send a confirmation...", "User needs to verify..."
  if (lower.match(/\b(send|needs?|require)\s+(a\s+)?(confirmation|verification|receipt|password)/)) {
    return 'transactional';
  }
  
  // Default to marketing (most common type)
  return 'marketing';
}

/**
 * Parse color preferences from natural language
 * 
 * Extracts explicit color requests from user prompts
 * 
 * @param prompt - User's natural language prompt
 * @returns Detected color preferences (undefined if none found)
 */
export function parseColorPreferences(prompt: string): {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
} | undefined {
  const lower = prompt.toLowerCase();
  const colors: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  } = {};
  
  // Background color detection
  if (lower.includes('white background')) {
    colors.backgroundColor = '#ffffff';
  } else if (lower.includes('black background') || lower.includes('dark background')) {
    colors.backgroundColor = '#000000';
  } else if (lower.includes('gray background') || lower.includes('grey background')) {
    colors.backgroundColor = '#f3f4f6';
  } else if (lower.includes('light background')) {
    colors.backgroundColor = '#f9fafb';
  }
  
  // Primary color detection from color names
  const colorMap: Record<string, string> = {
    // Greens
    'forest green': '#228B22',
    'dark green': '#006400',
    'darker green': '#004d00',
    'darker/forest green': '#228B22',
    'emerald green': '#50C878',
    'olive green': '#808000',
    'sage green': '#87AE73',
    'green': '#228B22',
    'lime green': '#32CD32',
    'mint green': '#98FB98',
    // Blues
    'ocean blue': '#006994',
    'navy blue': '#000080',
    'sky blue': '#87CEEB',
    'blue': '#2563eb',
    'royal blue': '#4169E1',
    'teal': '#008080',
    // Reds
    'crimson red': '#DC143C',
    'burgundy': '#800020',
    'red': '#DC143C',
    'scarlet': '#FF2400',
    // Purples
    'royal purple': '#7851A9',
    'lavender': '#E6E6FA',
    'purple': '#7c3aed',
    'violet': '#8A2BE2',
    // Oranges
    'burnt orange': '#CC5500',
    'vivid orange': '#FF9F1C',
    'orange': '#FF9F1C',
    // Yellows
    'yellow': '#FFD700',
    'gold': '#FFD700',
    // Grays/Neutrals
    'charcoal': '#36454F',
    'slate': '#708090',
  };
  
  // Check for color names in prompt (handle variations like "darker/forest green")
  for (const [colorName, hexColor] of Object.entries(colorMap)) {
    // Normalize color name for matching (remove slashes, handle variations)
    const normalizedColorName = colorName.replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
    const normalizedLower = lower.replace(/\//g, ' ').replace(/\s+/g, ' ');
    
    // Check if prompt contains the color name or its parts
    if (normalizedLower.includes(normalizedColorName) || 
        normalizedColorName.split(' ').every(word => normalizedLower.includes(word))) {
      colors.primaryColor = hexColor;
      // If it's a dark color, also set background
      if (colorName.includes('dark') || colorName.includes('forest')) {
        colors.backgroundColor = colors.backgroundColor || '#f9fafb';
      }
      break;
    }
  }
  
  // Also check for "color scheme" pattern explicitly
  if (!colors.primaryColor && (lower.includes('color scheme') || lower.includes('colour scheme'))) {
    // Extract words before "color scheme"
    const schemeMatch = lower.match(/([a-z\s\/]+?)\s+(?:color|colour)\s+scheme/);
    if (schemeMatch) {
      const colorDesc = schemeMatch[1].trim().replace(/\//g, ' ');
      // Check individual color words
      if (colorDesc.includes('forest') && colorDesc.includes('green')) {
        colors.primaryColor = '#228B22';
      } else if (colorDesc.includes('dark') && colorDesc.includes('green')) {
        colors.primaryColor = '#006400';
      } else if (colorDesc.includes('green')) {
        colors.primaryColor = '#228B22';
      }
    }
  }
  
  // Text color detection
  if (lower.includes('black text')) {
    colors.textColor = '#000000';
  } else if (lower.includes('white text')) {
    colors.textColor = '#ffffff';
  } else if (lower.includes('dark text')) {
    colors.textColor = '#1f2937';
  } else if (lower.includes('gray text') || lower.includes('grey text')) {
    colors.textColor = '#6b7280';
  }
  
  // Style descriptors that imply colors
  if (lower.includes('plain') || lower.includes('minimal') || lower.includes('simple')) {
    colors.backgroundColor = colors.backgroundColor || '#ffffff';
    colors.textColor = colors.textColor || '#000000';
  }
  
  if (lower.includes('clean')) {
    colors.backgroundColor = colors.backgroundColor || '#ffffff';
  }
  
  // Color scheme detection
  if (lower.includes('color scheme') || lower.includes('colour scheme')) {
    // Extract color mentioned before "color scheme"
    const schemeMatch = lower.match(/([a-z\s]+?)\s+(?:color|colour)\s+scheme/);
    if (schemeMatch) {
      const colorDesc = schemeMatch[1].trim();
      // Check if it matches any color name
      for (const [colorName, hexColor] of Object.entries(colorMap)) {
        if (colorDesc.includes(colorName) || colorName.includes(colorDesc)) {
          colors.primaryColor = hexColor;
          break;
        }
      }
    }
  }
  
  // Return undefined if no colors detected
  return Object.keys(colors).length > 0 ? colors : undefined;
}

/**
 * Parse structure hints from prompt
 * 
 * Detects grid layouts, item counts, and table requirements
 * 
 * @param prompt - User's natural language prompt
 * @returns Structure hints (undefined if none found)
 */
export function parseStructureHints(prompt: string): {
  gridLayout?: { columns: number; rows: number };
  itemCount?: number;
  needsTable?: boolean;
  needsLogo?: boolean;
} | undefined {
  const lower = prompt.toLowerCase();
  const hints: {
    gridLayout?: { columns: number; rows: number };
    itemCount?: number;
    needsTable?: boolean;
    needsLogo?: boolean;
  } = {};
  
  // Grid pattern detection: "8 columns with 3 rows", "3x4 grid", "4 cols × 3 rows"
  const gridPatterns = [
    /(\d+)\s*(columns?|cols?)\s*(with|and|×|x)\s*(\d+)\s*(rows?)/i,
    /(\d+)\s*[×x]\s*(\d+)\s*(grid|layout|table)/i,
    /(\d+)\s*(rows?)\s*(with|and|×|x)\s*(\d+)\s*(columns?|cols?)/i, // reversed order
  ];
  
  for (const pattern of gridPatterns) {
    const match = prompt.match(pattern);
    if (match) {
      // Handle both "X columns × Y rows" and "X × Y grid" patterns
      let columns: number, rows: number;
      
      if (pattern.toString().includes('columns?|cols?')) {
        // "8 columns with 3 rows"
        columns = parseInt(match[1]);
        rows = parseInt(match[4]);
      } else if (pattern.toString().includes('rows?')) {
        // "3 rows with 8 columns" (reversed)
        rows = parseInt(match[1]);
        columns = parseInt(match[4]);
      } else {
        // "3x4 grid" or "3 × 4"
        columns = parseInt(match[1]);
        rows = parseInt(match[2]);
      }
      
      hints.gridLayout = { columns, rows };
      hints.itemCount = columns * rows;
      hints.needsTable = true;
      break;
    }
  }
  
  // Item count detection: "24 investments", "12 portfolio companies", "15 products"
  const countPatterns = [
    /(\d+)\s+(investments?|companies|portfolios?|products?|items?|startups?|ventures?)/i,
    /(highlighting|showcase|featuring)\s+(our\s+)?(\d+)/i,
  ];
  
  for (const pattern of countPatterns) {
    const match = prompt.match(pattern);
    if (match) {
      const count = pattern.toString().includes('highlighting') 
        ? parseInt(match[3])
        : parseInt(match[1]);
      
      if (!hints.itemCount) {
        hints.itemCount = count;
      }
      
      // If many items, likely needs table/grid
      if (count > 8) {
        hints.needsTable = true;
      }
      break;
    }
  }
  
  // Logo detection
  if (lower.includes('logo in')) {
    hints.needsLogo = true;
  } else if (lower.match(/\blogo\b.*\b(header|top|first)\b/)) {
    hints.needsLogo = true;
  } else if (lower.match(/\b(header|top)\b.*\blogo\b/)) {
    hints.needsLogo = true;
  }
  
  // Return undefined if no hints detected
  return Object.keys(hints).length > 0 ? hints : undefined;
}

/**
 * Font preferences detected from prompt
 */
export interface FontPreferences {
  fontFamily?: string;
  fontWeight?: 'bold' | 'normal' | 'light';
  fontStyle?: 'vivid' | 'elegant' | 'modern' | 'classic';
}

/**
 * Tone type for email content
 */
export type ToneType = 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent' | 'playful';

/**
 * Content type for email structure
 */
export type ContentType = 
  | 'press-release' 
  | 'announcement' 
  | 'sale' 
  | 'update' 
  | 'story' 
  | 'product-launch'
  | 'event'
  | 'newsletter'
  | 'transactional';

/**
 * Detect font preferences from prompt
 * 
 * @param prompt - User's natural language prompt
 * @returns Detected font preferences (undefined if none found)
 */
export function detectFontPreferences(prompt: string): FontPreferences | undefined {
  const lower = prompt.toLowerCase();
  const preferences: FontPreferences = {};
  
  // Font style detection
  if (lower.includes('vivid fonts') || lower.includes('vivid typography') || lower.includes('bold fonts')) {
    preferences.fontStyle = 'vivid';
    preferences.fontWeight = 'bold';
  } else if (lower.includes('elegant fonts') || lower.includes('elegant typography')) {
    preferences.fontStyle = 'elegant';
  } else if (lower.includes('modern fonts') || lower.includes('modern typography')) {
    preferences.fontStyle = 'modern';
  } else if (lower.includes('classic fonts') || lower.includes('classic typography')) {
    preferences.fontStyle = 'classic';
  }
  
  // Font weight detection
  if (lower.includes('bold') && (lower.includes('font') || lower.includes('typography') || lower.includes('text'))) {
    preferences.fontWeight = 'bold';
  } else if (lower.includes('light') && (lower.includes('font') || lower.includes('typography'))) {
    preferences.fontWeight = 'light';
  }
  
  // Font family detection
  if (lower.includes('sans-serif') || lower.includes('sans serif')) {
    preferences.fontFamily = 'system-ui, -apple-system, sans-serif';
  } else if (lower.includes('serif')) {
    preferences.fontFamily = 'Georgia, serif';
  } else if (lower.includes('monospace') || lower.includes('mono')) {
    preferences.fontFamily = 'Monaco, monospace';
  }
  
  return Object.keys(preferences).length > 0 ? preferences : undefined;
}

/**
 * Detect tone from prompt
 * 
 * @param prompt - User's natural language prompt
 * @returns Detected tone (defaults to 'professional')
 */
export function detectTone(prompt: string): ToneType {
  const lower = prompt.toLowerCase();
  
  // Formal tone indicators
  const formalKeywords = [
    'press release',
    'press release',
    'announcement',
    'official statement',
    'formal',
    'corporate',
    'professional announcement',
  ];
  
  for (const keyword of formalKeywords) {
    if (lower.includes(keyword)) {
      return 'formal';
    }
  }
  
  // Urgent tone indicators
  const urgentKeywords = [
    'urgent',
    'asap',
    'immediate',
    'emergency',
    'breaking',
    'limited time',
    'act now',
    'don\'t miss',
  ];
  
  for (const keyword of urgentKeywords) {
    if (lower.includes(keyword)) {
      return 'urgent';
    }
  }
  
  // Casual tone indicators
  const casualKeywords = [
    'casual',
    'relaxed',
    'informal',
    'friendly update',
    'quick note',
    'just wanted to',
  ];
  
  for (const keyword of casualKeywords) {
    if (lower.includes(keyword)) {
      return 'casual';
    }
  }
  
  // Playful tone indicators
  const playfulKeywords = [
    'fun',
    'playful',
    'exciting',
    'celebration',
    'party',
    'festive',
  ];
  
  for (const keyword of playfulKeywords) {
    if (lower.includes(keyword)) {
      return 'playful';
    }
  }
  
  // Friendly tone indicators
  const friendlyKeywords = [
    'friendly',
    'warm',
    'welcoming',
    'hello',
    'hi there',
  ];
  
  for (const keyword of friendlyKeywords) {
    if (lower.includes(keyword)) {
      return 'friendly';
    }
  }
  
  // Default to professional
  return 'professional';
}

/**
 * Detect content type from prompt
 * 
 * @param prompt - User's natural language prompt
 * @returns Detected content type (undefined if none found)
 */
export function detectContentType(prompt: string): ContentType | undefined {
  const lower = prompt.toLowerCase();
  
  // Press release
  if (lower.includes('press release') || lower.includes('press-release')) {
    return 'press-release';
  }
  
  // Product launch
  if (lower.includes('product launch') || lower.includes('launching') || lower.includes('introducing')) {
    return 'product-launch';
  }
  
  // Sale/promotion
  if (lower.includes('sale') || lower.includes('discount') || lower.includes('promotion') || 
      lower.includes('deal') || lower.includes('offer') || lower.includes('special')) {
    return 'sale';
  }
  
  // Event
  if (lower.includes('event') || lower.includes('webinar') || lower.includes('conference') || 
      lower.includes('workshop') || lower.includes('meetup')) {
    return 'event';
  }
  
  // Announcement
  if (lower.includes('announcement') || lower.includes('announcing') || lower.includes('we\'re excited')) {
    return 'announcement';
  }
  
  // Update
  if (lower.includes('update') || lower.includes('news') || lower.includes('what\'s new')) {
    return 'update';
  }
  
  // Story/narrative
  if (lower.includes('story') || lower.includes('narrative') || lower.includes('journey') || 
      lower.includes('behind the scenes')) {
    return 'story';
  }
  
  // Newsletter (already detected by email type, but can be more specific)
  if (lower.includes('newsletter') || lower.includes('digest') || lower.includes('roundup')) {
    return 'newsletter';
  }
  
  // Transactional (already detected by email type)
  if (lower.includes('confirm') || lower.includes('receipt') || lower.includes('order')) {
    return 'transactional';
  }
  
  return undefined;
}

/**
 * Comprehensive prompt preprocessing
 * 
 * Analyzes prompt and returns all detected metadata
 * 
 * @param prompt - User's natural language prompt
 * @param options - Additional context
 * @returns Preprocessed prompt with metadata
 */
export interface PreprocessedPrompt {
  originalPrompt: string;
  emailType: 'marketing' | 'transactional' | 'newsletter';
  colorPreferences?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  structureHints?: {
    gridLayout?: { columns: number; rows: number };
    itemCount?: number;
    needsTable?: boolean;
    needsLogo?: boolean;
  };
  fontPreferences?: FontPreferences;
  tone?: ToneType;
  contentType?: ContentType;
  detectedFeatures: string[];
  suggestedMaxBlocks: number;
  enhancedPrompt: string;
}

export function preprocessPrompt(
  prompt: string,
  options?: {
    campaignType?: string;
  }
): PreprocessedPrompt {
  const emailType = detectEmailType(prompt);
  const colors = parseColorPreferences(prompt);
  const structure = parseStructureHints(prompt);
  const fonts = detectFontPreferences(prompt);
  const tone = detectTone(prompt);
  const contentType = detectContentType(prompt);
  
  // Detect features
  const features: string[] = [];
  if (structure?.needsLogo) features.push('logo');
  if (structure?.needsTable) features.push('table/grid');
  if (colors) features.push('custom colors');
  if (fonts) features.push('font preferences');
  if (tone !== 'professional') features.push(`tone: ${tone}`);
  if (contentType) features.push(`content type: ${contentType}`);
  
  // Calculate suggested max blocks - capped at 8 for visual focus
  let suggestedMaxBlocks = 8; // Maximum 8 blocks - prioritize visual/styling over text density
  
  // Adjust based on email type (but never exceed 8)
  if (emailType === 'transactional') {
    suggestedMaxBlocks = 6; // Simpler for transactional
  }
  
  // Note: No longer increasing for item count or promotional - keep it visual and concise
  
  // Build enhanced prompt with detected metadata
  let enhancedPrompt = prompt;
  
  // Add hints if detected
  const hints: string[] = [];
  
  if (colors) {
    const colorHints: string[] = [];
    if (colors.backgroundColor) colorHints.push(`background: ${colors.backgroundColor}`);
    if (colors.textColor) colorHints.push(`text: ${colors.textColor}`);
    if (colors.primaryColor) colorHints.push(`primary: ${colors.primaryColor}`);
    hints.push(`Colors: ${colorHints.join(', ')}`);
  }
  
  if (fonts) {
    const fontHints: string[] = [];
    if (fonts.fontStyle) fontHints.push(`style: ${fonts.fontStyle}`);
    if (fonts.fontWeight) fontHints.push(`weight: ${fonts.fontWeight}`);
    if (fonts.fontFamily) fontHints.push(`family: ${fonts.fontFamily}`);
    hints.push(`Fonts: ${fontHints.join(', ')}`);
  }
  
  if (tone !== 'professional') {
    hints.push(`Tone: ${tone}`);
  }
  
  if (contentType) {
    hints.push(`Content type: ${contentType}`);
  }
  
  if (structure?.gridLayout) {
    hints.push(
      `Grid layout: ${structure.gridLayout.columns} columns × ${structure.gridLayout.rows} rows (${structure.itemCount} total items)`
    );
  } else if (structure?.itemCount) {
    hints.push(`Item count: ${structure.itemCount} items`);
  }
  
  if (structure?.needsLogo) {
    hints.push('Logo required in header');
  }
  
  if (hints.length > 0) {
    enhancedPrompt = `${prompt}\n\nDETECTED REQUIREMENTS:\n${hints.map(h => `- ${h}`).join('\n')}`;
  }
  
  return {
    originalPrompt: prompt,
    emailType,
    colorPreferences: colors,
    structureHints: structure,
    fontPreferences: fonts,
    tone,
    contentType,
    detectedFeatures: features,
    suggestedMaxBlocks,
    enhancedPrompt,
  };
}

