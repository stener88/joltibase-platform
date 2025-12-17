import type { ComponentPattern } from './index';

export const CONTENT_COMPONENTS: ComponentPattern[] = [
  {
    id: 'container-text',
    name: 'Container with Text',
    description: 'Simple container with centered text content, maintains max width while taking available space',
    category: 'content',
    components: ['Container', 'Text', 'Tailwind'],
    placeholders: ['backgroundColor', 'textContent', 'textColor'],
    preview: 'Use for simple text containers that center content and maintain maximum width',
    template: `<Tailwind>
  <Container className="{{backgroundColor}}">
    <Text className="px-[12px] {{textColor}}">
      {{textContent}}
    </Text>
  </Container>  
</Tailwind>`
  },
  {
    id: 'section-text',
    name: 'Simple Section with Text',
    description: 'Basic section wrapper with text content',
    category: 'content',
    components: ['Section', 'Text', 'Tailwind'],
    placeholders: ['textContent'],
    preview: 'Use for simple text sections as a basic content wrapper',
    template: `<Tailwind>
  <Section>
    <Text>{{textContent}}</Text>
  </Section>  
</Tailwind>`
  },
  {
    id: 'heading-simple',
    name: 'Simple Heading',
    description: 'Basic heading component with customizable text and alignment',
    category: 'content',
    components: ['Heading', 'Tailwind'],
    placeholders: ['headingText', 'alignment', 'textSize', 'textColor'],
    preview: 'Use for simple headings with customizable text, alignment, size, and color',
    template: `<Tailwind>
  <Heading className="{{alignment}} {{textSize}} {{textColor}}">{{headingText}}</Heading>  
</Tailwind>`
  },
  {
    id: 'headings-multiple',
    name: 'Multiple Heading Levels',
    description: 'All six heading levels (h1-h6) with customizable text and alignment',
    category: 'content',
    components: ['Heading', 'Tailwind'],
    placeholders: ['h1Text', 'h2Text', 'h3Text', 'h4Text', 'h5Text', 'h6Text', 'alignment'],
    preview: 'Use for displaying all heading levels in a hierarchy, useful for showing heading size variations',
    template: `<Tailwind>
  <>
    <Heading as="h1" className="{{alignment}}">
      {{h1Text}}
    </Heading>
    <Heading as="h2" className="{{alignment}}">
      {{h2Text}}
    </Heading>
    <Heading as="h3" className="{{alignment}}">
      {{h3Text}}
    </Heading>
    <Heading as="h4" className="{{alignment}}">
      {{h4Text}}
    </Heading>
    <Heading as="h5" className="{{alignment}}">
      {{h5Text}}
    </Heading>
    <Heading as="h6" className="{{alignment}}">
      {{h6Text}}
    </Heading>
  </>  
</Tailwind>`
  },
  {
    id: 'text-simple',
    name: 'Simple Text Paragraph',
    description: 'Basic text paragraph component',
    category: 'content',
    components: ['Text', 'Tailwind'],
    placeholders: ['textContent'],
    preview: 'Use for simple paragraph text content',
    template: `<Tailwind>
  <Text>{{textContent}}</Text>  
</Tailwind>`
  },
  {
    id: 'text-styled',
    name: 'Text with Styling',
    description: 'Text component with customizable styling (font weight, size, color, line height) followed by plain text',
    category: 'content',
    components: ['Text', 'Tailwind'],
    placeholders: ['accentText', 'accentFontWeight', 'accentTextSize', 'accentTextColor', 'accentLineHeight', 'bodyText'],
    preview: 'Use for text with styled accent text above and body text below',
    template: `<Tailwind>
  <>
    <Text className="{{accentFontWeight}} {{accentTextSize}} {{accentTextColor}} {{accentLineHeight}}">
      {{accentText}}
    </Text>
    <Text>
      {{bodyText}}
    </Text>
  </>  
</Tailwind>`
  },
  {
    id: 'link-simple',
    name: 'Simple Link',
    description: 'Basic link component with URL and link text',
    category: 'content',
    components: ['Link', 'Tailwind'],
    placeholders: ['linkUrl', 'linkText'],
    preview: 'Use for simple text links',
    template: `<Tailwind>
  <Link href="{{linkUrl}}">{{linkText}}</Link>  
</Tailwind>`
  },
  {
    id: 'link-inline-text',
    name: 'Link Inline with Text',
    description: 'Text paragraph with an inline link embedded within the text',
    category: 'content',
    components: ['Text', 'Link', 'Tailwind'],
    placeholders: ['beforeLink', 'linkUrl', 'linkText', 'afterLink'],
    preview: 'Use for text paragraphs with inline links embedded in the content',
    template: `<Tailwind>
  <Text>
    {{beforeLink}}<Link href="{{linkUrl}}">{{linkText}}</Link>{{afterLink}}
  </Text>  
</Tailwind>`
  },
  {
    id: 'code-inline-simple',
    name: 'Simple Code Inline',
    description: 'Text with inline code snippet using CodeInline component',
    category: 'content',
    components: ['Text', 'CodeInline', 'Tailwind'],
    placeholders: ['beforeCode', 'codeText', 'afterCode', 'alignment', 'codeBgColor', 'codePadding', 'codeBorderRadius'],
    preview: 'Use for displaying inline code snippets within text content',
    template: `<Tailwind>
  <Text className="{{alignment}}">
    {{beforeCode}}{' '}
    <CodeInline className="{{codeBorderRadius}} {{codeBgColor}} {{codePadding}}">
      {{codeText}}
    </CodeInline>{' '}
    {{afterCode}}
  </Text>  
</Tailwind>`
  },
  {
    id: 'code-inline-colored',
    name: 'Code Inline with Custom Colors',
    description: 'Text with inline code snippet using customizable background color',
    category: 'content',
    components: ['Text', 'CodeInline', 'Tailwind'],
    placeholders: ['beforeCode', 'codeText', 'afterCode', 'alignment', 'codeBgColor', 'codePadding', 'codeBorderRadius'],
    preview: 'Use for displaying inline code snippets with custom background colors (green, blue, etc.)',
    template: `<Tailwind>
  <Text className="{{alignment}}">
    {{beforeCode}}{' '}
    <CodeInline className="{{codeBorderRadius}} {{codeBgColor}} {{codePadding}}">
      {{codeText}}
    </CodeInline>{' '}
    {{afterCode}}
  </Text>  
</Tailwind>`
  },
];
