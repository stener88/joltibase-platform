import type { ComponentPattern } from './index';

export const ARTICLE_COMPONENTS: ComponentPattern[] = [
  {
    id: 'article-image-top',
    name: 'Article with Image on Top',
    description: 'Article layout with hero image on top, followed by category, title, description, and CTA button',
    category: 'content',
    components: ['Section', 'Img', 'Text', 'Heading', 'Button', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'imageHeight', 'borderRadius', 'categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonPadding', 'buttonBorderRadius'],
    preview: 'Use for article/blog post layouts with hero image, headline, and call-to-action',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Img
      alt="{{imageAlt}}"
      className="w-full {{borderRadius}} object-cover"
      height={{imageHeight}}
      src="{{imageUrl}}"
    />
    <Section className="mt-[32px] text-center">
      <Text className="my-[16px] font-semibold text-[18px] {{categoryColor}} leading-[28px]">
        {{categoryText}}
      </Text>
      <Heading
        as="h1"
        className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[36px]"
      >
        {{titleText}}
      </Heading>
      <Text className="text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
      <Button
        className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
        href="{{buttonUrl}}"
      >
        {{buttonText}}
      </Button>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'article-image-right',
    name: 'Article with Image on Right',
    description: 'Article layout with text content on left and image on right, side by side',
    category: 'content',
    components: ['Section', 'Text', 'Link', 'Img', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'linkText', 'linkUrl', 'linkColor', 'imageUrl', 'imageAlt', 'imageWidth', 'imageHeight', 'borderRadius', 'textMaxWidth', 'imageMaxWidth'],
    preview: 'Use for article layouts with text on left and image on right',
    template: `<Tailwind>
  <Section className="my-[16px] text-center">
    <Section className="inline-block w-full max-w-[{{textMaxWidth}}px] text-left align-top">
      <Text className="m-0 font-semibold text-[16px] {{categoryColor}} leading-[24px]">
        {{categoryText}}
      </Text>
      <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
        {{titleText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
      <Link className="{{linkColor}} underline" href="{{linkUrl}}">
        {{linkText}}
      </Link>
    </Section>
    <Section className="my-[8px] inline-block w-full max-w-[{{imageMaxWidth}}px] align-top">
      <Img
        alt="{{imageAlt}}"
        className="{{borderRadius}} object-cover"
        height={{imageHeight}}
        src="{{imageUrl}}"
        width={{imageWidth}}
      />
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'article-image-background',
    name: 'Article with Image as Background',
    description: 'Article layout with background image, text overlay, and CTA button',
    category: 'content',
    components: ['Text', 'Heading', 'Button', 'Tailwind'],
    placeholders: ['backgroundImageUrl', 'categoryText', 'categoryColor', 'titleText', 'titleColor', 'descriptionText', 'descriptionColor', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonBorder', 'buttonTextColor', 'buttonPadding', 'buttonBorderRadius', 'height', 'borderRadius', 'padding'],
    preview: 'Use for hero article sections with background image and overlay text',
    template: `<Tailwind>
  <table
    align="center"
    border={0}
    cellPadding="0"
    cellSpacing="0"
    className="my-[16px] h-[{{height}}px] {{borderRadius}} bg-blue-600"
    role="presentation"
    style={{
      backgroundImage: "url('{{backgroundImageUrl}}')",
      backgroundSize: '100% 100%',
    }}
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" className="{{padding}} text-center">
          <Text className="m-0 font-semibold {{categoryColor}}">{{categoryText}}</Text>
          <Heading as="h1" className="m-0 mt-[4px] font-bold {{titleColor}}">
            {{titleText}}
          </Heading>
          <Text className="m-0 mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
            {{descriptionText}}
          </Text>
          <Button
            className="mt-[24px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
            href="{{buttonUrl}}"
          >
            {{buttonText}}
          </Button>
        </td>
      </tr>
    </tbody>
  </table>  
</Tailwind>`
  },
  {
    id: 'article-two-cards',
    name: 'Article with Two Cards',
    description: 'Article layout with heading/description on top and two side-by-side article cards with images',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Column', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'card1ImageUrl', 'card1ImageAlt', 'card1CategoryText', 'card1CategoryColor', 'card1TitleText', 'card1TitleSize', 'card1TitleColor', 'card1DescriptionText', 'card1DescriptionColor', 'card2ImageUrl', 'card2ImageAlt', 'card2CategoryText', 'card2CategoryColor', 'card2TitleText', 'card2TitleSize', 'card2TitleColor', 'card2DescriptionText', 'card2DescriptionColor', 'imageHeight', 'borderRadius', 'spacing'],
    preview: 'Use for article collections with multiple article cards displayed side by side',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[28px]">
        {{headingText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
    </Row>
    <Row className="mt-[16px]">
      <Column
        className="box-border w-[50%] pr-[8px] align-baseline"
        colSpan={1}
      >
        <Img
          alt="{{card1ImageAlt}}"
          className="w-full {{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{card1ImageUrl}}"
        />
        <Text className="font-semibold text-[16px] {{card1CategoryColor}} leading-[24px]">
          {{card1CategoryText}}
        </Text>
        <Text className="m-0 font-semibold {{card1TitleSize}} {{card1TitleColor}} leading-[28px]">
          {{card1TitleText}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{card1DescriptionColor}} leading-[24px]">
          {{card1DescriptionText}}
        </Text>
      </Column>
      <Column
        className="box-border w-[50%] pl-[8px] align-baseline"
        colSpan={1}
      >
        <Img
          alt="{{card2ImageAlt}}"
          className="w-full {{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{card2ImageUrl}}"
        />
        <Text className="font-semibold text-[16px] {{card2CategoryColor}} leading-[24px]">
          {{card2CategoryText}}
        </Text>
        <Text className="m-0 font-semibold {{card2TitleSize}} {{card2TitleColor}} leading-[28px]">
          {{card2TitleText}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{card2DescriptionColor}} leading-[24px]">
          {{card2DescriptionText}}
        </Text>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
];

