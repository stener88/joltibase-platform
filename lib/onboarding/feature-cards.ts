/**
 * Feature cards shown during first-time email generation
 * Educates users on key features while they wait (15-30 seconds)
 */

export interface FeatureCardMedia {
  type: 'image' | 'gif' | 'video';
  src: string;
  poster?: string; // Thumbnail for videos
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  media: FeatureCardMedia;
}

/**
 * Feature cards to display during generation
 * Order matters - most important features first
 */
export const featureCards: FeatureCard[] = [
  {
    id: 'visual-edit',
    title: 'Edit visually',
    description: 'Click any element to edit text, colors, and spacing. See changes instantly in the preview.',
    media: {
      type: 'image',
      src: '/onboarding/visual-edit.svg',
    },
  },
  {
    id: 'brand-settings',
    title: 'Add your brand',
    description: 'Set your logo, colors, and tone of voice. Every email will match your brand identity.',
    media: {
      type: 'image',
      src: '/onboarding/brand-settings.svg',
    },
  },
  {
    id: 'ai-refine',
    title: 'Refine with AI',
    description: 'Just describe what you want changed in natural language. AI handles the code for you.',
    media: {
      type: 'image',
      src: '/onboarding/ai-refine.svg',
    },
  },
  {
    id: 'export',
    title: 'Export anywhere',
    description: 'Copy clean HTML or download your email. Works with any email platform.',
    media: {
      type: 'image',
      src: '/onboarding/export.svg',
    },
  },
  {
    id: 'chat-history',
    title: 'Full edit history',
    description: 'Every change is tracked. Go back to any version or continue from where you left off.',
    media: {
      type: 'image',
      src: '/onboarding/chat-history.svg',
    },
  },
];

/**
 * Get rotation interval based on number of cards
 * Ensures all cards are seen during typical generation time (15-30s)
 */
export function getRotationInterval(cardCount: number = featureCards.length): number {
  // Aim to show each card at least once in ~20 seconds
  const targetTotalTime = 20000; // 20 seconds
  const intervalPerCard = Math.floor(targetTotalTime / cardCount);
  
  // Clamp between 3-5 seconds per card
  return Math.max(3000, Math.min(5000, intervalPerCard));
}

