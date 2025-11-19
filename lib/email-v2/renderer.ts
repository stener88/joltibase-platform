/**
 * React Email Renderer
 * 
 * Converts EmailComponent tree to HTML using React Email
 */

import { render } from '@react-email/render';
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
 */
export async function renderEmailComponent(
  root: EmailComponent,
  settings: GlobalEmailSettings,
  options: RenderOptions = {}
): Promise<RenderResult> {
  try {
    console.log('[RENDERER] Starting render for component:', root.component);
    console.log('[RENDERER] Root has', root.children?.length || 0, 'children');
    
    // Build React element tree from component tree
    const bodyContent = buildReactElement(root);
    
    // Wrap in email structure
    const emailElement = React.createElement(
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
        bodyContent
      )
    );
    
    // Render to HTML
    const html = await render(emailElement, {
      pretty: options.pretty,
      plainText: options.plainText ? undefined : false,
    });
    
    // Get plain text if requested
    let plainText: string | undefined;
    if (options.plainText) {
      plainText = await render(emailElement, {
        plainText: true,
      });
    }
    
    return {
      html,
      plainText,
    };
  } catch (error) {
    console.error('[RENDERER] Error rendering email:', error);
    throw new Error(`Failed to render email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Build React element from EmailComponent node
 */
function buildReactElement(node: EmailComponent): React.ReactElement {
  console.log('[RENDERER] Building element:', node.component, 'id:', node.id, 'children:', node.children?.length || 0);
  
  const ComponentType = COMPONENT_MAP[node.component];
  
  if (!ComponentType) {
    throw new Error(`Unknown component type: ${node.component}`);
  }
  
  // Build children
  let children: React.ReactNode = null;
  
  if (node.content) {
    // Text content
    children = node.content;
  } else if (node.children && node.children.length > 0) {
    // Recursive child components
    children = node.children.map((child) => buildReactElement(child));
  }
  
  // Create React element
  return React.createElement(
    ComponentType,
    {
      key: node.id,
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

