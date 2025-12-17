import type { ComponentPattern } from './index';

export const STATS_COMPONENTS: ComponentPattern[] = [
  {
    id: 'stats-simple',
    name: 'Stats Simple',
    description: 'Simple stats display with numbers and labels in a responsive row layout',
    category: 'content',
    components: ['Tailwind', 'ResponsiveRow', 'ResponsiveColumn'],
    placeholders: ['stat1Number', 'stat1Label', 'stat2Number', 'stat2Label', 'stat3Number', 'stat3Label', 'numberSize', 'numberColor', 'numberWeight', 'labelSize', 'labelColor'],
    preview: 'Use for displaying simple statistics with numbers and labels in a horizontal row',
    template: `<Tailwind>
  <ResponsiveRow>
    <ResponsiveColumn>
      <p className="m-0 text-left {{numberSize}} leading-[24px] {{numberWeight}} tracking-tight {{numberColor}} tabular-nums">
        {{stat1Number}}
      </p>
      <p className="m-0 text-left {{labelSize}} leading-[18px] {{labelColor}}">
        {{stat1Label}}
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p className="m-0 text-left {{numberSize}} leading-[24px] {{numberWeight}} tracking-tight {{numberColor}} tabular-nums">
        {{stat2Number}}
      </p>
      <p className="m-0 text-left {{labelSize}} leading-[18px] {{labelColor}}">
        {{stat2Label}}
      </p>
    </ResponsiveColumn>
    <ResponsiveColumn>
      <p className="m-0 text-left {{numberSize}} leading-[24px] {{numberWeight}} tracking-tight {{numberColor}} tabular-nums">
        {{stat3Number}}
      </p>
      <p className="m-0 text-left {{labelSize}} leading-[18px] {{labelColor}}">
        {{stat3Label}}
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>  
</Tailwind>`
  },
  {
    id: 'stats-stepped',
    name: 'Stats Stepped',
    description: 'Stats displayed in stacked cards with different background colors, each with number, title, and description',
    category: 'content',
    components: ['Section', 'Row', 'Column', 'Tailwind'],
    placeholders: ['stat1Number', 'stat1Title', 'stat1Description', 'stat1Bg', 'stat1NumberColor', 'stat1TitleColor', 'stat1DescriptionColor', 'stat1MinHeight', 'stat2Number', 'stat2Title', 'stat2Description', 'stat2Bg', 'stat2NumberColor', 'stat2TitleColor', 'stat2DescriptionColor', 'stat2MinHeight', 'stat3Number', 'stat3Title', 'stat3Description', 'stat3Bg', 'stat3NumberColor', 'stat3TitleColor', 'stat3DescriptionColor', 'stat3MinHeight', 'numberSize', 'titleSize', 'descriptionSize', 'borderRadius', 'padding', 'spacing'],
    preview: 'Use for displaying statistics in stacked cards with varying heights and background colors',
    template: `<Tailwind>
  <Section>
    <Row className="mb-2">
      <Column className="min-h-[{{stat1MinHeight}}px] {{borderRadius}} {{stat1Bg}} {{padding}}">
        <p className="mb-0 {{numberSize}} leading-[32px] font-bold tracking-tight tabular-nums {{stat1NumberColor}}">
          {{stat1Number}}
        </p>
        <div className="{{stat1TitleColor}}">
          <p className="mb-0 {{titleSize}} leading-[22px]">{{stat1Title}}</p>
          <p className="mb-0 mt-1 {{descriptionSize}} leading-[18px] {{stat1DescriptionColor}}">
            {{stat1Description}}
          </p>
        </div>
      </Column>
    </Row>
    <Row className="mb-2">
      <Column className="min-h-[{{stat2MinHeight}}px] {{borderRadius}} {{stat2Bg}} {{padding}}">
        <p className="mb-0 {{numberSize}} leading-[32px] font-bold tracking-tight tabular-nums {{stat2NumberColor}}">
          {{stat2Number}}
        </p>
        <div className="{{stat2TitleColor}}">
          <p className="mb-0 {{titleSize}} leading-[22px]">
            {{stat2Title}}
          </p>
          <p className="mb-0 mt-1 {{descriptionSize}} leading-[18px] {{stat2DescriptionColor}}">
            {{stat2Description}}
          </p>
        </div>
      </Column>
    </Row>
    <Row>
      <Column className="min-h-[{{stat3MinHeight}}px] {{borderRadius}} {{stat3Bg}} {{padding}}">
        <p className="mb-0 {{numberSize}} leading-[32px] font-bold tracking-tight tabular-nums {{stat3NumberColor}}">
          {{stat3Number}}
        </p>
        <div className="{{stat3TitleColor}}">
          <p className="mb-0 {{titleSize}} leading-[22px]">
            {{stat3Title}}
          </p>
          <p className="mb-0 mt-1 {{descriptionSize}} leading-[18px] {{stat3DescriptionColor}}">
            {{stat3Description}}
          </p>
        </div>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
];

