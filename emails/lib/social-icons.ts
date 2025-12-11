/**
 * Centralized Social Media Icons Configuration
 * 
 * Uses Simple Icons CDN for reliable, fast delivery
 * Default size: 24px × 24px (optimal for email footers)
 * 
 * Why Simple Icons CDN?
 * - Free and reliable (Cloudflare CDN)
 * - 2000+ brand icons available
 * - Color customizable via URL parameter
 * - Works in all email clients
 * - No API key required
 * 
 * @see https://simpleicons.org
 */

export interface SocialIcon {
  name: string;
  url: string;
  color: string;
  alt: string;
}

/**
 * Standard social media icons with brand colors
 * Format: https://cdn.simpleicons.org/{slug}/{color}
 */
export const SOCIAL_ICONS: Record<string, SocialIcon> = {
  twitter: {
    name: 'Twitter/X',
    url: 'https://cdn.simpleicons.org/x/1DA1F2',
    color: '1DA1F2',
    alt: 'Twitter'
  },
  linkedin: {
    name: 'LinkedIn',
    url: 'https://cdn.simpleicons.org/linkedin/0A66C2',
    color: '0A66C2',
    alt: 'LinkedIn'
  },
  facebook: {
    name: 'Facebook',
    url: 'https://cdn.simpleicons.org/facebook/1877F2',
    color: '1877F2',
    alt: 'Facebook'
  },
  instagram: {
    name: 'Instagram',
    url: 'https://cdn.simpleicons.org/instagram/E4405F',
    color: 'E4405F',
    alt: 'Instagram'
  },
  youtube: {
    name: 'YouTube',
    url: 'https://cdn.simpleicons.org/youtube/FF0000',
    color: 'FF0000',
    alt: 'YouTube'
  },
  github: {
    name: 'GitHub',
    url: 'https://cdn.simpleicons.org/github/181717',
    color: '181717',
    alt: 'GitHub'
  },
  tiktok: {
    name: 'TikTok',
    url: 'https://cdn.simpleicons.org/tiktok/000000',
    color: '000000',
    alt: 'TikTok'
  },
  discord: {
    name: 'Discord',
    url: 'https://cdn.simpleicons.org/discord/5865F2',
    color: '5865F2',
    alt: 'Discord'
  },
  slack: {
    name: 'Slack',
    url: 'https://cdn.simpleicons.org/slack/4A154B',
    color: '4A154B',
    alt: 'Slack'
  },
  reddit: {
    name: 'Reddit',
    url: 'https://cdn.simpleicons.org/reddit/FF4500',
    color: 'FF4500',
    alt: 'Reddit'
  },
  pinterest: {
    name: 'Pinterest',
    url: 'https://cdn.simpleicons.org/pinterest/E60023',
    color: 'E60023',
    alt: 'Pinterest'
  },
  whatsapp: {
    name: 'WhatsApp',
    url: 'https://cdn.simpleicons.org/whatsapp/25D366',
    color: '25D366',
    alt: 'WhatsApp'
  },
  telegram: {
    name: 'Telegram',
    url: 'https://cdn.simpleicons.org/telegram/26A5E4',
    color: '26A5E4',
    alt: 'Telegram'
  },
  medium: {
    name: 'Medium',
    url: 'https://cdn.simpleicons.org/medium/000000',
    color: '000000',
    alt: 'Medium'
  },
  substack: {
    name: 'Substack',
    url: 'https://cdn.simpleicons.org/substack/FF6719',
    color: 'FF6719',
    alt: 'Substack'
  }
};

/**
 * Get icon URL with custom color
 * @param platform - Social media platform key
 * @param color - Hex color (without #), defaults to platform's brand color
 * @returns Full CDN URL with color
 */
export function getIconUrl(platform: keyof typeof SOCIAL_ICONS, color?: string): string {
  const icon = SOCIAL_ICONS[platform];
  if (!icon) {
    throw new Error(`Unknown social platform: ${platform}`);
  }
  const iconColor = color || icon.color;
  // Platform slug might differ from key (e.g., 'twitter' -> 'x')
  const slug = platform === 'twitter' ? 'x' : platform;
  return `https://cdn.simpleicons.org/${slug}/${iconColor}`;
}

/**
 * Get grayscale version of icon (useful for minimal footers)
 * @param platform - Social media platform key
 * @returns CDN URL with gray color
 */
export function getGrayscaleIconUrl(platform: keyof typeof SOCIAL_ICONS): string {
  const slug = platform === 'twitter' ? 'x' : platform;
  return `https://cdn.simpleicons.org/${slug}/666666`;
}

/**
 * Get black version of icon (useful for high-contrast designs)
 * @param platform - Social media platform key
 * @returns CDN URL with black color
 */
export function getBlackIconUrl(platform: keyof typeof SOCIAL_ICONS): string {
  const slug = platform === 'twitter' ? 'x' : platform;
  return `https://cdn.simpleicons.org/${slug}/000000`;
}

/**
 * Get white version of icon (useful for dark backgrounds)
 * @param platform - Social media platform key
 * @returns CDN URL with white color
 */
export function getWhiteIconUrl(platform: keyof typeof SOCIAL_ICONS): string {
  const slug = platform === 'twitter' ? 'x' : platform;
  return `https://cdn.simpleicons.org/${slug}/FFFFFF`;
}

/**
 * List of most common platforms for email footers
 * In order of typical priority for B2B/SaaS companies
 */
export const COMMON_FOOTER_PLATFORMS = ['twitter', 'linkedin', 'facebook', 'instagram'] as const;

/**
 * Alternative set for consumer brands
 */
export const CONSUMER_FOOTER_PLATFORMS = ['instagram', 'facebook', 'tiktok', 'twitter'] as const;

/**
 * Alternative set for tech/developer products
 */
export const DEVELOPER_FOOTER_PLATFORMS = ['github', 'twitter', 'discord', 'slack'] as const;

/**
 * Standard TSX pattern for a single social icon
 * Size: 24px × 24px (optimal for email footers)
 * Replace [PLATFORM_URL] and [ICON_URL] with actual values
 */
export const SOCIAL_ICON_PATTERN = `<Column className="px-2">
  <Link href="[PLATFORM_URL]">
    <Img
      src="[ICON_URL]"
      width="24"
      height="24"
      alt="[PLATFORM_NAME]"
      style={{ width: '24px', height: '24px' }}
    />
  </Link>
</Column>`;

/**
 * Standard footer pattern with 4 most common platforms
 * Icons: 24px × 24px with 8px spacing between
 */
export const STANDARD_SOCIAL_FOOTER = `<Section className="mt-8">
  <Row>
    <Column align="center">
      <Text className="mb-4 text-center text-sm font-semibold text-gray-700">
        Follow us:
      </Text>
      <Row className="inline-flex">
        <Column className="px-2">
          <Link href="[TWITTER_URL]">
            <Img
              src="https://cdn.simpleicons.org/x/1DA1F2"
              width="24"
              height="24"
              alt="Twitter"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[LINKEDIN_URL]">
            <Img
              src="https://cdn.simpleicons.org/linkedin/0A66C2"
              width="24"
              height="24"
              alt="LinkedIn"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[FACEBOOK_URL]">
            <Img
              src="https://cdn.simpleicons.org/facebook/1877F2"
              width="24"
              height="24"
              alt="Facebook"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[INSTAGRAM_URL]">
            <Img
              src="https://cdn.simpleicons.org/instagram/E4405F"
              width="24"
              height="24"
              alt="Instagram"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
      </Row>
    </Column>
  </Row>
</Section>`;

export default SOCIAL_ICONS;

