import type { ComponentPattern } from './index';

export const MARKETING_COMPONENTS: ComponentPattern[] = [
  {
    id: 'marketing-bento-grid',
    name: 'Bento Grid',
    description: 'Marketing layout with hero section (dark background, heading, text, link, image) and product grid below',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Section', 'Row', 'Column', 'Heading', 'Text', 'Link', 'Img', 'Tailwind'],
    placeholders: ['previewText', 'heroHeading', 'heroHeadingSize', 'heroHeadingColor', 'heroDescription', 'heroDescriptionColor', 'heroLinkText', 'heroLinkUrl', 'heroLinkColor', 'heroImageUrl', 'heroImageAlt', 'heroImageHeight', 'heroBg', 'product1ImageUrl', 'product1ImageAlt', 'product1Title', 'product1Description', 'product1LinkUrl', 'product2ImageUrl', 'product2ImageAlt', 'product2Title', 'product2Description', 'product2LinkUrl', 'productTitleSize', 'productTitleColor', 'productDescriptionColor', 'productDescriptionSize', 'imageBorderRadius', 'containerBg', 'containerBorderRadius', 'containerMaxWidth', 'spacing'],
    preview: 'Use for marketing emails with hero section and product showcase grid',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body>
      <Preview>{{previewText}}</Preview>
      <Container className="{{containerBg}} {{containerBorderRadius}} mx-auto {{containerMaxWidth}} overflow-hidden p-0">
        <Section>
          <Row className="{{heroBg}} border-separate [border-spacing:24px] m-0 table-fixed w-full">
            <Column className="pl-[12px]">
              <Heading
                as="h1"
                className="{{heroHeadingColor}} {{heroHeadingSize}} font-bold mb-[10px]"
              >
                {{heroHeading}}
              </Heading>
              <Text className="{{heroDescriptionColor}} text-[14px] leading-[20px] m-0">
                {{heroDescription}}
              </Text>
              <Link
                href="{{heroLinkUrl}}"
                className="{{heroLinkColor}} block text-[14px] leading-[20px] font-semibold mt-[12px] no-underline"
              >
                {{heroLinkText}}
              </Link>
            </Column>
            <Column className="w-[42%] h-[250px]">
              <Img
                src="{{heroImageUrl}}"
                alt="{{heroImageAlt}}"
                className="{{imageBorderRadius}} h-full -mr-[6px] object-cover object-center w-full"
              />
            </Column>
          </Row>
        </Section>
        <Section className="mb-[24px]">
          <Row className="border-separate [border-spacing:12px] table-fixed w-full">
            <Column key="product1" className="mx-auto max-w-[180px]">
              <Img
                src="{{product1ImageUrl}}"
                alt="{{product1ImageAlt}}"
                className="{{imageBorderRadius}} mb-[18px] w-full"
              />
              <div>
                <Heading
                  as="h2"
                  className="{{productTitleSize}} leading-[20px] font-bold mb-[8px]"
                >
                  {{product1Title}}
                </Heading>
                <Text className="{{productDescriptionColor}} {{productDescriptionSize}} leading-[20px] m-0 pr-[12px]">
                  {{product1Description}}
                </Text>
              </div>
            </Column>
            <Column key="product2" className="mx-auto max-w-[180px]">
              <Img
                src="{{product2ImageUrl}}"
                alt="{{product2ImageAlt}}"
                className="{{imageBorderRadius}} mb-[18px] w-full"
              />
              <div>
                <Heading
                  as="h2"
                  className="{{productTitleSize}} leading-[20px] font-bold mb-[8px]"
                >
                  {{product2Title}}
                </Heading>
                <Text className="{{productDescriptionColor}} {{productDescriptionSize}} leading-[20px] m-0 pr-[12px]">
                  {{product2Description}}
                </Text>
              </div>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
];


