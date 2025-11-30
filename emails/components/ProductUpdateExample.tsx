/**
 * PATTERN: Product Update Newsletter
 * USE CASE: Multi-feature product announcements with visual highlights and CTAs - perfect for SaaS product updates, changelog announcements, and feature launches with detailed explanations
 * TAGS: product-update, changelog, announcement, feature-launch, saas, newsletter, updates, visual, multi-section, detailed
 */

import {
  Button,
  Heading,
  Hr,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";

export default function ProductUpdateEmail() {
  return (
    <>
      <Section className="mt-2 flex w-full flex-col items-center justify-center">
        <Img
          src="https://res.cloudinary.com/sutharjay/image/upload/v1739369064/me/projects/reactui-email/dub-co.png"
          width="50"
          height="50"
          alt="Company Logo"
          className="mx-0 my-0 rounded-[8px]"
        />
      </Section>
      
      <Section className="mt-4">
        <Heading className="mx-0 mb-8 mt-2 p-0 text-lg font-normal"></Heading>
        <Text className="text-center text-[32px] font-bold leading-[2rem] text-gray-900">
          November Product Update
        </Text>
      </Section>

      <Section className="mt-8">
        <Link href="https://ship.dub.co/home">
          <Img
            src="https://resend-attachments.s3.amazonaws.com/r2ITq7acRxiEkBn"
            alt="New Landing Page"
            className="w-full cursor-pointer rounded-[8px]"
          />
        </Link>
      </Section>

      <Section className="mt-4">
        <Heading className="text-[24px] font-semibold">New landing page</Heading>

        <Text className="text-[16px] leading-6 text-gray-700">
          After almost a year, we just shipped a fresh coat of paint to{" "}
          <Link href="https://ship.dub.co/home" className="text-blue-500">
            our homepage
          </Link>
          .
        </Text>

        <Text className="text-[16px] leading-6 text-gray-700">We did it to:</Text>

        <ul className="list-disc pl-6">
          <li className="text-[14px] leading-6 text-gray-700">
            <strong>Highlight the scale of our infrastructure</strong> – we've gone
            from serving 2M clicks/mo → 20M clicks/mo this year
          </li>
          <li className="text-[14px] leading-6 text-gray-700">
            <strong>Feature some of our new customers</strong> – we've been fortunate to
            power short links for amazing companies like Viator, Product Hunt, Whop, Metabase
            and many more.
          </li>
          <li className="text-[14px] leading-6 text-gray-700">
            <strong>Give a sneak peek of future features</strong> – We've also snuck in
            some subtle hints of features that are coming soon – notably{" "}
            <Link href="https://ship.dub.co/conversions" className="text-blue-500">
              Conversions
            </Link>
            . Stay tuned!
          </li>
          <li className="text-[14px] leading-6 text-gray-700">
            <strong>Highlight SOC2 status</strong> – We've also made a small update to
            our footer to highlight our{" "}
            <Link href="https://ship.dub.co/soc2" className="text-blue-500">
              SOC 2 Type II compliance status
            </Link>{" "}
            – along with a few other style changes.
          </li>
        </ul>

        <Section className="mt-4 text-center">
          <table
            style={{
              border: "1px solid rgb(39 39 42 / 0.2)",
              borderRadius: "8px",
              borderCollapse: "collapse",
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              margin: "0 auto",
              alignItems: "center",
            }}
          >
            <tr>
              <td>
                <Button
                  className="mx-auto flex w-fit items-center justify-center rounded-[8px] bg-white px-[24px] py-[12px] text-center text-[14px] font-semibold text-zinc-900"
                  href="https://ship.dub.co/home"
                >
                  Check out our new homepage
                </Button>
              </td>
            </tr>
          </table>
        </Section>
      </Section>

      <Hr className="my-[32px] h-[1px] w-full border-gray-200" />

      <Section>
        <Link href="https://ship.dub.co/dashboard-sharing">
          <Img
            src="https://resend-attachments.s3.amazonaws.com/Cfmu2QLisOHVh1U"
            alt="Public Analytics Dashboards"
            className="w-full cursor-pointer rounded-[8px]"
          />
        </Link>

        <Heading className="mt-4 text-[20px] font-semibold">
          Public analytics dashboards
        </Heading>

        <Text className="text-[16px] leading-6 text-gray-700">
          You can now create public analytics dashboards for your short links.
        </Text>

        <Text className="text-[16px] leading-6 text-gray-700">
          This allows you to share the analytics for a given short link with clients or other
          external stakeholders without having to invite them to your workspace.
        </Text>

        <Section className="mt-4 text-center">
          <table
            style={{
              border: "1px solid rgb(39 39 42 / 0.2)",
              borderRadius: "8px",
              borderCollapse: "collapse",
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              margin: "0 auto",
              alignItems: "center",
            }}
          >
            <tr>
              <td>
                <Button
                  className="mx-auto flex w-fit items-center justify-center rounded-[8px] bg-white px-[24px] py-[12px] text-center text-[14px] font-semibold text-zinc-900"
                  href="https://ship.dub.co/dashboard-sharing"
                >
                  Read the changelog
                </Button>
              </td>
            </tr>
          </table>
        </Section>
      </Section>

      <Hr className="my-[32px] h-[1px] w-full border-gray-200" />

      <Section>
        <Link href="https://ship.dub.co/custom-qr-logo">
          <Img
            src="https://resend-attachments.s3.amazonaws.com/xqA8pP9aYOcAFqU"
            alt="Custom QR Code Logos"
            className="w-full cursor-pointer rounded-[8px]"
          />
        </Link>

        <Heading className="mt-4 text-[20px] font-semibold">
          Set custom QR code logos for your domains
        </Heading>

        <Text className="text-[16px] leading-6 text-gray-700">
          You can now customize your QR code logos on a per-domain basis.
        </Text>

        <Text className="text-[16px] leading-6 text-gray-700">
          This lets you create more personalized QR codes for each of the brands/products that
          you manage.
        </Text>

        <Section className="mt-4 text-center">
          <table
            style={{
              border: "1px solid rgb(39 39 42 / 0.2)",
              borderRadius: "8px",
              borderCollapse: "collapse",
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              margin: "0 auto",
              alignItems: "center",
            }}
          >
            <tr>
              <td>
                <Button
                  className="mx-auto flex w-fit items-center justify-center rounded-[8px] bg-white px-[24px] py-[12px] text-center text-[14px] font-semibold text-zinc-900"
                  href="https://ship.dub.co/custom-qr-logo"
                >
                  Read the changelog
                </Button>
              </td>
            </tr>
          </table>
        </Section>
      </Section>

      <Hr className="my-[32px] h-[1px] w-full border-gray-200" />

      <Section>
        <Link href="https://ship.dub.co/regions">
          <Img
            src="https://resend-attachments.s3.amazonaws.com/x4tGdEHqZkTfKBd"
            alt="Regions Analytics Support"
            className="w-full cursor-pointer rounded-[8px]"
          />
        </Link>

        <Heading className="mt-4 text-[20px] font-semibold">
          Regions support in analytics
        </Heading>

        <Text className="text-[16px] leading-6 text-gray-700">
          You can now filter your analytics by regions. This is a great way to see which
          regions within a country are driving the most traffic to your links.
        </Text>

        <Text className="text-[16px] leading-6 text-gray-700">
          You can also filter by regions when you export your analytics data.
        </Text>

        <Section className="mt-4 text-center">
          <table
            style={{
              border: "1px solid rgb(39 39 42 / 0.2)",
              borderRadius: "8px",
              borderCollapse: "collapse",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <tr>
              <td>
                <Button
                  className="mx-auto flex w-fit items-center justify-center rounded-[8px] bg-white px-[24px] py-[12px] text-center text-[14px] font-semibold text-zinc-900"
                  href="https://ship.dub.co/home"
                >
                  Read the changelog
                </Button>
              </td>
            </tr>
          </table>
        </Section>
      </Section>

      <Hr className="my-[32px] h-[1px] w-full border-gray-200" />

      <Section>
        <Text className="text-[16px] leading-6 text-gray-700">
          Last but not least, if you've enjoyed using our product so far, we'd{" "}
          <Link href="https://ship.dub.co/g2" className="text-blue-500">
            really appreciate a review
          </Link>{" "}
          – thank you!
        </Text>

        <Text className="mt-4 text-[14px] leading-6 text-gray-700">
          Sincerely, <br /> The Team
        </Text>
      </Section>

      <Hr className="mx-0 my-[14px] h-[1px] w-full border border-solid border-gray-200" />
      
      <Section>
        <Text className="text-[14px] leading-6 text-gray-700">
          © 2024 Your Company{" "}
          <Link href="https://example.com/unsubscribe" className="text-gray-500 underline">
            Unsubscribe
          </Link>
        </Text>
        <Text className="text-[14px] leading-6 text-gray-700">
          If you have any feedback or questions about this email, simply reply to it. We'd love to hear from you!
        </Text>
      </Section>
    </>
  );
}

