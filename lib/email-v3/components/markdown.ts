import type { ComponentPattern } from './index';

export const MARKDOWN_COMPONENTS: ComponentPattern[] = [
  {
    id: 'markdown-simple',
    name: 'Simple Markdown',
    description: 'Markdown component for rendering markdown-formatted content',
    category: 'content',
    components: ['Markdown', 'Tailwind'],
    placeholders: ['markdownContent'],
    preview: 'Use for rendering markdown-formatted text content with headings, paragraphs, etc.',
    template: `<Tailwind>
  <Markdown>
    {\`{{markdownContent}}\`}
  </Markdown>  
</Tailwind>`
  },
  {
    id: 'markdown-container-styles',
    name: 'Markdown with Container Styles',
    description: 'Markdown component with customizable container styles (margins, padding, etc.)',
    category: 'content',
    components: ['Markdown', 'Tailwind'],
    placeholders: ['markdownContent', 'containerStyles'],
    preview: 'Use for markdown content with custom container styling like margins and padding',
    template: `<Tailwind>
  <Markdown
    markdownContainerStyles={{{containerStyles}}}
  >
    {\`{{markdownContent}}\`}
  </Markdown>  
</Tailwind>`
  },
  {
    id: 'markdown-custom-styles',
    name: 'Markdown with Custom Styles',
    description: 'Markdown component with custom styles for specific elements (h1, h2, codeInline, etc.)',
    category: 'content',
    components: ['Markdown', 'Tailwind'],
    placeholders: ['markdownContent', 'customStyles'],
    preview: 'Use for markdown content with custom styling for headings, code, and other elements',
    template: `<Tailwind>
  <Markdown
    markdownCustomStyles={{{customStyles}}}
  >
    {\`{{markdownContent}}\`}
  </Markdown>  
</Tailwind>`
  },
];


