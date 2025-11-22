/**
 * React Email Renderer
 * 
 * Converts EmailComponent tree to HTML using React Email
 */

import { render, pretty, toPlainText } from '@react-email/render';
import { Html, Head, Body } from '@react-email/components';
import React from 'react';
import type { EmailComponent, GlobalEmailSettings } from './types';
import { COMPONENT_MAP, canHaveChildren } from './components/registry';

/**
 * Render options
 */
export interface RenderOptions {
  /** Include pretty formatting (for debugging) */
  pretty?: boolean;
  
  /** Include plaintext version */
  plainText?: boolean;
}

/**
 * Render result
 */
export interface RenderResult {
  /** Rendered HTML */
  html: string;
  
  /** Plain text version (if requested) */
  plainText?: string;
}

/**
 * Main render function: EmailComponent tree → HTML string
 * 
 * Uses @react-email/render as documented: https://react.email/docs/utilities/render
 */
export async function renderEmailComponent(
  root: EmailComponent,
  settings: GlobalEmailSettings,
  options: RenderOptions = {}
): Promise<RenderResult> {
  try {
    console.log('[RENDERER] Starting render for component:', root.component);
    console.log('[RENDERER] Root has', root.children?.length || 0, 'children');
    
    // Build React element tree from EmailComponent tree
    // If root is already Html, render it directly; otherwise wrap it
    const emailElement = root.component === 'Html' 
      ? buildReactElement(root)
      : React.createElement(
          Html,
          { lang: 'en' },
          React.createElement(Head, null),
          React.createElement(
            Body,
            {
              style: {
                fontFamily: settings.fontFamily,
                backgroundColor: settings.backgroundColor || '#ffffff',
                margin: 0,
                padding: 0,
              },
            },
            buildReactElement(root)
          )
        );
    
    // Render to HTML using @react-email/render
    // Docs: https://react.email/docs/utilities/render
    let html = await render(emailElement);
    
    // Ensure viewport meta tag is present for mobile scaling (shrink approach)
    // This forces mobile browsers to render at 600px and scale down, maintaining composition
    html = ensureViewportMeta(html);
    
    // Apply pretty formatting if requested (using pretty function, not deprecated option)
    const formattedHtml = options.pretty ? await pretty(html) : html;
    
    // Get plain text if requested (using toPlainText as recommended, not deprecated plainText option)
    const plainText = options.plainText ? toPlainText(html) : undefined;
    
    return {
      html: formattedHtml,
      plainText,
    };
  } catch (error) {
    console.error('[RENDERER] Error rendering email:', error);
    throw new Error(`Failed to render email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Ensure viewport meta tag and scaling CSS are present in HTML head
 * 
 * Implements shrink/scaling approach for mobile:
 * - Forces mobile browsers to render at 600px width (viewport meta)
 * - Scales down proportionally instead of changing composition
 * - Prevents text size adjustment for consistent scaling
 * - Maintains exact same layout on all devices
 */
function ensureViewportMeta(html: string): string {
  // Check if viewport meta tag already exists
  const hasViewport = html.includes('<meta name="viewport"');
  
  // Check if scaling CSS already exists
  const hasScalingCSS = html.includes('-webkit-text-size-adjust');
  
  // Find the <head> tag
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) {
    return html; // No head tag found, return as-is
  }
  
  let headContent = headMatch[1];
  let modified = false;
  
  // Add viewport meta tag if missing
  if (!hasViewport) {
    headContent = '<meta name="viewport" content="width=600">\n  ' + headContent;
    modified = true;
  }
  
  // Add scaling CSS if missing
  if (!hasScalingCSS) {
    // Find closing </head> or insert before it
    const styleTag = `<style type="text/css">
    /* Fixed width layout - shrink/scaling approach */
    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      min-width: 600px !important;
    }
  </style>`;
    
    // Insert before closing </head>
    headContent = headContent + '\n  ' + styleTag;
    modified = true;
  }
  
  if (modified) {
    html = html.replace(headMatch[0], `<head${headMatch[0].match(/<head([^>]*)>/i)?.[1] || ''}>${headContent}\n</head>`);
  }
  
  return html;
}

/**
 * Build React element from EmailComponent node
 */
function buildReactElement(node: EmailComponent): React.ReactElement {
  console.log('[RENDERER] Building element:', node.component, 'id:', node.id, 'children:', node.children?.length || 0);
  
  // Skip broken logo image
  if (node.id === 'header-logo-img') {
    return React.createElement(React.Fragment, { key: node.id });
  }
  
  const ComponentType = COMPONENT_MAP[node.component];
  
  if (!ComponentType) {
    throw new Error(`Unknown component type: ${node.component}`);
  }
  
  // Build children
  let children: React.ReactNode = null;
  
  // Skip children if dangerouslySetInnerHTML is set (to avoid React error)
  if (!node.props?.dangerouslySetInnerHTML) {
    if (node.content) {
      // Text content
      children = node.content;
    } else if (node.children && node.children.length > 0) {
      // Recursive child components - filter out broken logo
      children = node.children
        .filter((child) => child.id !== 'header-logo-img')
        .map((child) => buildReactElement(child));
    }
  }
  
  // Create React element with data-component-id and data-component-type attributes for visual editing
  // React Email components pass through arbitrary props to the rendered HTML
  return React.createElement(
    ComponentType,
    {
      key: node.id,
      'data-component-id': node.id, // Component ID for lookup
      'data-component-type': node.component, // Component type for type-aware handling
      ...node.props,
    },
    children
  );
}

/**
 * Render a simple email for testing
 */
export async function renderTestEmail(): Promise<string> {
  const testComponent: EmailComponent = {
    id: 'test-root',
    component: 'Container',
    props: {
      style: {
        backgroundColor: '#f0f9ff',
        padding: '40px',
        maxWidth: '600px',
      },
    },
    children: [
      {
        id: 'test-heading',
        component: 'Heading',
        props: {
          as: 'h1',
          style: {
            color: '#111827',
            fontSize: '32px',
            fontWeight: 700,
            margin: '0 0 16px 0',
          },
        },
        content: 'Welcome to React Email V2',
      },
      {
        id: 'test-text',
        component: 'Text',
        props: {
          style: {
            color: '#374151',
            fontSize: '16px',
            lineHeight: '24px',
            margin: '0 0 24px 0',
          },
        },
        content: 'This is a test email rendered using React Email components. AI can now generate and edit emails programmatically!',
      },
      {
        id: 'test-button',
        component: 'Button',
        props: {
          href: 'https://example.com',
          style: {
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          },
        },
        content: 'Get Started',
      },
    ],
  };
  
  const settings: GlobalEmailSettings = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    primaryColor: '#7c3aed',
    maxWidth: '600px',
  };
  
  const result = await renderEmailComponent(testComponent, settings, { pretty: true });
  return result.html;
}

/**
 * Validate EmailComponent tree structure
 */
export function validateComponentTree(node: EmailComponent, path = 'root'): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!node.id) {
    errors.push(`${path}: Missing required field 'id'`);
  }
  
  if (!node.component) {
    errors.push(`${path}: Missing required field 'component'`);
  }
  
  if (!COMPONENT_MAP[node.component]) {
    errors.push(`${path}: Unknown component type '${node.component}'`);
  }
  
  // Check children
  if (node.children) {
    if (!canHaveChildren(node.component)) {
      errors.push(`${path}: Component '${node.component}' cannot have children`);
    }
    
    node.children.forEach((child, index) => {
      const childResult = validateComponentTree(child, `${path}.children[${index}]`);
      errors.push(...childResult.errors);
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

