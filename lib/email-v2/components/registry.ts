/**
 * Component Registry
 * 
 * Maps component type strings to React Email components
 * and provides prop documentation for AI
 */

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Button,
  Img,
  Hr,
  Link,
  CodeBlock,
  CodeInline,
  Font,
  Markdown,
  Preview,
  Tailwind,
} from '@react-email/components';
import type { ComponentType, ComponentPropDocs } from '../types';

/**
 * Map component type to React component
 */
export const COMPONENT_MAP: Record<ComponentType, any> = {
  // Layout
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  // Content
  Text,
  Heading,
  Button,
  Link,
  Img,
  Hr,
  // Advanced
  CodeBlock,
  CodeInline,
  Font,
  Markdown,
  Preview,
  Tailwind,
};

/**
 * Components that can be edited (have content or meaningful props)
 */
export const EDITABLE_COMPONENTS: ComponentType[] = [
  'Text',
  'Heading',
  'Button',
  'Link',
  'Img',
  'CodeBlock',
  'CodeInline',
  'Markdown',
  'Preview',
  'Container',
  'Section',
  'Body',
];

/**
 * Components that can have children
 */
export const CONTAINER_COMPONENTS: ComponentType[] = [
  'Html',
  'Head',
  'Body',
  'Container',
  'Section',
  'Row',
  'Column',
  'Button',
  'Link',
  'Font',
  'Tailwind',
  'Markdown',
];

/**
 * Component prop documentation for AI prompts
 */
export const COMPONENT_PROP_DOCS: Record<ComponentType, ComponentPropDocs> = {
  Html: {
    component: 'Html',
    required: [],
    optional: {
      lang: 'Language code (e.g., "en")',
      dir: 'Text direction: ltr or rtl',
    },
    styleProps: [],
    examples: [
      '<Html lang="en"><Head /><Body>...</Body></Html>',
    ],
  },
  
  Head: {
    component: 'Head',
    required: [],
    optional: {},
    styleProps: [],
    examples: [
      '<Head />',
    ],
  },
  
  Body: {
    component: 'Body',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['backgroundColor', 'fontFamily', 'margin', 'padding'],
    examples: [
      '<Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>...</Body>',
    ],
  },
  
  Container: {
    component: 'Container',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['backgroundColor', 'padding', 'maxWidth', 'margin', 'borderRadius'],
    examples: [
      '<Container style={{ backgroundColor: "#f0f9ff", padding: "40px" }}>...</Container>',
    ],
  },
  
  Section: {
    component: 'Section',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['backgroundColor', 'padding', 'margin', 'borderRadius'],
    examples: [
      '<Section style={{ padding: "20px 0" }}>...</Section>',
    ],
  },
  
  Row: {
    component: 'Row',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['padding', 'margin'],
    examples: [
      '<Row><Column>...</Column><Column>...</Column></Row>',
    ],
  },
  
  Column: {
    component: 'Column',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['padding', 'margin', 'verticalAlign', 'width'],
    examples: [
      '<Column style={{ padding: "0 10px" }}>...</Column>',
    ],
  },
  
  Text: {
    component: 'Text',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: [
      'color',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'fontFamily',
      'textAlign',
      'margin',
      'padding',
    ],
    examples: [
      '<Text style={{ color: "#374151", fontSize: "16px" }}>Your content here</Text>',
    ],
  },
  
  Heading: {
    component: 'Heading',
    required: [],
    optional: {
      as: 'h1, h2, h3, h4, h5, or h6',
      style: 'CSS properties object',
    },
    styleProps: [
      'color',
      'fontSize',
      'fontWeight',
      'lineHeight',
      'fontFamily',
      'textAlign',
      'margin',
      'padding',
    ],
    examples: [
      '<Heading as="h1" style={{ color: "#111827", fontSize: "32px" }}>Title</Heading>',
    ],
  },
  
  Button: {
    component: 'Button',
    required: ['href'],
    optional: {
      style: 'CSS properties object',
      target: 'Link target (_blank, _self, etc.)',
    },
    styleProps: [
      'backgroundColor',
      'color',
      'padding',
      'borderRadius',
      'fontSize',
      'fontWeight',
      'textAlign',
      'textDecoration',
      'border',
    ],
    examples: [
      '<Button href="https://example.com" style={{ backgroundColor: "#7c3aed", color: "#ffffff", padding: "12px 24px", borderRadius: "6px" }}>Click Here</Button>',
    ],
  },
  
  Link: {
    component: 'Link',
    required: ['href'],
    optional: {
      style: 'CSS properties object',
      target: 'Link target (_blank, _self, etc.)',
    },
    styleProps: ['color', 'textDecoration', 'fontSize', 'fontWeight'],
    examples: [
      '<Link href="https://example.com" style={{ color: "#7c3aed" }}>Visit our website</Link>',
    ],
  },
  
  Img: {
    component: 'Img',
    required: ['src', 'alt'],
    optional: {
      width: 'Image width (number)',
      height: 'Image height (number)',
      style: 'CSS properties object',
    },
    styleProps: ['borderRadius', 'display', 'margin', 'maxWidth'],
    examples: [
      '<Img src="https://example.com/image.jpg" alt="Description" width={600} style={{ borderRadius: "8px" }} />',
    ],
  },
  
  Hr: {
    component: 'Hr',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['borderColor', 'borderWidth', 'margin', 'borderStyle'],
    examples: [
      '<Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />',
    ],
  },
  
  CodeBlock: {
    component: 'CodeBlock',
    required: ['code'],
    optional: {
      language: 'Programming language (js, ts, python, etc.)',
      theme: 'Syntax highlighting theme',
      style: 'CSS properties object',
    },
    styleProps: ['backgroundColor', 'padding', 'borderRadius', 'fontSize'],
    examples: [
      '<CodeBlock code="const hello = \'world\';" language="javascript" />',
    ],
  },
  
  CodeInline: {
    component: 'CodeInline',
    required: [],
    optional: {
      style: 'CSS properties object',
    },
    styleProps: ['backgroundColor', 'color', 'padding', 'borderRadius', 'fontSize', 'fontFamily'],
    examples: [
      '<CodeInline style={{ backgroundColor: "#f3f4f6", padding: "2px 6px" }}>npm install</CodeInline>',
    ],
  },
  
  Font: {
    component: 'Font',
    required: ['fontFamily'],
    optional: {
      fallbackFontFamily: 'Fallback font',
      webFont: 'Web font configuration',
      fontWeight: 'Font weight',
      fontStyle: 'Font style (normal, italic)',
    },
    styleProps: [],
    examples: [
      '<Font fontFamily="Inter" fallbackFontFamily="Arial">...</Font>',
    ],
  },
  
  Markdown: {
    component: 'Markdown',
    required: [],
    optional: {
      markdownCustomStyles: 'Custom styles for markdown elements',
      markdownContainerStyles: 'Container styles',
    },
    styleProps: [],
    examples: [
      '<Markdown>{`# Hello\\n\\nThis is **bold** text`}</Markdown>',
    ],
  },
  
  Preview: {
    component: 'Preview',
    required: [],
    optional: {},
    styleProps: [],
    examples: [
      '<Preview>This text appears in the email preview</Preview>',
    ],
  },
  
  Tailwind: {
    component: 'Tailwind',
    required: [],
    optional: {
      config: 'Tailwind configuration object',
    },
    styleProps: [],
    examples: [
      '<Tailwind><div className="bg-blue-500 text-white p-4">...</div></Tailwind>',
    ],
  },
};

/**
 * Get prop documentation for a component type
 */
export function getComponentPropDocs(component: ComponentType): ComponentPropDocs {
  return COMPONENT_PROP_DOCS[component];
}

/**
 * Get all editable style props for a component
 */
export function getEditableStyleProps(component: ComponentType): string[] {
  return COMPONENT_PROP_DOCS[component]?.styleProps || [];
}

/**
 * Check if component can have children
 */
export function canHaveChildren(component: ComponentType): boolean {
  return CONTAINER_COMPONENTS.includes(component);
}

/**
 * Check if component is editable
 */
export function isEditable(component: ComponentType): boolean {
  return EDITABLE_COMPONENTS.includes(component);
}

