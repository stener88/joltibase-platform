/**
 * Centralized Social Media Icons Configuration
 * 
 * Uses self-hosted PNG icons for maximum email client compatibility
 * Default size: 32x32 PNG (displayed at 24x24 for retina)
 * 
 * Why PNG instead of SVG?
 * - Works in ALL email clients (Gmail, Outlook, Apple Mail, Yahoo)
 * - SVG has poor support (Outlook strips it entirely)
 * - PNG is the industry standard for email icons
 * 
 * Icons hosted at: /public/email-assets/icons/
 * URLs: Use [APP_URL] placeholder in templates, gets replaced at runtime
 * Example: [APP_URL]/email-assets/icons/twitter.png → http://localhost:3000/email-assets/icons/twitter.png
 */

export interface SocialIcon {
  name: string;
  url: string;
  color: string;
  alt: string;
}

/**
 * Get base URL for email assets
 * Uses NEXT_PUBLIC_APP_URL in production, localhost in development
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Standard social media icons - PNG hosted on your domain
 * Icons are 48x48 PNG displayed at 24x24 for retina displays
 */
export const SOCIAL_ICONS: Record<string, SocialIcon> = {
  twitter: {
    name: 'Twitter/X',
    url: `${getBaseUrl()}/email-assets/icons/twitter.png`,
    color: '1DA1F2',
    alt: 'Twitter'
  },
  linkedin: {
    name: 'LinkedIn',
    url: `${getBaseUrl()}/email-assets/icons/linkedin.png`,
    color: '0A66C2',
    alt: 'LinkedIn'
  },
  facebook: {
    name: 'Facebook',
    url: `${getBaseUrl()}/email-assets/icons/facebook.png`,
    color: '1877F2',
    alt: 'Facebook'
  },
  instagram: {
    name: 'Instagram',
    url: `${getBaseUrl()}/email-assets/icons/instagram.png`,
    color: 'E4405F',
    alt: 'Instagram'
  },
  tiktok: {
    name: 'TikTok',
    url: `${getBaseUrl()}/email-assets/icons/tiktok.png`,
    color: '000000',
    alt: 'TikTok'
  },
  youtube: {
    name: 'YouTube',
    url: `${getBaseUrl()}/email-assets/icons/youtube.png`,
    color: 'FF0000',
    alt: 'YouTube'
  },
  github: {
    name: 'GitHub',
    url: `${getBaseUrl()}/email-assets/icons/github.png`,
    color: '181717',
    alt: 'GitHub'
  },
  discord: {
    name: 'Discord',
    url: `${getBaseUrl()}/email-assets/icons/discord.png`,
    color: '5865F2',
    alt: 'Discord'
  },
  slack: {
    name: 'Slack',
    url: `${getBaseUrl()}/email-assets/icons/slack.png`,
    color: '4A154B',
    alt: 'Slack'
  },
  reddit: {
    name: 'Reddit',
    url: `${getBaseUrl()}/email-assets/icons/reddit.png`,
    color: 'FF4500',
    alt: 'Reddit'
  },
  pinterest: {
    name: 'Pinterest',
    url: `${getBaseUrl()}/email-assets/icons/pinterest.png`,
    color: 'E60023',
    alt: 'Pinterest'
  },
  whatsapp: {
    name: 'WhatsApp',
    url: `${getBaseUrl()}/email-assets/icons/whatsapp.png`,
    color: '25D366',
    alt: 'WhatsApp'
  },
  telegram: {
    name: 'Telegram',
    url: `${getBaseUrl()}/email-assets/icons/telegram.png`,
    color: '26A5E4',
    alt: 'Telegram'
  },
  medium: {
    name: 'Medium',
    url: `${getBaseUrl()}/email-assets/icons/medium.png`,
    color: '000000',
    alt: 'Medium'
  },
  substack: {
    name: 'Substack',
    url: `${getBaseUrl()}/email-assets/icons/substack.png`,
    color: 'FF6719',
    alt: 'Substack'
  }
};

/**
 * Get icon URL with optional custom path
 * @param platform - Social media platform key
 * @param customPath - Optional custom path (for white/gray variants)
 * @returns Full URL to icon PNG
 */
export function getIconUrl(platform: keyof typeof SOCIAL_ICONS, customPath?: string): string {
  const icon = SOCIAL_ICONS[platform];
  if (!icon) {
    throw new Error(`Unknown social platform: ${platform}`);
  }
  if (customPath) {
    return `${getBaseUrl()}${customPath}`;
  }
  return icon.url;
}

/**
 * Get grayscale version of icon (if you create gray variants)
 * @param platform - Social media platform key
 * @returns URL with -gray suffix
 */
export function getGrayscaleIconUrl(platform: keyof typeof SOCIAL_ICONS): string {
  return `${getBaseUrl()}/email-assets/icons/${platform}-gray.png`;
}

/**
 * Get white version of icon (for dark backgrounds)
 * @param platform - Social media platform key
 * @returns URL with -white suffix
 */
export function getWhiteIconUrl(platform: keyof typeof SOCIAL_ICONS): string {
  return `${getBaseUrl()}/email-assets/icons/${platform}-white.png`;
}

/**
 * List of most common platforms for email footers
 * In order of typical priority
 * All icons are self-hosted PNG for maximum compatibility
 */
export const COMMON_FOOTER_PLATFORMS = ['twitter', 'facebook', 'instagram', 'linkedin'] as const;

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
 * Size: 32x32 PNG displayed at 24x24 for retina
 * Use [APP_URL] placeholder - it gets replaced at render time
 */
export const SOCIAL_ICON_PATTERN = (platform: keyof typeof SOCIAL_ICONS) => {
  const icon = SOCIAL_ICONS[platform];
  return `<Column className="px-2">
  <Link href="[PLATFORM_URL]">
    <Img
      src="${icon.url}"
      width="24"
      height="24"
      alt="${icon.alt}"
      style={{ width: '24px', height: '24px' }}
    />
  </Link>
</Column>`;
};

/**
 * Standard footer pattern with most common platforms
 * Icons: 32x32 PNG displayed at 24x24 with 8px spacing
 * Uses self-hosted PNG icons for maximum compatibility
 * [APP_URL] placeholder gets replaced with actual domain at render time
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
              src="${getBaseUrl()}/email-assets/icons/twitter.png"
              width="24"
              height="24"
              alt="Twitter"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[FACEBOOK_URL]">
            <Img
              src="${getBaseUrl()}/email-assets/icons/facebook.png"
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
              src="${getBaseUrl()}/email-assets/icons/instagram.png"
              width="24"
              height="24"
              alt="Instagram"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
        <Column className="px-2">
          <Link href="[LINKEDIN_URL]">
            <Img
              src="${getBaseUrl()}/email-assets/icons/linkedin.png"
              width="24"
              height="24"
              alt="LinkedIn"
              style={{ width: '24px', height: '24px' }}
            />
          </Link>
        </Column>
      </Row>
    </Column>
  </Row>
</Section>`;

export default SOCIAL_ICONS;

