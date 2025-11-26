/**
 * PATTERN: Simple Welcome Email
 * USE CASE: Clean welcome message with next steps and resource links
 * TAGS: welcome, onboarding, simple, clean, professional, getting-started
 */

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function WelcomeSimpleEmail() {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] font-sans">
          <Preview>
            You're now ready to get started with our platform!
          </Preview>
          <Container className="bg-white mx-auto py-5 pb-12 mb-16">
            <Section className="px-12">
              <Img
                src={`${baseUrl}/static/logo.png`}
                width="49"
                height="21"
                alt="Logo"
              />
              <Hr className="border-[#e6ebf1] my-5" />
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                Thanks for signing up! You're now ready to start using our
                platform.
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                You can view your dashboard and manage your account settings
                right from your control panel.
              </Text>
              <Button
                className="bg-[#656ee8] rounded-[3px] text-white text-[16px] font-bold no-underline text-center block p-[10px]"
                href="https://example.com/dashboard"
              >
                View your Dashboard
              </Button>
              <Hr className="border-[#e6ebf1] my-5" />
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                If you haven't finished setup, you might find our{' '}
                <Link
                  className="text-[#556cd6]"
                  href="https://example.com/docs"
                >
                  docs
                </Link>{' '}
                handy.
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                Once you're ready to start, you can begin with our quick start
                guide. Check out our{' '}
                <Link
                  className="text-[#556cd6]"
                  href="https://example.com/tutorial"
                >
                  tutorial
                </Link>
                .
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                Finally, we've put together a{' '}
                <Link
                  className="text-[#556cd6]"
                  href="https://example.com/checklist"
                >
                  quick checklist
                </Link>{' '}
                to help you get the most out of our platform.
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                We'll be here to help you with any step along the way. You can
                find answers to most questions on our{' '}
                <Link
                  className="text-[#556cd6]"
                  href="https://example.com/support"
                >
                  support site
                </Link>
                .
              </Text>
              <Text className="text-[#525f7f] text-base leading-6 text-left">
                — The Team
              </Text>
              <Hr className="border-[#e6ebf1] my-5" />
              <Text className="text-[#8898aa] text-xs leading-4">
                Your Company, 123 Main Street, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

