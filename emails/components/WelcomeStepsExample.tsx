/**
 * PATTERN: Welcome Email with Steps
 * USE CASE: Onboarding new users with clear getting started steps and resources
 * TAGS: welcome, onboarding, steps, tutorial, getting-started, clean, professional
 */

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

interface WelcomeStepsProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: {
    title: string;
    href: string;
  }[];
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function WelcomeSteps({
  steps = [
    {
      id: 1,
      Description: (
        <li className="mb-5" key={1}>
          <strong>Complete your profile.</strong>{' '}
          <Link>Set up your account</Link> with your preferences and settings.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-5" key={2}>
          <strong>Explore key features.</strong> Discover what makes our platform
          powerful. <Link>Learn the basics</Link>.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-5" key={3}>
          <strong>Start your first project.</strong> Jump in and create something
          amazing. <Link>Get started now</Link>.
        </li>
      ),
    },
  ],
  links = [
    {
      title: 'Visit the forums',
      href: 'https://example.com',
    },
    { title: 'Read the docs', href: 'https://example.com' },
    { title: 'Contact an expert', href: 'https://example.com' },
  ],
}: WelcomeStepsProps) {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#fafbfb] font-sans text-base">
          <Preview>Welcome to our platform</Preview>
          <Img
            src={`${baseUrl}/static/logo.png`}
            width="184"
            height="75"
            alt="Logo"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-[45px]">
            <Heading className="my-0 text-center leading-8">
              Welcome to our platform
            </Heading>
            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations! You're joining millions of users around the
                  world who use our platform to build and ship amazing projects.
                </Text>
                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>
            <ul>{steps?.map(({ Description }) => Description)}</ul>
            <Section className="text-center">
              <Button className="rounded-lg bg-brand-600 px-[18px] py-3 text-white">
                Go to your dashboard
              </Button>
            </Section>
            <Section className="mt-[45px]">
              <Row>
                {links?.map((link) => (
                  <Column key={link.title}>
                    <Link
                      className="font-bold text-black underline"
                      href={link.href}
                    >
                      {link.title}
                    </Link>{' '}
                    <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>
          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="px-20 text-right">
                  <Link>Unsubscribe</Link>
                </Column>
                <Column className="text-left">
                  <Link>Manage Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className="mb-[45px] text-center text-gray-400">
              Your Company, 123 Main Street, Suite 300, City, State 12345
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

