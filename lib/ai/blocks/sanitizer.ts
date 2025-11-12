/**
 * AI Block Sanitizer
 * 
 * Provides sensible defaults for missing required fields in AI-generated blocks.
 * This ensures blocks pass Zod validation even when AI omits optional-looking
 * but actually required fields.
 */

/**
 * Default values for common block settings
 */
const DEFAULTS = {
  // Typography
  fontWeight: {
    heading: 700,
    text: 400,
    button: 700,
    label: 400,
  },
  lineHeight: {
    heading: '1.2',
    text: '1.6',
    footer: '1.6',
  },
  // Spacing
  padding: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  // Stats
  labelFontWeight: 400,
  // Comparison
  cellPadding: 24,
} as const;

/**
 * Sanitize a single block by adding missing required fields
 */
export function sanitizeBlock(block: any): any {
  if (!block || typeof block !== 'object') {
    return block;
  }

  const sanitized = { ...block };
  
  // Ensure settings object exists
  if (!sanitized.settings) {
    sanitized.settings = {};
  }

  // Type-specific sanitization
  switch (block.type) {
    case 'heading':
      sanitized.settings = sanitizeHeadingBlock(sanitized.settings);
      break;
      
    case 'text':
      sanitized.settings = sanitizeTextBlock(sanitized.settings);
      break;
      
    case 'button':
      sanitized.settings = sanitizeButtonBlock(sanitized.settings);
      break;
      
    case 'stats':
      sanitized.settings = sanitizeStatsBlock(sanitized.settings);
      break;
      
    case 'footer':
      sanitized.settings = sanitizeFooterBlock(sanitized.settings);
      break;
      
    case 'comparison':
      sanitized.settings = sanitizeComparisonBlock(sanitized.settings);
      break;
      
    case 'testimonial':
      sanitized.settings = sanitizeTestimonialBlock(sanitized.settings);
      break;
      
    case 'hero':
      sanitized.settings = sanitizeHeroBlock(sanitized.settings);
      break;
      
    case 'feature-grid':
      sanitized.settings = sanitizeFeatureGridBlock(sanitized.settings);
      break;
      
    case 'divider':
      sanitized.settings = sanitizeDividerBlock(sanitized.settings);
      break;
      
    case 'logo':
      sanitized.settings = sanitizeLogoBlock(sanitized.settings);
      break;
      
    case 'image':
      sanitized.settings = sanitizeImageBlock(sanitized.settings);
      break;
      
    case 'spacer':
      sanitized.settings = sanitizeSpacerBlock(sanitized.settings);
      break;
      
    case 'social-links':
      sanitized.settings = sanitizeSocialLinksBlock(sanitized.settings);
      break;
  }

  return sanitized;
}

/**
 * Sanitize array of blocks
 */
export function sanitizeBlocks(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) {
    console.warn('[SANITIZER] Blocks is not an array:', typeof blocks);
    return [];
  }

  const sanitized = blocks.map((block, index) => {
    const result = sanitizeBlock(block);
    
    // Log when defaults were added (for debugging)
    const addedFields = findAddedFields(block, result);
    if (addedFields.length > 0) {
      console.log(`[SANITIZER] Block ${index} (${block.type}): Added defaults for: ${addedFields.join(', ')}`);
    }
    
    return result;
  });

  return sanitized;
}

/**
 * Sanitize heading block settings
 */
function sanitizeHeadingBlock(settings: any): any {
  return {
    ...settings,
    fontWeight: settings.fontWeight ?? DEFAULTS.fontWeight.heading,
    lineHeight: settings.lineHeight ?? DEFAULTS.lineHeight.heading,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize text block settings
 */
function sanitizeTextBlock(settings: any): any {
  return {
    ...settings,
    fontWeight: settings.fontWeight ?? DEFAULTS.fontWeight.text,
    lineHeight: settings.lineHeight ?? DEFAULTS.lineHeight.text,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize button block settings
 */
function sanitizeButtonBlock(settings: any): any {
  return {
    ...settings,
    fontWeight: settings.fontWeight ?? DEFAULTS.fontWeight.button,
    padding: settings.padding ?? DEFAULTS.padding,
    containerPadding: settings.containerPadding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize stats block settings
 */
function sanitizeStatsBlock(settings: any): any {
  return {
    ...settings,
    labelFontWeight: settings.labelFontWeight ?? DEFAULTS.labelFontWeight,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize footer block settings
 */
function sanitizeFooterBlock(settings: any): any {
  return {
    ...settings,
    lineHeight: settings.lineHeight ?? DEFAULTS.lineHeight.footer,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize comparison block settings
 */
function sanitizeComparisonBlock(settings: any): any {
  const sanitized = {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
    cellPadding: settings.cellPadding ?? DEFAULTS.cellPadding,
  };

  // Fix common field name errors from AI
  // AI often uses wrong field names, so we map them to correct ones
  if (settings.beforeColor && !settings.beforeBackgroundColor) {
    sanitized.beforeBackgroundColor = settings.beforeColor;
    delete sanitized.beforeColor;
  }
  if (settings.afterColor && !settings.afterBackgroundColor) {
    sanitized.afterBackgroundColor = settings.afterColor;
    delete sanitized.afterColor;
  }
  if (settings.labelColor && !settings.beforeLabelColor) {
    sanitized.beforeLabelColor = settings.labelColor;
    delete sanitized.labelColor;
  }
  if (settings.labelColorAfter && !settings.afterLabelColor) {
    sanitized.afterLabelColor = settings.labelColorAfter;
    delete sanitized.labelColorAfter;
  }
  if (settings.fontSize && !settings.contentFontSize) {
    sanitized.contentFontSize = settings.fontSize;
    delete sanitized.fontSize;
  }
  if (settings.fontWeight && !settings.labelFontWeight) {
    sanitized.labelFontWeight = settings.fontWeight;
    delete sanitized.fontWeight;
  }
  
  // Add required fields with defaults if missing
  if (!sanitized.labelFontSize) {
    sanitized.labelFontSize = '14px';
  }
  if (!sanitized.contentFontSize) {
    sanitized.contentFontSize = '17px';
  }
  if (!sanitized.contentColor) {
    sanitized.contentColor = '#111827';
  }
  if (!sanitized.labelFontWeight) {
    sanitized.labelFontWeight = 700;
  }
  if (!sanitized.beforeBackgroundColor) {
    sanitized.beforeBackgroundColor = '#fef2f2';
  }
  if (!sanitized.afterBackgroundColor) {
    sanitized.afterBackgroundColor = '#f0fdf4';
  }
  if (!sanitized.beforeLabelColor) {
    sanitized.beforeLabelColor = '#dc2626';
  }
  if (!sanitized.afterLabelColor) {
    sanitized.afterLabelColor = '#16a34a';
  }
  
  // Remove fields not in schema
  delete sanitized.lineHeight;
  delete sanitized.align;

  return sanitized;
}

/**
 * Sanitize testimonial block settings
 */
function sanitizeTestimonialBlock(settings: any): any {
  const sanitized = {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
  };
  
  // Remove 'align' field - not in schema
  delete sanitized.align;
  
  return sanitized;
}

/**
 * Sanitize hero block settings
 */
function sanitizeHeroBlock(settings: any): any {
  const sanitized = {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
  };
  
  // Remove 'lineHeight' field - not in schema for hero
  delete sanitized.lineHeight;
  
  return sanitized;
}

/**
 * Sanitize feature-grid block settings
 */
function sanitizeFeatureGridBlock(settings: any): any {
  return {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize divider block settings
 */
function sanitizeDividerBlock(settings: any): any {
  const sanitized = {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
  };
  
  // Fix common field name error: height → thickness
  if (settings.height && !settings.thickness) {
    sanitized.thickness = settings.height;
    delete sanitized.height;
  }
  
  return sanitized;
}

/**
 * Sanitize logo block settings
 */
function sanitizeLogoBlock(settings: any): any {
  return {
    ...settings,
    align: settings.align ?? 'center',
    width: settings.width ?? '150px',
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize image block settings
 */
function sanitizeImageBlock(settings: any): any {
  return {
    ...settings,
    align: settings.align ?? 'center',
    width: settings.width ?? '100%',
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Sanitize spacer block settings
 */
function sanitizeSpacerBlock(settings: any): any {
  // Spacer doesn't need padding, just height
  return {
    ...settings,
    height: settings.height ?? 40,
  };
}

/**
 * Sanitize social-links block settings
 */
function sanitizeSocialLinksBlock(settings: any): any {
  return {
    ...settings,
    padding: settings.padding ?? DEFAULTS.padding,
  };
}

/**
 * Helper: Find which fields were added during sanitization
 */
function findAddedFields(original: any, sanitized: any): string[] {
  const added: string[] = [];
  
  if (!original.settings || !sanitized.settings) {
    return added;
  }
  
  for (const key in sanitized.settings) {
    if (sanitized.settings[key] !== undefined && original.settings[key] === undefined) {
      added.push(`settings.${key}`);
    }
  }
  
  return added;
}

