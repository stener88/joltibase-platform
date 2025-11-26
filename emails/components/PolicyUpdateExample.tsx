/**
 * PATTERN: Policy Update Newsletter
 * USE CASE: Corporate policy updates, announcements, system changes with clear hierarchy
 * TAGS: policy, update, announcement, corporate, formal, structured, professional
 */

import {
  Body,
  Column,
  Container,
  Head,
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

export default function PolicyUpdateEmail() {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#dbddde] font-sans">
          <Preview>Platform Policy Update</Preview>
          <Container className="my-[30px] mx-auto bg-white rounded-[5px] overflow-hidden">
            <Section>
              <Row>
                <Column>
                  <Img
                    className="-mt-px"
                    src={`${baseUrl}/static/header.png`}
                    width="305"
                    height="28"
                    alt="Header"
                  />
                  <Img
                    className="px-10"
                    src={`${baseUrl}/static/logo.png`}
                    width="155"
                    height="31"
                    alt="Logo"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="px-10">
              <Hr className="border-[#e8eaed] my-5" />
              <Text className="text-sm leading-[26px] font-bold text-[#004dcf]">
                PLATFORM UPDATE
              </Text>
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                Hello Developer,
              </Text>
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                We strive to make our platform a safe and trusted experience for
                users.
              </Text>
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                We've added clarifications to our{' '}
                <Link
                  href="https://example.com/policy"
                  className="text-sm leading-[22px] text-[#004dcf]"
                >
                  Platform Policy
                </Link>
                . Because this is a clarification, our enforcement standards and
                practices for this policy remain the same.
              </Text>
            </Section>
            <Section className="pl-10">
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                We're noting exceptions to the{' '}
                <Link
                  href="https://example.com/policy"
                  className="text-sm leading-[22px] text-[#004dcf]"
                >
                  Platform Policy
                </Link>
                , which can be found in our updated{' '}
                <Link
                  href="https://example.com/help"
                  className="text-sm leading-[22px] text-[#004dcf]"
                >
                  Help Center article.
                </Link>{' '}
                These exceptions include specific use cases and configurations.{' '}
                <Link
                  href="https://example.com/learn-more"
                  className="text-sm leading-[22px] text-[#004dcf]"
                >
                  Learn more
                </Link>
              </Text>
            </Section>
            <Section className="px-10">
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                We're also extending the deadline to give you more time to adjust
                to these changes. The new timeline provides additional flexibility
                while maintaining platform security.
              </Text>
              <Hr className="border-[#e8eaed] my-5" />
            </Section>
            <Section className="px-10">
              <Text className="text-sm leading-[22px] text-[#3c4043]">
                Thank you,
              </Text>
              <Text className="text-xl leading-[22px] text-[#3c4043]">
                The Platform Team
              </Text>
            </Section>
            <Section className="bg-[#f0fcff] w-[90%] rounded-[5px] overflow-hidden pl-5">
              <Row>
                <Text className="text-sm leading-[22px] text-[#3c4043]">
                  Connect with us
                </Text>
              </Row>
              <Row align="left" className="w-[84px] float-left">
                <Column className="pr-1">
                  <Link href="https://example.com">
                    <Img
                      width="28"
                      height="28"
                      src={`${baseUrl}/static/icon-chat.png`}
                    />
                  </Link>
                </Column>
                <Column className="pr-1">
                  <Link href="https://example.com">
                    <Img
                      width="28"
                      height="28"
                      src={`${baseUrl}/static/icon-website.png`}
                    />
                  </Link>
                </Column>
                <Column className="pr-1">
                  <Link href="https://example.com">
                    <Img
                      width="28"
                      height="28"
                      src={`${baseUrl}/static/icon-academy.png`}
                    />
                  </Link>
                </Column>
              </Row>
              <Row>
                <Img
                  className="max-w-full"
                  width="540"
                  height="48"
                  src={`${baseUrl}/static/footer-image.png`}
                />
              </Row>
            </Section>
            <Section className="px-10 pb-[30px]">
              <Text className="text-xs leading-[22px] text-[#3c4043] text-center m-0">
                © 2024 Your Company, 123 Main Street, City, State 12345, USA
              </Text>
              <Text className="text-xs leading-[22px] text-[#3c4043] text-center m-0">
                You have received this mandatory email service announcement to
                update you about important changes to your account.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

