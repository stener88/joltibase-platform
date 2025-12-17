import type { ComponentPattern } from './index';

export const LIST_COMPONENTS: ComponentPattern[] = [
  {
    id: 'list-simple',
    name: 'Simple Numbered List',
    description: 'Numbered list with circular number badges, title, and description for each item',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Heading', 'Section', 'Row', 'Column', 'Text', 'Tailwind'],
    placeholders: ['previewText', 'headingText', 'item1Number', 'item1Title', 'item1Description', 'item2Number', 'item2Title', 'item2Description', 'item3Number', 'item3Title', 'item3Description', 'item4Number', 'item4Title', 'item4Description', 'item5Number', 'item5Title', 'item5Description', 'numberBgColor', 'numberTextColor'],
    preview: 'Use for numbered lists with circular badges, perfect for feature lists or step-by-step guides',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body>
      <Preview>{{previewText}}</Preview>
      <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[24px]">
        <Heading className="mb-[42px] text-center text-[24px] leading-[32px]">
          {{headingText}}
        </Heading>
        <Section className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                >
                  {{item1Number}}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {{item1Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item1Description}}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                >
                  {{item2Number}}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {{item2Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item2Description}}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                >
                  {{item3Number}}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {{item3Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item3Description}}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                >
                  {{item4Number}}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {{item4Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item4Description}}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[36px]">
          <Row className="pr-[32px] pl-[12px]">
            <Column
              width="24"
              height="24"
              align="center"
              valign="top"
              className="pr-[18px] h-[24px] w-[24px]"
            >
              <Row>
                <Column
                  align="center"
                  valign="middle"
                  width="24"
                  height="24"
                  className="h-[24px] w-[24px] rounded-full {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                >
                  {{item5Number}}
                </Column>
              </Row>
            </Column>
            <Column valign="top">
              <Heading
                as="h2"
                className="mt-[0px] mb-[8px] text-gray-900 text-[18px] leading-[28px]"
              >
                {{item5Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item5Description}}
              </Text>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
  {
    id: 'list-image-left',
    name: 'List with Image on Left',
    description: 'Numbered list with images on the left, title, description, and learn more link for each item',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Heading', 'Section', 'Row', 'Column', 'Img', 'Text', 'Link', 'Tailwind'],
    placeholders: ['previewText', 'headingText', 'item1Number', 'item1ImageUrl', 'item1ImageAlt', 'item1Title', 'item1Description', 'item1LearnMoreLink', 'item2Number', 'item2ImageUrl', 'item2ImageAlt', 'item2Title', 'item2Description', 'item2LearnMoreLink', 'item3Number', 'item3ImageUrl', 'item3ImageAlt', 'item3Title', 'item3Description', 'item3LearnMoreLink', 'item4Number', 'item4ImageUrl', 'item4ImageAlt', 'item4Title', 'item4Description', 'item4LearnMoreLink', 'numberBgColor', 'numberTextColor', 'linkColor', 'imageHeight', 'borderRadius'],
    preview: 'Use for step-by-step guides or feature lists with images, perfect for onboarding or product showcases',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body className="bg-white">
      <Preview>{{previewText}}</Preview>
      <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white px-[24px] pt-[24px] pb-0">
        <Heading
          as="h1"
          className="mb-[42px] text-center text-[24px] leading-[32px]"
        >
          {{headingText}}
        </Heading>
        <Section className="mb-[30px]">
          <Row className="mb-[24px]">
            <Column width="40%" className="w-2/5 pr-[24px]">
              <Img
                src="{{item1ImageUrl}}"
                width="100%"
                height={{imageHeight}}
                alt="{{item1ImageAlt}}"
                className="block w-full {{borderRadius}} object-cover object-center"
              />
            </Column>
            <Column width="60%" className="w-3/5 pr-[24px]">
              <Row
                width="24"
                className="w-[24px] h-[24px] mb-[18px]"
                align={undefined}
              >
                <Column
                  width="24"
                  height="24"
                  className="rounded-full h-[24px] w-[24px] {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {{item1Number}}
                </Column>
              </Row>
              <Heading
                as="h2"
                className="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {{item1Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item1Description}}
              </Text>
              <Link
                href="{{item1LearnMoreLink}}"
                className="mt-[12px] block font-semibold {{linkColor}} text-[14px] no-underline"
              >
                Learn more →
              </Link>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[30px]">
          <Row className="mb-[24px]">
            <Column width="40%" className="w-2/5 pr-[24px]">
              <Img
                src="{{item2ImageUrl}}"
                width="100%"
                height={{imageHeight}}
                alt="{{item2ImageAlt}}"
                className="block w-full {{borderRadius}} object-cover object-center"
              />
            </Column>
            <Column width="60%" className="w-3/5 pr-[24px]">
              <Row
                width="24"
                className="w-[24px] h-[24px] mb-[18px]"
                align={undefined}
              >
                <Column
                  width="24"
                  height="24"
                  className="rounded-full h-[24px] w-[24px] {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {{item2Number}}
                </Column>
              </Row>
              <Heading
                as="h2"
                className="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {{item2Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item2Description}}
              </Text>
              <Link
                href="{{item2LearnMoreLink}}"
                className="mt-[12px] block font-semibold {{linkColor}} text-[14px] no-underline"
              >
                Learn more →
              </Link>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[30px]">
          <Row className="mb-[24px]">
            <Column width="40%" className="w-2/5 pr-[24px]">
              <Img
                src="{{item3ImageUrl}}"
                width="100%"
                height={{imageHeight}}
                alt="{{item3ImageAlt}}"
                className="block w-full {{borderRadius}} object-cover object-center"
              />
            </Column>
            <Column width="60%" className="w-3/5 pr-[24px]">
              <Row
                width="24"
                className="w-[24px] h-[24px] mb-[18px]"
                align={undefined}
              >
                <Column
                  width="24"
                  height="24"
                  className="rounded-full h-[24px] w-[24px] {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {{item3Number}}
                </Column>
              </Row>
              <Heading
                as="h2"
                className="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {{item3Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item3Description}}
              </Text>
              <Link
                href="{{item3LearnMoreLink}}"
                className="mt-[12px] block font-semibold {{linkColor}} text-[14px] no-underline"
              >
                Learn more →
              </Link>
            </Column>
          </Row>
        </Section>
        <Section className="mb-[30px]">
          <Row className="mb-[24px]">
            <Column width="40%" className="w-2/5 pr-[24px]">
              <Img
                src="{{item4ImageUrl}}"
                width="100%"
                height={{imageHeight}}
                alt="{{item4ImageAlt}}"
                className="block w-full {{borderRadius}} object-cover object-center"
              />
            </Column>
            <Column width="60%" className="w-3/5 pr-[24px]">
              <Row
                width="24"
                className="w-[24px] h-[24px] mb-[18px]"
                align={undefined}
              >
                <Column
                  width="24"
                  height="24"
                  className="rounded-full h-[24px] w-[24px] {{numberBgColor}} font-semibold {{numberTextColor}} text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {{item4Number}}
                </Column>
              </Row>
              <Heading
                as="h2"
                className="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {{item4Title}}
              </Heading>
              <Text className="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{item4Description}}
              </Text>
              <Link
                href="{{item4LearnMoreLink}}"
                className="mt-[12px] block font-semibold {{linkColor}} text-[14px] no-underline"
              >
                Learn more →
              </Link>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
];


