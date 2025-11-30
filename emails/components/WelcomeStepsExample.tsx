/**
 * PATTERN: Welcome Email with Steps
 * USE CASE: Onboarding new users with clear getting started steps and resources - ideal for complex platforms, SaaS products, and structured onboarding flows
 * TAGS: welcome, onboarding, steps, tutorial, getting-started, clean, professional, saas, structured, activation
 */

import {
  Button,
  Column,
  Heading,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function WelcomeSteps() {
  return (
    <>
      <Img
        src={`${baseUrl}/static/logo.png`}
        width="184"
        height="75"
        alt="Logo"
        className="mx-auto my-20"
      />
      <Section className="bg-white p-[45px]">
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
        <ul>
          <li className="mb-5">
            <strong>Complete your profile.</strong>{' '}
            <Link href="https://example.com/profile">Set up your account</Link> with your preferences and settings.
          </li>
          <li className="mb-5">
            <strong>Explore key features.</strong> Discover what makes our platform
            powerful. <Link href="https://example.com/features">Learn the basics</Link>.
          </li>
          <li className="mb-5">
            <strong>Start your first project.</strong> Jump in and create something
            amazing. <Link href="https://example.com/new-project">Get started now</Link>.
          </li>
        </ul>
        <Section className="text-center">
          <Button
            href="https://example.com/dashboard"
            className="rounded-lg bg-blue-600 px-[18px] py-3 text-white"
          >
            Go to your dashboard
          </Button>
        </Section>
        <Section className="mt-[45px]">
          <Row>
            <Column>
              <Link
                className="font-bold text-black underline"
                href="https://example.com/forums"
              >
                Visit the forums
              </Link>{' '}
              <span className="text-green-500">→</span>
            </Column>
            <Column>
              <Link
                className="font-bold text-black underline"
                href="https://example.com/docs"
              >
                Read the docs
              </Link>{' '}
              <span className="text-green-500">→</span>
            </Column>
            <Column>
              <Link
                className="font-bold text-black underline"
                href="https://example.com/contact"
              >
                Contact an expert
              </Link>{' '}
              <span className="text-green-500">→</span>
            </Column>
          </Row>
        </Section>
      </Section>
      <Section className="mt-20">
        <Section>
          <Row>
            <Column className="px-20 text-right">
              <Link href="https://example.com/unsubscribe">Unsubscribe</Link>
            </Column>
            <Column className="text-left">
              <Link href="https://example.com/preferences">Manage Preferences</Link>
            </Column>
          </Row>
        </Section>
        <Text className="mb-[45px] text-center text-gray-400">
          Your Company, 123 Main Street, Suite 300, City, State 12345
        </Text>
      </Section>
    </>
  );
}
