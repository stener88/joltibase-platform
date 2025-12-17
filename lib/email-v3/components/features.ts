import type { ComponentPattern } from './index';

export const FEATURE_COMPONENTS: ComponentPattern[] = [
  {
    id: 'features-header-list-icons',
    name: 'Header and List Items with Icons',
    description: 'Feature section with header and list items, each with an icon, title, and description separated by dividers',
    category: 'feature',
    components: ['Section', 'Row', 'Text', 'Hr', 'Column', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'item1IconUrl', 'item1IconAlt', 'item1Title', 'item1TitleSize', 'item1TitleColor', 'item1Description', 'item1DescriptionColor', 'item2IconUrl', 'item2IconAlt', 'item2Title', 'item2TitleSize', 'item2TitleColor', 'item2Description', 'item2DescriptionColor', 'iconSize', 'dividerColor', 'spacing'],
    preview: 'Use for feature lists with icons, titles, and descriptions separated by horizontal dividers',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[32px]">
          {{headingText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Section>
      <Hr className="!{{dividerColor}} mx-0 my-[32px] w-full border border-solid" />
      <Section>
        <Row>
          <Column className="align-baseline">
            <Img
              alt="{{item1IconAlt}}"
              height={{iconSize}}
              src="{{item1IconUrl}}"
              width={{iconSize}}
            />
          </Column>
          <Column className="w-[85%]">
            <Text className="m-0 font-semibold {{item1TitleSize}} {{item1TitleColor}} leading-[28px]">
              {{item1Title}}
            </Text>
            <Text className="m-0 mt-[8px] text-[16px] {{item1DescriptionColor}} leading-[24px]">
              {{item1Description}}
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr className="!{{dividerColor}} mx-0 my-[32px] w-full border border-solid" />
      <Section>
        <Row>
          <Column className="align-baseline">
            <Img
              alt="{{item2IconAlt}}"
              height={{iconSize}}
              src="{{item2IconUrl}}"
              width={{iconSize}}
            />
          </Column>
          <Column className="w-[85%]">
            <Text className="m-0 font-semibold {{item2TitleSize}} {{item2TitleColor}} leading-[28px]">
              {{item2Title}}
            </Text>
            <Text className="m-0 mt-[8px] text-[16px] {{item2DescriptionColor}} leading-[24px]">
              {{item2Description}}
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr className="!{{dividerColor}} mx-0 my-[32px] w-full border border-solid" />
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'features-header-numbered-list',
    name: 'Header and Numbered List Items',
    description: 'Feature section with header and numbered list items, each with a circular number badge, title, and description',
    category: 'feature',
    components: ['Section', 'Row', 'Text', 'Hr', 'Column', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'item1Number', 'item1Title', 'item1TitleSize', 'item1TitleColor', 'item1Description', 'item1DescriptionColor', 'item2Number', 'item2Title', 'item2TitleSize', 'item2TitleColor', 'item2Description', 'item2DescriptionColor', 'item3Number', 'item3Title', 'item3TitleSize', 'item3TitleColor', 'item3Description', 'item3DescriptionColor', 'item4Number', 'item4Title', 'item4TitleSize', 'item4TitleColor', 'item4Description', 'item4DescriptionColor', 'numberBgColor', 'numberTextColor', 'numberSize', 'dividerColor', 'spacing'],
    preview: 'Use for numbered feature lists with circular badges, perfect for step-by-step guides or feature highlights',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section className="pb-[24px]">
      <Row>
        <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[32px]">
          {{headingText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Hr className="!{{dividerColor}} m-0 w-full border border-solid" />
    <Section className="py-[24px]">
      <Row>
        <Column
          width="48"
          height="40"
          className="w-[{{numberSize}}px] h-[{{numberSize}}px] pr-[8px]"
          valign="baseline"
        >
          <Row width="{{numberSize}}" align="left">
            <Column
              align="center"
              valign="middle"
              width="{{numberSize}}"
              height="{{numberSize}}"
              className="h-[{{numberSize}}px] font-semibold w-[{{numberSize}}px] rounded-full {{numberBgColor}} {{numberTextColor}} p-0"
            >
              {{item1Number}}
            </Column>
          </Row>
        </Column>
        <Column width="100%" className="w-full">
          <Text className="m-0 font-semibold {{item1TitleSize}} {{item1TitleColor}} leading-[28px]">
            {{item1Title}}
          </Text>
          <Text className="m-0 pt-[8px] text-[16px] {{item1DescriptionColor}} leading-[24px]">
            {{item1Description}}
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!{{dividerColor}} m-0 w-full border border-solid" />
    <Section className="py-[24px]">
      <Row>
        <Column
          width="48"
          height="40"
          className="w-[{{numberSize}}px] h-[{{numberSize}}px] pr-[8px]"
          valign="baseline"
        >
          <Row width="{{numberSize}}" align="left">
            <Column
              align="center"
              valign="middle"
              width="{{numberSize}}"
              height="{{numberSize}}"
              className="h-[{{numberSize}}px] font-semibold w-[{{numberSize}}px] rounded-full {{numberBgColor}} {{numberTextColor}} p-0"
            >
              {{item2Number}}
            </Column>
          </Row>
        </Column>
        <Column width="100%" className="w-full">
          <Text className="m-0 font-semibold {{item2TitleSize}} {{item2TitleColor}} leading-[28px]">
            {{item2Title}}
          </Text>
          <Text className="m-0 pt-[8px] text-[16px] {{item2DescriptionColor}} leading-[24px]">
            {{item2Description}}
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!{{dividerColor}} m-0 w-full border border-solid" />
    <Section className="py-[24px]">
      <Row>
        <Column
          width="48"
          height="40"
          className="w-[{{numberSize}}px] h-[{{numberSize}}px] pr-[8px]"
          valign="baseline"
        >
          <Row width="{{numberSize}}" align="left">
            <Column
              align="center"
              valign="middle"
              width="{{numberSize}}"
              height="{{numberSize}}"
              className="h-[{{numberSize}}px] font-semibold w-[{{numberSize}}px] rounded-full {{numberBgColor}} {{numberTextColor}} p-0"
            >
              {{item3Number}}
            </Column>
          </Row>
        </Column>
        <Column width="100%" className="w-full">
          <Text className="m-0 font-semibold {{item3TitleSize}} {{item3TitleColor}} leading-[28px]">
            {{item3Title}}
          </Text>
          <Text className="m-0 pt-[8px] text-[16px] {{item3DescriptionColor}} leading-[24px]">
            {{item3Description}}
          </Text>
        </Column>
      </Row>
    </Section>
    <Hr className="!{{dividerColor}} m-0 w-full border border-solid" />
    <Section className="py-[24px]">
      <Row>
        <Column
          width="48"
          height="40"
          className="w-[{{numberSize}}px] h-[{{numberSize}}px] pr-[8px]"
          valign="baseline"
        >
          <Row width="{{numberSize}}" align="left">
            <Column
              align="center"
              valign="middle"
              width="{{numberSize}}"
              height="{{numberSize}}"
              className="h-[{{numberSize}}px] font-semibold w-[{{numberSize}}px] rounded-full {{numberBgColor}} {{numberTextColor}} p-0"
            >
              {{item4Number}}
            </Column>
          </Row>
        </Column>
        <Column width="100%" className="w-full">
          <Text className="m-0 font-semibold {{item4TitleSize}} {{item4TitleColor}} leading-[28px]">
            {{item4Title}}
          </Text>
          <Text className="m-0 pt-[8px] text-[16px] {{item4DescriptionColor}} leading-[24px]">
            {{item4Description}}
          </Text>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'features-header-four-paragraphs',
    name: 'Header and Four Paragraphs',
    description: 'Feature section with header and four feature items in a 2x2 grid layout, each with icon, title, and description',
    category: 'feature',
    components: ['Section', 'Row', 'Text', 'Column', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'item1IconUrl', 'item1IconAlt', 'item1Title', 'item1TitleSize', 'item1TitleColor', 'item1Description', 'item1DescriptionColor', 'item2IconUrl', 'item2IconAlt', 'item2Title', 'item2TitleSize', 'item2TitleColor', 'item2Description', 'item2DescriptionColor', 'item3IconUrl', 'item3IconAlt', 'item3Title', 'item3TitleSize', 'item3TitleColor', 'item3Description', 'item3DescriptionColor', 'item4IconUrl', 'item4IconAlt', 'item4Title', 'item4TitleSize', 'item4TitleColor', 'item4Description', 'item4DescriptionColor', 'iconSize', 'spacing'],
    preview: 'Use for feature grids with 4 items in a 2x2 layout, each with icon, title, and description',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[32px]">
        {{headingText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
    </Row>
    <Row className="mt-[16px]">
      <Column className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
        <Img
          alt="{{item1IconAlt}}"
          height={{iconSize}}
          src="{{item1IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item1TitleSize}} {{item1TitleColor}} leading-[28px]">
          {{item1Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item1DescriptionColor}} leading-[24px]">
          {{item1Description}}
        </Text>
      </Column>
      <Column className="w-1/2 pl-[12px] align-baseline" colSpan={1}>
        <Img
          alt="{{item2IconAlt}}"
          height={{iconSize}}
          src="{{item2IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item2TitleSize}} {{item2TitleColor}} leading-[28px]">
          {{item2Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item2DescriptionColor}} leading-[24px]">
          {{item2Description}}
        </Text>
      </Column>
    </Row>
    <Row className="mt-[32px]">
      <Column className="w-1/2 pr-[12px] align-baseline" colSpan={1}>
        <Img
          alt="{{item3IconAlt}}"
          height={{iconSize}}
          src="{{item3IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item3TitleSize}} {{item3TitleColor}} leading-[28px]">
          {{item3Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item3DescriptionColor}} leading-[24px]">
          {{item3Description}}
        </Text>
      </Column>
      <Column className="w-1/2 pl-[12px] align-baseline" colSpan={1}>
        <Img
          alt="{{item4IconAlt}}"
          height={{iconSize}}
          src="{{item4IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item4TitleSize}} {{item4TitleColor}} leading-[28px]">
          {{item4Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item4DescriptionColor}} leading-[24px]">
          {{item4Description}}
        </Text>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
  {
    id: 'features-header-four-table',
    name: 'Header, Four Paragraphs and Two Columns (Table)',
    description: 'Feature section with header and four feature items in a 2x2 table layout, each with icon, title, and description',
    category: 'feature',
    components: ['Section', 'Row', 'Text', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'item1IconUrl', 'item1IconAlt', 'item1Title', 'item1TitleSize', 'item1TitleColor', 'item1Description', 'item1DescriptionColor', 'item2IconUrl', 'item2IconAlt', 'item2Title', 'item2TitleSize', 'item2TitleColor', 'item2Description', 'item2DescriptionColor', 'item3IconUrl', 'item3IconAlt', 'item3Title', 'item3TitleSize', 'item3TitleColor', 'item3Description', 'item3DescriptionColor', 'item4IconUrl', 'item4IconAlt', 'item4Title', 'item4TitleSize', 'item4TitleColor', 'item4Description', 'item4DescriptionColor', 'iconSize', 'spacing'],
    preview: 'Use for feature grids with 4 items in a 2x2 table layout, each with icon, title, and description',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[32px]">
        {{headingText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
    </Row>
    <table width="100%">
      <tr className="mt-[16px] w-full">
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="{{item1IconAlt}}"
            height={{iconSize}}
            src="{{item1IconUrl}}"
            width={{iconSize}}
          />
          <Text className="m-0 mt-[16px] font-semibold {{item1TitleSize}} {{item1TitleColor}} leading-[28px]">
            {{item1Title}}
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] {{item1DescriptionColor}} leading-[24px]">
            {{item1Description}}
          </Text>
        </td>
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="{{item2IconAlt}}"
            height={{iconSize}}
            src="{{item2IconUrl}}"
            width={{iconSize}}
          />
          <Text className="m-0 mt-[16px] font-semibold {{item2TitleSize}} {{item2TitleColor}} leading-[28px]">
            {{item2Title}}
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] {{item2DescriptionColor}} leading-[24px]">
            {{item2Description}}
          </Text>
        </td>
      </tr>
      <tr className="mt-[16px] w-full">
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="{{item3IconAlt}}"
            height={{iconSize}}
            src="{{item3IconUrl}}"
            width={{iconSize}}
          />
          <Text className="m-0 mt-[16px] font-semibold {{item3TitleSize}} {{item3TitleColor}} leading-[28px]">
            {{item3Title}}
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] {{item3DescriptionColor}} leading-[24px]">
            {{item3Description}}
          </Text>
        </td>
        <td align="center" className="w-1/2 pr-[12px] align-baseline">
          <Img
            alt="{{item4IconAlt}}"
            height={{iconSize}}
            src="{{item4IconUrl}}"
            width={{iconSize}}
          />
          <Text className="m-0 mt-[16px] font-semibold {{item4TitleSize}} {{item4TitleColor}} leading-[28px]">
            {{item4Title}}
          </Text>
          <Text className="mt-[8px] mb-0 text-[16px] {{item4DescriptionColor}} leading-[24px]">
            {{item4Description}}
          </Text>
        </td>
      </tr>
    </table>
  </Section>  
</Tailwind>`
  },
  {
    id: 'features-header-three-centered',
    name: 'Header and Three Centered Paragraphs',
    description: 'Feature section with header and three feature items in a horizontal row, centered alignment, each with icon, title, and description',
    category: 'feature',
    components: ['Section', 'Row', 'Text', 'Column', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'item1IconUrl', 'item1IconAlt', 'item1Title', 'item1TitleSize', 'item1TitleColor', 'item1Description', 'item1DescriptionColor', 'item2IconUrl', 'item2IconAlt', 'item2Title', 'item2TitleSize', 'item2TitleColor', 'item2Description', 'item2DescriptionColor', 'item3IconUrl', 'item3IconAlt', 'item3Title', 'item3TitleSize', 'item3TitleColor', 'item3Description', 'item3DescriptionColor', 'iconSize', 'spacing'],
    preview: 'Use for feature sections with 3 items in a horizontal row, centered alignment',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[32px]">
        {{headingText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
    </Row>
    <Row className="mt-[16px]">
      <Column align="center" className="w-1/3 pr-[12px] align-baseline">
        <Img
          alt="{{item1IconAlt}}"
          height={{iconSize}}
          src="{{item1IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item1TitleSize}} {{item1TitleColor}} leading-[24px]">
          {{item1Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item1DescriptionColor}} leading-[24px]">
          {{item1Description}}
        </Text>
      </Column>
      <Column align="center" className="w-1/3 pl-[12px] align-baseline">
        <Img
          alt="{{item2IconAlt}}"
          height={{iconSize}}
          src="{{item2IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item2TitleSize}} {{item2TitleColor}} leading-[28px]">
          {{item2Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item2DescriptionColor}} leading-[24px]">
          {{item2Description}}
        </Text>
      </Column>
      <Column align="center" className="w-1/3 pl-[12px] align-baseline">
        <Img
          alt="{{item3IconAlt}}"
          height={{iconSize}}
          src="{{item3IconUrl}}"
          width={{iconSize}}
        />
        <Text className="m-0 mt-[16px] font-semibold {{item3TitleSize}} {{item3TitleColor}} leading-[28px]">
          {{item3Title}}
        </Text>
        <Text className="mt-[8px] mb-0 text-[16px] {{item3DescriptionColor}} leading-[24px]">
          {{item3Description}}
        </Text>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
];


