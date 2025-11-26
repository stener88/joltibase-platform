/**
 * PATTERN: Challenge/Event Newsletter
 * USE CASE: Weekly challenges, community events, educational content with ideas and resources
 * TAGS: challenge, event, newsletter, community, education, creative, vibrant, engagement
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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function ChallengeNewsletter() {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="font-sans bg-[#505050] m-0">
          <Preview>#Challenge: Create Something Amazing</Preview>
          <Section className="w-full bg-[#191919] m-0 mx-auto pb-[30px] z-[999]">
            <Img
              className="mx-auto max-w-full"
              src={`${baseUrl}/static/challenge-header.png`}
              width={600}
              alt="Challenge"
            />
          </Section>
          <Container className="mx-auto w-[648px] max-w-full relative">
            <Text className="bg-[#505050] text-center py-[10px] text-[13px] absolute w-[648px] max-w-full top-[-28px] m-0 mb-4">
              <Link className="text-white cursor-pointer">
                View this Challenge Online
              </Link>
            </Text>
            <Heading className="bg-[#f0d361] p-[30px] text-[#191919] font-normal mb-0">
              <strong>This week:</strong> #Challenge:{' '}
              <Text className="text-[32px] mt-1 mb-0">Creative Theme</Text>
            </Heading>
            <Section className="m-0 bg-white py-0 px-6">
              <Text className="text-base">The challenge continues!</Text>
              <Text className="text-base">
                Last week, we gathered amazing submissions. Check out our{' '}
                <Link className="text-[#15c] cursor-pointer">
                  previous challenge collection
                </Link>
                .
              </Text>
              <Text className="text-base">This week's theme is all about creativity 🎨</Text>
              <Text className="text-base">
                Creating amazing experiences is all about mastery of your craft.
                Take control of design and code to make something special.
              </Text>
              <Text className="text-base">
                This week is a fun chance to work on your creative skills and explore
                new techniques.
              </Text>
              <Text className="text-base border-[6px] border-solid border-[#ebd473] p-5 m-0 mb-10">
                💪 <strong>Your Challenge:</strong>{' '}
                <Link className="text-[#15c] cursor-pointer">
                  create a project based on this week's theme.
                </Link>
              </Text>
              <Img
                className="max-w-full"
                src={`${baseUrl}/static/challenge-feature.png`}
                width={600}
                alt="Featured example"
              />
              <Section className="mt-10 mb-6 text-center bg-[#0b112a] text-white pt-[35px] pb-[30px] px-5 border-[6px] border-solid border-[#2138c6]">
                <Img
                  className="mx-auto mb-[30px]"
                  src={`${baseUrl}/static/pro-badge.png`}
                  width={250}
                  alt="PRO"
                />
                <Text>
                  Upgrade to PRO for advanced features and exclusive resources.
                </Text>
                <Button className="bg-[#2138c6] text-white border-0 text-[15px] leading-[18px] cursor-pointer rounded p-3">
                  <strong>Learn More</strong>
                </Button>
              </Section>
            </Section>
            <Text className="bg-[#f5d247] p-[30px] text-lg leading-[1.5]">
              <strong>To participate:</strong>{' '}
              <Link className="text-[#15c] cursor-pointer">Create a project →</Link>{' '}
              and tag it appropriately. We'll be gathering submissions and sharing
              on social media.
            </Text>
            <Section className="m-0 bg-white px-6">
              <Row>
                <Column className="w-1/2 pr-[10px]">
                  <Text className="font-black text-lg leading-[1.1]">IDEAS!</Text>
                  <Section className="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#fff4c8] border border-solid border-[#f4d247]">
                    🌟
                    <Text className="text-[13px] text-left">
                      Try exploring different design patterns and techniques to
                      create something unique and engaging.
                    </Text>
                  </Section>
                </Column>
                <Column className="w-1/2 pl-[10px]">
                  <Text className="font-black -mt-10 text-lg leading-[1.1]">
                    RESOURCES!
                  </Text>
                  <Section className="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]">
                    📖
                    <Text className="text-[13px] text-left">
                      Check out our tutorials and examples from the community for
                      inspiration and learning.
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>
            <Section className="mt-[40px] mb-[120px] text-center">
              <Button className="text-[26px] text-[#15c] bg-[#222] rounded font-bold cursor-pointer py-[15px] px-[30px]">
                Go to Challenge Page
              </Button>
            </Section>
            <Section className="bg-white text-[#505050] px-6 mb-12">
              <Text className="text-[13px]">
                You can adjust your{' '}
                <Link className="underline text-[#505050] cursor-pointer">
                  email preferences
                </Link>{' '}
                any time, or{' '}
                <Link className="underline text-[#505050] cursor-pointer">
                  instantly opt out
                </Link>{' '}
                of emails of this kind. Need help?{' '}
                <Link className="underline text-[#505050] cursor-pointer">
                  Contact support
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

