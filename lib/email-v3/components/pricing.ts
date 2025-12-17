import type { ComponentPattern } from './index';

export const PRICING_COMPONENTS: ComponentPattern[] = [
  {
    id: 'pricing-simple-table',
    name: 'Simple Pricing Table',
    description: 'Single pricing card with price, description, feature list, and CTA button',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Section', 'Text', 'Button', 'Hr', 'Tailwind'],
    placeholders: ['previewText', 'badgeText', 'badgeColor', 'price', 'pricePeriod', 'priceSize', 'priceColor', 'descriptionText', 'descriptionColor', 'feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'featureColor', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'disclaimerText', 'disclaimerColor', 'footerText', 'footerColor', 'containerBg', 'containerBorderRadius', 'containerPadding', 'cardBorder', 'cardBorderRadius', 'cardPadding'],
    preview: 'Use for single pricing offers with feature list and call-to-action',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body>
      <Preview>
        {{previewText}}
      </Preview>
      <Container className="{{containerBg}} {{containerBorderRadius}} mx-auto max-w-[500px] {{containerPadding}}">
        <Section className="bg-white {{cardBorder}} {{cardBorderRadius}} text-gray-600 {{cardPadding}} w-full text-left mb-0">
          <Text className="{{badgeColor}} text-[12px] leading-[20px] font-semibold tracking-wide mb-[16px] mt-[16px] uppercase">
            {{badgeText}}
          </Text>
          <Text className="{{priceSize}} font-bold leading-[36px] mb-[12px] mt-0">
            <span className="{{priceColor}}">{{price}}</span>{' '}
            <span className="text-[16px] font-medium leading-[20px]">
              {{pricePeriod}}
            </span>
          </Text>
          <Text className="{{descriptionColor}} text-[14px] leading-[20px] mt-[16px] mb-[24px]">
            {{descriptionText}}
          </Text>
          <ul className="{{featureColor}} text-[14px] leading-[24px] mb-[32px] pl-[14px]">
            <li key="feature1" className="mb-[12px] relative">
              <span className="relative">{{feature1}}</span>
            </li>
            <li key="feature2" className="mb-[12px] relative">
              <span className="relative">{{feature2}}</span>
            </li>
            <li key="feature3" className="mb-[12px] relative">
              <span className="relative">{{feature3}}</span>
            </li>
            <li key="feature4" className="mb-[12px] relative">
              <span className="relative">{{feature4}}</span>
            </li>
            <li key="feature5" className="mb-[12px] relative">
              <span className="relative">{{feature5}}</span>
            </li>
          </ul>
          <Button
            href="{{buttonUrl}}"
            className="{{buttonBg}} {{buttonBorderRadius}} box-border {{buttonTextColor}} inline-block text-[16px] leading-[24px] font-bold tracking-wide mb-[24px] max-w-full {{buttonPadding}} text-center w-full"
          >
            {{buttonText}}
          </Button>
          <Hr />
          <Text className="{{disclaimerColor}} text-[12px] leading-[16px] italic mt-[24px] mb-[6px] text-center">
            {{disclaimerText}}
          </Text>
          <Text className="{{footerColor}} text-[12px] m-0 leading-[16px] text-center">
            {{footerText}}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
  {
    id: 'pricing-two-tiers',
    name: 'Two Tiers with Emphasized Tier',
    description: 'Two pricing tiers side by side, with one highlighted/emphasized tier',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Section', 'Heading', 'Text', 'Button', 'Hr', 'Tailwind'],
    placeholders: ['previewText', 'headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'tier1Title', 'tier1Price', 'tier1Description', 'tier1Feature1', 'tier1Feature2', 'tier1Feature3', 'tier1Feature4', 'tier1ButtonText', 'tier1ButtonUrl', 'tier1CardClassName', 'tier1TitleColor', 'tier1PriceColor', 'tier2Title', 'tier2Price', 'tier2Description', 'tier2Feature1', 'tier2Feature2', 'tier2Feature3', 'tier2Feature4', 'tier2Feature5', 'tier2Feature6', 'tier2ButtonText', 'tier2ButtonUrl', 'tier2CardClassName', 'tier2TitleColor', 'tier2PriceColor', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'featureColor', 'footerText', 'footerColor', 'containerBg', 'containerBorderRadius', 'containerPadding', 'cardBorderRadius', 'cardPadding', 'spacing'],
    preview: 'Use for comparing two pricing tiers with one highlighted as recommended',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body>
      <Preview>{{previewText}}</Preview>
      <Container className="{{containerBg}} {{containerBorderRadius}} mx-auto max-w-[600px] {{containerPadding}}">
        <Section className="mb-[42px]">
          <Heading className="{{headingSize}} leading-[32px] mb-[12px] text-center">
            {{headingText}}
          </Heading>
          <Text className="{{descriptionColor}} text-[14px] leading-[20px] mx-auto max-w-[500px] text-center">
            {{descriptionText}}
          </Text>
        </Section>
        <Section className="flex items-start gap-[20px] justify-center pb-[24px]">
          <Section
            className="{{tier1CardClassName}} {{cardBorderRadius}} border border-solid {{cardPadding}} text-left w-full"
          >
            <Text
              className="{{tier1TitleColor}} text-[14px] leading-[20px] font-semibold mb-[16px]"
            >
              {{tier1Title}}
            </Text>
            <Text className="text-[28px] font-bold mb-[8px] mt-0">
              <span className="{{tier1PriceColor}}">
                \${{tier1Price}}
              </span>{' '}
              <span className="text-[14px] leading-[20px]">/ month</span>
            </Text>
            <Text className="mt-[12px] mb-[24px]">{{tier1Description}}</Text>
            <ul className="text-[12px] leading-[20px] mb-[30px] pl-[14px] {{featureColor}}">
              <li key="tier1-feature1" className="mb-[8px]">{{tier1Feature1}}</li>
              <li key="tier1-feature2" className="mb-[8px]">{{tier1Feature2}}</li>
              <li key="tier1-feature3" className="mb-[8px]">{{tier1Feature3}}</li>
              <li key="tier1-feature4" className="mb-[8px]">{{tier1Feature4}}</li>
            </ul>
            <Button
              href="{{tier1ButtonUrl}}"
              className="{{buttonBg}} {{buttonBorderRadius}} box-border {{buttonTextColor}} inline-block font-semibold m-0 max-w-full {{buttonPadding}} text-center w-full"
            >
              {{tier1ButtonText}}
            </Button>
          </Section>
          <Section
            className="{{tier2CardClassName}} {{cardBorderRadius}} border border-solid {{cardPadding}} text-left w-full"
          >
            <Text
              className="{{tier2TitleColor}} text-[14px] leading-[20px] font-semibold mb-[16px]"
            >
              {{tier2Title}}
            </Text>
            <Text className="text-[28px] font-bold mb-[8px] mt-0">
              <span className="{{tier2PriceColor}}">
                \${{tier2Price}}
              </span>{' '}
              <span className="text-[14px] leading-[20px]">/ month</span>
            </Text>
            <Text className="mt-[12px] mb-[24px]">{{tier2Description}}</Text>
            <ul className="text-[12px] leading-[20px] mb-[30px] pl-[14px] {{featureColor}}">
              <li key="tier2-feature1" className="mb-[8px]">{{tier2Feature1}}</li>
              <li key="tier2-feature2" className="mb-[8px]">{{tier2Feature2}}</li>
              <li key="tier2-feature3" className="mb-[8px]">{{tier2Feature3}}</li>
              <li key="tier2-feature4" className="mb-[8px]">{{tier2Feature4}}</li>
              <li key="tier2-feature5" className="mb-[8px]">{{tier2Feature5}}</li>
              <li key="tier2-feature6" className="mb-[8px]">{{tier2Feature6}}</li>
            </ul>
            <Button
              href="{{tier2ButtonUrl}}"
              className="{{buttonBg}} {{buttonBorderRadius}} box-border {{buttonTextColor}} inline-block font-semibold m-0 max-w-full {{buttonPadding}} text-center w-full"
            >
              {{tier2ButtonText}}
            </Button>
          </Section>
        </Section>
        <Hr className="mt-0" />
        <Text className="{{footerColor}} text-[12px] leading-[16px] font-medium mt-[30px] text-center">
          {{footerText}}
        </Text>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
];


