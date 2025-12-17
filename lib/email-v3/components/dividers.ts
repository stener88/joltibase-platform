import type { ComponentPattern } from './index';

export const DIVIDER_COMPONENTS: ComponentPattern[] = [
  {
    id: 'divider-simple',
    name: 'Simple Horizontal Divider',
    description: 'Horizontal rule divider with text before and after, customizable spacing and border styling',
    category: 'divider',
    components: ['Text', 'Hr', 'Tailwind'],
    placeholders: ['beforeText', 'afterText', 'spacing', 'borderColor', 'borderWidth'],
    preview: 'Use for visual separation between content sections with customizable spacing and styling',
    template: `<Tailwind>
  <>
    <Text>{{beforeText}}</Text>
    <Hr className="{{spacing}} {{borderColor}} {{borderWidth}}" />
    <Text>{{afterText}}</Text>
  </>  
</Tailwind>`
  },
  {
    id: 'divider-between-rows',
    name: 'Divider Between Rows',
    description: 'Horizontal divider separating two rows of columns, useful for section breaks in grid layouts',
    category: 'divider',
    components: ['Row', 'Column', 'Hr', 'Tailwind'],
    placeholders: ['row1Col1', 'row1Col2', 'row2Col1', 'row2Col2', 'spacing', 'borderColor'],
    preview: 'Use for separating rows in grid layouts with a horizontal divider',
    template: `<Tailwind>
  <>
    <Row>
      <Column>{{row1Col1}}</Column>
      <Column>{{row1Col2}}</Column>
    </Row>
    <Hr className="{{spacing}} {{borderColor}}" />
    <Row>
      <Column>{{row2Col1}}</Column>
      <Column>{{row2Col2}}</Column>
    </Row>
  </>  
</Tailwind>`
  },
];


