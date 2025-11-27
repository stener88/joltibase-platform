/**
 * PATTERN: Tips & Tricks Newsletter
 * USE CASE: Educational newsletters with structured tips, strong visual hierarchy, and clear CTAs
 * TAGS: newsletter, tips, education, structured, list, learning, tutorial
 */

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function TipsNewsletter() {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f3f3f5] font-sans">
          <Preview>Tips for getting the most out of our platform</Preview>
          <Container className="w-[680px] max-w-full mx-auto bg-white rounded-[5px] overflow-hidden">
            <Section className="flex bg-[#f3f3f5] p-5 px-[30px]">
              <Img width={146} src={`${baseUrl}/static/logo.png`} alt="Company Logo" />
            </Section>

            <Section className="rounded-t-md flex flex-col bg-[#2b2d6e]">
              <Row>
                <Column className="py-5 px-[30px] pb-[15px]">
                  <Heading className="text-white text-[27px] leading-[27px] font-bold">
                    Find what you want, faster
                  </Heading>
                  <Text className="text-white text-[17px] leading-[24px]">
                    Tips and tricks for getting the most out of our platform
                  </Text>
                </Column>
                <Column className="py-[30px] px-[10px]">
                  <Img
                    className="max-w-full"
                    width={340}
                    src={`${baseUrl}/static/header.png`}
                    alt="Header illustration"
                  />
                </Column>
              </Row>
            </Section>

            <Section className="pt-[30px] px-[30px] pb-10">
              <Heading
                as="h2"
                className="mb-[15px] mt-0 font-bold text-[21px] leading-none text-[#0c0d0e]"
              >
                Searching for solutions
              </Heading>
              <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                With millions of questions and answers, it's possible that someone
                has already provided a solution to the problem you're facing.
              </Text>

              <Hr className="my-[30px]" />

              <Heading
                as="h2"
                className="mb-[15px] font-bold text-[21px] leading-none text-[#0c0d0e]"
              >
                Use the search bar to find what you need
              </Heading>
              <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                Here are a few simple search tips to get you started:
              </Text>
              <ul>
                <li>
                  <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                    To find a specific phrase, enter it in quotes: "local storage"
                  </Text>
                </li>
                <li>
                  <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                    To search within specific tag(s), enter them in square brackets: [javascript]
                  </Text>
                </li>
                <li>
                  <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                    Combine them to get even more precise results - [javascript] "local storage" searches for the phrase "local storage" in questions that have the [javascript] tag
                  </Text>
                </li>
              </ul>

              <Text className="text-[15px] leading-[21px] text-[#3c3f44]">
                The more information you can provide, the more likely you will be to
                find the answer you need or feel confident that no one else has
                asked the question before.
              </Text>

              <Hr className="my-[30px]" />

              <Heading
                as="h2"
                className="mb-4 font-bold text-[21px] leading-none text-[#0c0d0e]"
              >
                Take a break and read our latest article
              </Heading>

              <Section className="mt-6 block">
                <Link
                  className="bg-[#0095ff] border border-solid border-[#0077cc] text-[17px] leading-[17px] py-[13px] px-[17px] rounded max-w-[120px] text-white"
                  href="https://example.com/blog"
                >
                  Read More
                </Link>
              </Section>
            </Section>
          </Container>

          <Section className="w-[680px] max-w-full mt-8 mx-auto py-0 px-[30px]">
            <Text className="text-xs leading-[15px] text-[#9199a1] m-0">
              You're receiving this email because of your activity on our platform.
            </Text>

            <Link
              href="/"
              className="inline-block text-[#9199a1] underline text-[12px] mr-[10px] mb-0 mt-2"
            >
              Unsubscribe from emails like this
            </Link>
            <Link
              href="/"
              className="inline-block text-[#9199a1] underline text-[12px] mr-[10px] mb-0 mt-2"
            >
              Edit email settings
            </Link>
            <Link
              href="/"
              className="inline-block text-[#9199a1] underline text-[12px] mr-[10px] mb-0 mt-2"
            >
              Contact us
            </Link>
            <Link
              href="/"
              className="inline-block text-[#9199a1] underline text-[12px] mr-[10px] mb-0 mt-2"
            >
              Privacy
            </Link>

            <Hr className="my-[30px] border-[#d6d8db]" />

            <Img
              width={111}
              src={`${baseUrl}/static/logo.png`}
              alt="Company Logo"
            />
            <Text className="my-1 text-[12px] leading-[15px] text-[#9199a1]">
              <strong>Your Company</strong>, 123 Main Street, Suite 100, City, State 12345
            </Text>
            <Text className="rounded-[1px] border border-solid border-[#d6d9dc] pt-1 pb-[3px] px-[6px] text-[11px] leading-none font-mono text-[#e06c77] max-w-min m-0 mb-8">
              {'<3'}
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

