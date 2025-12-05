/**
 * Font Configuration for React Email
 * 
 * Defines available fonts for the email editor.
 * Web fonts require the <Font> component from React Email.
 */

export interface FontDefinition {
  value: string;           // CSS font-family value
  label: string;           // Display name in UI
  webFont: boolean;        // Whether it requires <Font> component
  url?: string;            // Google Fonts woff2 URL (for web fonts)
  weights?: number[];      // Available font weights
}

// System fonts - no <Font> component needed
// NOTE: Values must NOT contain quotes - they break JSX when inserted as inline styles
export const SYSTEM_FONTS: FontDefinition[] = [
  { 
    value: 'inherit', 
    label: 'Default', 
    webFont: false,
  },
  { 
    value: 'system-ui, -apple-system, sans-serif', 
    label: 'System', 
    webFont: false,
  },
  { 
    value: 'Georgia, serif', 
    label: 'Georgia', 
    webFont: false,
  },
  { 
    value: 'monospace', 
    label: 'Mono', 
    webFont: false,
  },
];

// Web fonts - require <Font> component
export const WEB_FONTS: FontDefinition[] = [
  { 
    value: 'Inter, sans-serif', 
    label: 'Inter',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
    weights: [400, 500, 600, 700],
  },
  { 
    value: 'Poppins, sans-serif', 
    label: 'Poppins',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
    weights: [400, 500, 600, 700],
  },
  { 
    value: 'Outfit, sans-serif', 
    label: 'Outfit',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2',
    weights: [400, 500, 600, 700],
  },
  { 
    value: '"Space Grotesk", sans-serif', 
    label: 'Space Grotesk',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj62UUsjNsFjTDJK.woff2',
    weights: [400, 500, 600, 700],
  },
  { 
    value: '"DM Sans", sans-serif', 
    label: 'DM Sans',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/dmsans/v14/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR232VGM.woff2',
    weights: [400, 500, 600, 700],
  },
  { 
    value: 'Lora, serif', 
    label: 'Lora',
    webFont: true,
    url: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2',
    weights: [400, 500, 600, 700],
  },
];

// All fonts combined
export const ALL_FONTS: FontDefinition[] = [...SYSTEM_FONTS, ...WEB_FONTS];

// Standard fallback chain for web fonts
export const FONT_FALLBACK = ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'];

/**
 * Get font definition by value
 */
export function getFontByValue(value: string): FontDefinition | undefined {
  return ALL_FONTS.find(f => f.value === value);
}

/**
 * Get font definition by label
 */
export function getFontByLabel(label: string): FontDefinition | undefined {
  return ALL_FONTS.find(f => f.label.toLowerCase() === label.toLowerCase());
}

/**
 * Check if a font value requires the <Font> component
 */
export function requiresFontComponent(fontValue: string): boolean {
  const font = getFontByValue(fontValue);
  return font?.webFont ?? false;
}

/**
 * Generate the <Font> component JSX for a web font
 */
export function generateFontComponentCode(fontValue: string, weight: number = 400): string | null {
  const font = getFontByValue(fontValue);
  if (!font?.webFont || !font.url) return null;
  
  const fontFamily = font.label; // Use the clean label name
  
  return `<Font
            fontFamily="${fontFamily}"
            fallbackFontFamily={${JSON.stringify(FONT_FALLBACK)}}
            webFont={{
              url: '${font.url}',
              format: 'woff2',
            }}
            fontWeight={${weight}}
            fontStyle="normal"
          />`;
}

/**
 * Extract all web fonts used in TSX code
 */
export function extractWebFontsFromCode(tsxCode: string): FontDefinition[] {
  const usedFonts: FontDefinition[] = [];
  
  for (const font of WEB_FONTS) {
    // Check if the font family is used in style props
    const fontName = font.label;
    const patterns = [
      `fontFamily: '${fontName}`,
      `fontFamily: "${fontName}`,
      `font-family: ${fontName}`,
      `'${fontName},`,
      `"${fontName},`,
    ];
    
    if (patterns.some(pattern => tsxCode.includes(pattern))) {
      usedFonts.push(font);
    }
  }
  
  return usedFonts;
}

/**
 * Generate all <Font> component declarations for used web fonts
 */
export function generateAllFontComponents(tsxCode: string): string {
  const usedFonts = extractWebFontsFromCode(tsxCode);
  
  if (usedFonts.length === 0) return '';
  
  const fontComponents = usedFonts.map(font => {
    // Generate for multiple weights if the font supports them
    const weights = font.weights || [400];
    return weights.map(weight => generateFontComponentCode(font.value, weight)).join('\n          ');
  });
  
  return fontComponents.join('\n          ');
}

