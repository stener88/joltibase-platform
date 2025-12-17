import type { ComponentPattern } from './index';

export const LAYOUT_COMPONENTS: ComponentPattern[] = [
  {
    id: 'section-grid-2x2',
    name: 'Section with 2x2 Grid Layout',
    description: 'Section with two rows, each containing two columns for grid-based content layouts',
    category: 'content',
    components: ['Section', 'Row', 'Column', 'Tailwind'],
    placeholders: ['row1Col1', 'row1Col2', 'row2Col1', 'row2Col2'],
    preview: 'Use for grid layouts with two rows and two columns, perfect for feature grids or content blocks',
    template: `<Tailwind>
  <Section>
    <Row>
      <Column>{{row1Col1}}</Column>
      <Column>{{row1Col2}}</Column>
    </Row>
    <Row>
      <Column>{{row2Col1}}</Column>
      <Column>{{row2Col2}}</Column>
    </Row>
  </Section>  
</Tailwind>`
  },
  {
    id: 'grid-row-columns',
    name: 'Grid Row with Flexible Columns',
    description: 'Flexible grid rows showing equal (1/2-1/2) and unequal (1/3-2/3) column layouts',
    category: 'content',
    components: ['Row', 'Column', 'Tailwind'],
    placeholders: ['row1Col1Content', 'row1Col1Width', 'row1Col1Bg', 'row1Col2Content', 'row1Col2Width', 'row1Col2Bg', 'row2Col1Content', 'row2Col1Width', 'row2Col1Bg', 'row2Col2Content', 'row2Col2Width', 'row2Col2Bg', 'cellSpacing'],
    preview: 'Use for flexible grid layouts with customizable column widths (equal or unequal splits)',
    template: `<Tailwind>
  <>
    <Row cellSpacing="{{cellSpacing}}">
      <Column align="center" className="h-[40px] {{row1Col1Width}} {{row1Col1Bg}}">
        {{row1Col1Content}}
      </Column>
      <Column align="center" className="h-[40px] {{row1Col2Width}} {{row1Col2Bg}}">
        {{row1Col2Content}}
      </Column>
    </Row>
    <Row>
      <Column align="center" className="h-[40px] {{row2Col1Width}} {{row2Col1Bg}}">
        {{row2Col1Content}}
      </Column>
      <Column align="center" className="h-[40px] {{row2Col2Width}} {{row2Col2Bg}}">
        {{row2Col2Content}}
      </Column>
    </Row>
  </>  
</Tailwind>`
  },
  {
    id: 'grid-row-three-columns',
    name: 'Grid Row with Three Equal Columns',
    description: 'Single row with three equal columns (1/3 each), perfect for feature lists or three-column layouts',
    category: 'content',
    components: ['Row', 'Column', 'Tailwind'],
    placeholders: ['col1Content', 'col1Bg', 'col2Content', 'col2Bg', 'col3Content', 'col3Bg'],
    preview: 'Use for three-column layouts with equal width columns, ideal for feature grids or content blocks',
    template: `<Tailwind>
  <Row>
    <Column align="center" className="h-[40px] w-1/3 {{col1Bg}}">
      {{col1Content}}
    </Column>
    <Column align="center" className="h-[40px] w-1/3 {{col2Bg}}">
      {{col2Content}}
    </Column>
    <Column align="center" className="h-[40px] w-1/3 {{col3Bg}}">
      {{col3Content}}
    </Column>
  </Row>  
</Tailwind>`
  },
];


