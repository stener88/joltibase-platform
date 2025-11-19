/**
 * Email V2 Types
 * 
 * Core type definitions for the React Email-based system
 */

import type { CSSProperties } from 'react';

/**
 * Available React Email component types
 */
export type ComponentType =
  // Layout components
  | 'Html'
  | 'Head'
  | 'Body'
  | 'Container'
  | 'Section'
  | 'Row'
  | 'Column'
  // Content components
  | 'Text'
  | 'Heading'
  | 'Button'
  | 'Link'
  | 'Img'
  | 'Hr'
  // Advanced components
  | 'CodeBlock'
  | 'CodeInline'
  | 'Font'
  | 'Markdown'
  | 'Preview'
  | 'Tailwind';

/**
 * Core EmailComponent structure (stored in database)
 */
export interface EmailComponent {
  /** Unique identifier for this component instance */
  id: string;
  
  /** React Email component type */
  component: ComponentType;
  
  /** Component-specific props (e.g., style, href, src, etc.) */
  props: Record<string, any>;
  
  /** Child components (for container types) */
  children?: EmailComponent[];
  
  /** Text content (for Text/Heading/Button components) */
  content?: string;
}

/**
 * Global email settings (brand/design tokens)
 */
export interface GlobalEmailSettings {
  /** Primary brand color (hex) */
  primaryColor: string;
  
  /** Secondary brand color (hex) */
  secondaryColor?: string;
  
  /** Default font family */
  fontFamily: string;
  
  /** Maximum email width (px) */
  maxWidth: string;
  
  /** Background color for email body */
  backgroundColor?: string;
}

/**
 * Campaign structure for V2 system
 */
export interface CampaignV2 {
  id: string;
  version: 'v2';
  rootComponent: EmailComponent;
  globalSettings: GlobalEmailSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Selectable element for visual editor
 */
export interface SelectableElement {
  /** Component ID */
  id: string;
  
  /** Path in component tree (e.g., "root.children[0].children[1]") */
  path: string;
  
  /** Component type */
  component: ComponentType;
  
  /** Current props */
  props: Record<string, any>;
  
  /** Current content (if applicable) */
  content?: string;
  
  /** Whether this element can be edited */
  editable: boolean;
  
  /** Parent component path */
  parentPath?: string;
}

/**
 * Component prop documentation for AI
 */
export interface ComponentPropDocs {
  /** Component type */
  component: ComponentType;
  
  /** Required props */
  required: string[];
  
  /** Optional props with descriptions */
  optional: Record<string, string>;
  
  /** Style properties available */
  styleProps: string[];
  
  /** Usage examples */
  examples: string[];
}

/**
 * AI generation/editing response
 */
export interface AIComponentResponse {
  /** Props to change */
  props?: Record<string, any>;
  
  /** Content to change */
  content?: string;
  
  /** Explanation of changes */
  explanation: string;
}

