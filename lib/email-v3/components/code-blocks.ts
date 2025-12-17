import type { ComponentPattern } from './index';

export const CODE_BLOCK_COMPONENTS: ComponentPattern[] = [
  {
    id: 'code-block-simple',
    name: 'Code Block without Theme',
    description: 'Code block component with custom font, no syntax highlighting theme',
    category: 'content',
    components: ['Font', 'CodeBlock', 'Tailwind'],
    placeholders: ['fontUrl', 'fontFamily', 'fallbackFontFamily', 'codeContent', 'language'],
    preview: 'Use for displaying code blocks without syntax highlighting theme',
    template: `<Tailwind>
  <>
    <Font
      fallbackFontFamily="{{fallbackFontFamily}}"
      fontFamily="{{fontFamily}}"
      fontStyle="normal"
      fontWeight={400}
      webFont={{
        url: '{{fontUrl}}',
        format: 'truetype',
      }}
    />
    <CodeBlock
      code={\`{{codeContent}}\`}
      fontFamily="'{{fontFamily}}', {{fallbackFontFamily}}"
      language="{{language}}"
      theme={{}}
    />
  </>  
</Tailwind>`
  },
  {
    id: 'code-block-themed',
    name: 'Code Block with Predefined Theme',
    description: 'Code block component with syntax highlighting using a predefined theme (e.g., dracula)',
    category: 'content',
    components: ['Font', 'CodeBlock', 'Tailwind'],
    placeholders: ['fontUrl', 'fontFamily', 'fallbackFontFamily', 'codeContent', 'language', 'themeName'],
    preview: 'Use for displaying code blocks with syntax highlighting using predefined themes like dracula, github, etc.',
    template: `<Tailwind>
  <>
    <Font
      fallbackFontFamily="{{fallbackFontFamily}}"
      fontFamily="{{fontFamily}}"
      fontStyle="normal"
      fontWeight={400}
      webFont={{
        url: '{{fontUrl}}',
        format: 'truetype',
      }}
    />
    <CodeBlock
      code={\`{{codeContent}}\`}
      fontFamily="'{{fontFamily}}', {{fallbackFontFamily}}"
      language="{{language}}"
      theme={{{themeName}}}
    />
  </>  
</Tailwind>`
  },
  {
    id: 'code-block-custom-theme',
    name: 'Code Block with Custom Theme',
    description: 'Code block component with fully customizable syntax highlighting theme',
    category: 'content',
    components: ['Font', 'CodeBlock', 'Tailwind'],
    placeholders: ['fontUrl', 'fontFamily', 'fallbackFontFamily', 'codeContent', 'language', 'customTheme'],
    preview: 'Use for displaying code blocks with fully customized syntax highlighting colors and styles',
    template: `<Tailwind>
  <>
    <Font
      fallbackFontFamily="{{fallbackFontFamily}}"
      fontFamily="{{fontFamily}}"
      fontStyle="normal"
      fontWeight={400}
      webFont={{
        url: '{{fontUrl}}',
        format: 'truetype',
      }}
    />
    <CodeBlock
      code={\`{{codeContent}}\`}
      fontFamily="'{{fontFamily}}', {{fallbackFontFamily}}"
      language="{{language}}"
      theme={{{customTheme}}}
    />
  </>  
</Tailwind>`
  },
  {
    id: 'code-block-line-numbers',
    name: 'Code Block with Line Numbers',
    description: 'Code block component with line numbers and syntax highlighting theme',
    category: 'content',
    components: ['Font', 'CodeBlock', 'Tailwind'],
    placeholders: ['fontUrl', 'fontFamily', 'fallbackFontFamily', 'codeContent', 'language', 'themeName'],
    preview: 'Use for displaying code blocks with line numbers and syntax highlighting',
    template: `<Tailwind>
  <>
    <Font
      fallbackFontFamily="{{fallbackFontFamily}}"
      fontFamily="{{fontFamily}}"
      fontStyle="normal"
      fontWeight={400}
      webFont={{
        url: '{{fontUrl}}',
        format: 'truetype',
      }}
    />
    <CodeBlock
      code={\`{{codeContent}}\`}
      fontFamily="'{{fontFamily}}', {{fallbackFontFamily}}"
      language="{{language}}"
      lineNumbers
      theme={{{themeName}}}
    />
  </>  
</Tailwind>`
  },
];


