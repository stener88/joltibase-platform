/**
 * Example Design Systems
 * 
 * Reference designs for the Design System Agent to learn from
 * These represent high-quality, battle-tested visual systems
 */

import type { DesignSystem } from '../agents/types';

export const EXAMPLE_DESIGN_SYSTEMS: Record<string, DesignSystem> = {
  
  newsletter_minimal: {
    colors: {
      primary: '#4F46E5',
      secondary: '#818CF8',
      heading: '#111827',
      body: '#374151',
      muted: '#6B7280',
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB'
      }
    },
    typography: {
      h1: {
        size: 'text-[36px]',
        weight: 'font-bold',
        leading: 'leading-[40px]'
      },
      h2: {
        size: 'text-[28px]',
        weight: 'font-bold',
        leading: 'leading-[32px]'
      },
      h3: {
        size: 'text-[20px]',
        weight: 'font-semibold',
        leading: 'leading-[28px]'
      },
      body: {
        size: 'text-[16px]',
        weight: 'font-normal',
        leading: 'leading-[24px]'
      },
      small: {
        size: 'text-[14px]',
        weight: 'font-normal',
        leading: 'leading-[20px]'
      }
    },
    spacing: {
      section: 'py-[48px] px-[32px]',
      block: 'mb-[32px]',
      element: 'mb-[16px]',
      tight: 'mb-[8px]'
    },
    effects: {
      borderRadius: 'rounded-[8px]',
      buttonRadius: 'rounded-[6px]',
      shadow: 'shadow-sm',
      buttonStyle: 'solid'
    },
    mood: 'clean-minimal-professional',
    description: 'Clean and spacious design with strong hierarchy. Perfect for newsletters and regular communications.'
  },

  product_launch_bold: {
    colors: {
      primary: '#DC2626',
      secondary: '#FBBF24',
      heading: '#1F2937',
      body: '#374151',
      muted: '#6B7280',
      background: {
        primary: '#FFFFFF',
        secondary: '#FEF3C7'
      }
    },
    typography: {
      h1: {
        size: 'text-[48px]',
        weight: 'font-black',
        leading: 'leading-[48px]',
        tracking: 'tracking-tight'
      },
      h2: {
        size: 'text-[36px]',
        weight: 'font-bold',
        leading: 'leading-[40px]'
      },
      h3: {
        size: 'text-[24px]',
        weight: 'font-bold',
        leading: 'leading-[28px]'
      },
      body: {
        size: 'text-[18px]',
        weight: 'font-normal',
        leading: 'leading-[28px]'
      },
      small: {
        size: 'text-[14px]',
        weight: 'font-medium',
        leading: 'leading-[20px]'
      }
    },
    spacing: {
      section: 'py-[64px] px-[40px]',
      block: 'mb-[40px]',
      element: 'mb-[20px]',
      tight: 'mb-[12px]'
    },
    effects: {
      borderRadius: 'rounded-[12px]',
      buttonRadius: 'rounded-full',
      shadow: 'shadow-lg',
      buttonStyle: 'solid'
    },
    mood: 'bold-energetic-urgent',
    description: 'High-energy design with strong colors and large typography. Perfect for product launches and announcements that need attention.'
  },

  welcome_elegant: {
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      heading: '#0F172A',
      body: '#475569',
      muted: '#94A3B8',
      background: {
        primary: '#FFFFFF',
        secondary: '#F8FAFC'
      }
    },
    typography: {
      h1: {
        size: 'text-[32px]',
        weight: 'font-semibold',
        leading: 'leading-[40px]',
        tracking: 'tracking-wide'
      },
      h2: {
        size: 'text-[24px]',
        weight: 'font-semibold',
        leading: 'leading-[32px]'
      },
      h3: {
        size: 'text-[18px]',
        weight: 'font-semibold',
        leading: 'leading-[24px]'
      },
      body: {
        size: 'text-[16px]',
        weight: 'font-normal',
        leading: 'leading-[26px]'
      },
      small: {
        size: 'text-[13px]',
        weight: 'font-normal',
        leading: 'leading-[18px]'
      }
    },
    spacing: {
      section: 'py-[56px] px-[40px]',
      block: 'mb-[36px]',
      element: 'mb-[18px]',
      tight: 'mb-[10px]'
    },
    effects: {
      borderRadius: 'rounded-[6px]',
      buttonRadius: 'rounded-[4px]',
      shadow: 'shadow-md',
      buttonStyle: 'solid'
    },
    mood: 'elegant-refined-professional',
    description: 'Sophisticated design with refined typography and generous spacing. Perfect for welcome emails and onboarding.'
  },

  flash_sale_urgent: {
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      heading: '#1F2937',
      body: '#374151',
      muted: '#6B7280',
      background: {
        primary: '#FFFFFF',
        secondary: '#FEE2E2'
      }
    },
    typography: {
      h1: {
        size: 'text-[44px]',
        weight: 'font-black',
        leading: 'leading-[44px]',
        tracking: 'tracking-tighter'
      },
      h2: {
        size: 'text-[32px]',
        weight: 'font-bold',
        leading: 'leading-[36px]'
      },
      h3: {
        size: 'text-[22px]',
        weight: 'font-bold',
        leading: 'leading-[26px]'
      },
      body: {
        size: 'text-[16px]',
        weight: 'font-medium',
        leading: 'leading-[22px]'
      },
      small: {
        size: 'text-[13px]',
        weight: 'font-medium',
        leading: 'leading-[18px]'
      }
    },
    spacing: {
      section: 'py-[40px] px-[28px]',
      block: 'mb-[24px]',
      element: 'mb-[12px]',
      tight: 'mb-[6px]'
    },
    effects: {
      borderRadius: 'rounded-[10px]',
      buttonRadius: 'rounded-[8px]',
      shadow: 'shadow-xl',
      buttonStyle: 'solid'
    },
    mood: 'urgent-bold-high-energy',
    description: 'Urgent, attention-grabbing design with tight spacing and bold colors. Perfect for flash sales and time-sensitive offers.'
  }
};

/**
 * Get a fallback design system based on brand
 */
export function getFallbackDesignSystem(brandColor: string): DesignSystem {
  return {
    colors: {
      primary: brandColor,
      secondary: adjustColorBrightness(brandColor, 20),
      heading: '#111827',
      body: '#374151',
      muted: '#6B7280',
      background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB'
      }
    },
    typography: {
      h1: {
        size: 'text-[36px]',
        weight: 'font-bold',
        leading: 'leading-[40px]'
      },
      h2: {
        size: 'text-[28px]',
        weight: 'font-bold',
        leading: 'leading-[32px]'
      },
      h3: {
        size: 'text-[20px]',
        weight: 'font-semibold',
        leading: 'leading-[28px]'
      },
      body: {
        size: 'text-[16px]',
        weight: 'font-normal',
        leading: 'leading-[24px]'
      },
      small: {
        size: 'text-[14px]',
        weight: 'font-normal',
        leading: 'leading-[20px]'
      }
    },
    spacing: {
      section: 'py-[48px] px-[32px]',
      block: 'mb-[32px]',
      element: 'mb-[16px]',
      tight: 'mb-[8px]'
    },
    effects: {
      borderRadius: 'rounded-[8px]',
      buttonRadius: 'rounded-[6px]',
      shadow: 'shadow-sm',
      buttonStyle: 'solid'
    },
    mood: 'safe-fallback-professional',
    description: 'Safe fallback design system using brand color with professional defaults.'
  };
}

/**
 * Simple color brightness adjustment
 */
function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1).toUpperCase();
}

