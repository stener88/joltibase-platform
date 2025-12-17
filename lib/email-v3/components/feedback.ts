import type { ComponentPattern } from './index';

export const FEEDBACK_COMPONENTS: ComponentPattern[] = [
  {
    id: 'feedback-rating-survey',
    name: 'Simple Rating Survey',
    description: 'Full email survey with rating scale (1-5), question, and feedback text',
    category: 'content',
    components: ['Html', 'Head', 'Body', 'Preview', 'Container', 'Heading', 'Text', 'Section', 'Row', 'Column', 'Button', 'Hr', 'Tailwind'],
    placeholders: ['previewText', 'questionText', 'questionSize', 'questionColor', 'descriptionText', 'descriptionColor', 'leftLabel', 'rightLabel', 'labelColor', 'button1Url', 'button2Url', 'button3Url', 'button4Url', 'button5Url', 'buttonBg', 'buttonTextColor', 'buttonSize', 'buttonBorderRadius', 'footerText', 'footerColor', 'containerBg', 'containerPadding', 'containerBorderRadius'],
    preview: 'Use for customer satisfaction surveys with 1-5 rating scale',
    template: `<Tailwind>
  <Html>
    <Head />
    <Body>
      <Preview>
        {{previewText}}
      </Preview>
      <Container className="mx-auto max-w-[600px] {{containerBorderRadius}} {{containerBg}} {{containerPadding}}">
        <Heading className="mb-[16px] {{questionSize}} leading-[32px]">
          {{questionText}}
        </Heading>
        <Text className="mb-[42px] {{descriptionColor}} text-[14px] leading-[24px]">
          {{descriptionText}}
        </Text>
        <Section className="max-w-[300px]">
          <Row>
            <Column className="w-[100px] text-center">
              <Text className="ml-[12px] text-left {{labelColor}} text-[12px] leading-none">
                {{leftLabel}}
              </Text>
            </Column>
            <Column className="w-[100px] text-center">
              <Text className="mr-[12px] text-right {{labelColor}} text-[12px] leading-none">
                {{rightLabel}}
              </Text>
            </Column>
          </Row>
        </Section>
        <Section className="mt-[12px] mb-[24px]" align="center">
          <Row width={undefined}>
            <Column
              width="51"
              height="43"
              className="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                href="{{button1Url}}"
                className="box-border w-[43px] h-[43px] {{buttonBorderRadius}} {{buttonBg}} p-[12px] m-0 text-center font-semibold text-[16px] {{buttonTextColor}} leading-none"
              >
                1
              </Button>
            </Column>
            <Column
              width="51"
              height="43"
              className="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                href="{{button2Url}}"
                className="box-border w-[43px] h-[43px] {{buttonBorderRadius}} {{buttonBg}} p-[12px] m-0 text-center font-semibold text-[16px] {{buttonTextColor}} leading-none"
              >
                2
              </Button>
            </Column>
            <Column
              width="51"
              height="43"
              className="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                href="{{button3Url}}"
                className="box-border w-[43px] h-[43px] {{buttonBorderRadius}} {{buttonBg}} p-[12px] m-0 text-center font-semibold text-[16px] {{buttonTextColor}} leading-none"
              >
                3
              </Button>
            </Column>
            <Column
              width="51"
              height="43"
              className="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                href="{{button4Url}}"
                className="box-border w-[43px] h-[43px] {{buttonBorderRadius}} {{buttonBg}} p-[12px] m-0 text-center font-semibold text-[16px] {{buttonTextColor}} leading-none"
              >
                4
              </Button>
            </Column>
            <Column
              width="51"
              height="43"
              className="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                href="{{button5Url}}"
                className="box-border w-[43px] h-[43px] {{buttonBorderRadius}} {{buttonBg}} p-[12px] m-0 text-center font-semibold text-[16px] {{buttonTextColor}} leading-none"
              >
                5
              </Button>
            </Column>
          </Row>
        </Section>
        <Section>
          <Hr />
          <Text className="mt-[30px] text-center font-medium {{footerColor}} text-[12px] leading-[16px]">
            {{footerText}}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>  
</Tailwind>`
  },
  {
    id: 'feedback-survey-section',
    name: 'Survey Section',
    description: 'Survey section with question and 1-5 rating buttons in a table layout',
    category: 'content',
    components: ['Section', 'Text', 'Heading', 'Row', 'Column', 'Button', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'categorySize', 'questionText', 'questionSize', 'questionColor', 'descriptionText', 'descriptionColor', 'button1Url', 'button2Url', 'button3Url', 'button4Url', 'button5Url', 'buttonBorder', 'buttonTextColor', 'buttonSize', 'buttonBorderRadius', 'buttonPadding'],
    preview: 'Use for simple survey sections with rating buttons',
    template: `<Tailwind>
  <Section className="py-[16px] text-center">
    <Text className="my-[8px] font-semibold {{categorySize}} {{categoryColor}} leading-[28px]">
      {{categoryText}}
    </Text>
    <Heading
      as="h1"
      className="m-0 mt-[8px] font-semibold {{questionSize}} {{questionColor}} leading-[36px]"
    >
      {{questionText}}
    </Heading>
    <Text className="text-[16px] {{descriptionColor}} leading-[24px]">
      {{descriptionText}}
    </Text>
    <Row>
      <Column align="center">
        <table>
          <tr>
            <td align="center" className="p-[4px]">
              <Button
                className="h-[20px] w-[20px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
                href="{{button1Url}}"
              >
                1
              </Button>
            </td>
            <td align="center" className="p-[4px]">
              <Button
                className="h-[20px] w-[20px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
                href="{{button2Url}}"
              >
                2
              </Button>
            </td>
            <td align="center" className="p-[4px]">
              <Button
                className="h-[20px] w-[20px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
                href="{{button3Url}}"
              >
                3
              </Button>
            </td>
            <td align="center" className="p-[4px]">
              <Button
                className="h-[20px] w-[20px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
                href="{{button4Url}}"
              >
                4
              </Button>
            </td>
            <td align="center" className="p-[4px]">
              <Button
                className="h-[20px] w-[20px] {{buttonBorderRadius}} {{buttonBorder}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
                href="{{button5Url}}"
              >
                5
              </Button>
            </td>
          </tr>
        </table>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
];


