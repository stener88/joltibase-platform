/**
 * Email Template Wrapper
 * 
 * Creates the standard email structure (Html > Head > Body > Container)
 * that wraps all user-generated content
 */

import type { EmailComponent, GlobalEmailSettings } from './types';

/**
 * Create the standard email wrapper structure
 * 
 * This provides the complete HTML document structure that all emails need.
 * AI-generated content gets inserted into the Container inside Body.
 */
export function createEmailWrapper(settings: GlobalEmailSettings): EmailComponent {
  return {
    id: 'html-root',
    component: 'Html',
    props: { lang: 'en' },
    children: [
      {
        id: 'head',
        component: 'Head',
        props: {},
        children: [], // Preview component can be added here
      },
      {
        id: 'body',
        component: 'Body',
        props: {
          style: {
            fontFamily: settings.fontFamily,
            backgroundColor: settings.backgroundColor || '#ffffff',
            margin: 0,
            padding: 0,
          },
        },
        children: [
          {
            id: 'main-container',
            component: 'Container',
            props: {
              style: {
                maxWidth: settings.maxWidth,
                margin: '0 auto',
              },
            },
            children: [], // User content goes here
          },
        ],
      },
    ],
  };
}

/**
 * Insert AI-generated content into the email wrapper
 * 
 * @param wrapper - The email wrapper structure
 * @param content - Array of content components (Sections, etc.)
 * @returns Complete email with content inserted
 */
export function insertContentIntoWrapper(
  wrapper: EmailComponent,
  content: EmailComponent[]
): EmailComponent {
  // Clone the wrapper to avoid mutation
  const clonedWrapper = JSON.parse(JSON.stringify(wrapper)) as EmailComponent;
  
  // Navigate to Body > Container > children
  const body = clonedWrapper.children![1];
  const container = body.children![0];
  
  // Insert content
  container.children = content;
  
  return clonedWrapper;
}

/**
 * Add Preview component to the Head section
 * 
 * @param email - Complete email structure
 * @param previewText - Preview text to display in inbox
 * @returns Email with preview added
 */
export function addPreviewToEmail(
  email: EmailComponent,
  previewText: string
): EmailComponent {
  const clonedEmail = JSON.parse(JSON.stringify(email)) as EmailComponent;
  
  const previewComponent: EmailComponent = {
    id: 'preview-text',
    component: 'Preview',
    props: {},
    content: previewText,
  };
  
  // Add to Head
  const head = clonedEmail.children![0];
  head.children = head.children || [];
  head.children.push(previewComponent);
  
  return clonedEmail;
}

/**
 * Extract Preview component from content array
 * 
 * @param content - Array of content components
 * @returns Preview component if found, undefined otherwise
 */
export function extractPreviewComponent(
  content: EmailComponent[]
): EmailComponent | undefined {
  return content.find(comp => comp.component === 'Preview');
}

/**
 * Get the main container from email structure
 * 
 * @param email - Complete email structure
 * @returns The main Container component
 */
export function getMainContainer(email: EmailComponent): EmailComponent {
  return email.children![1].children![0];
}

/**
 * Validate email wrapper structure
 * 
 * @param email - Email to validate
 * @returns True if valid wrapper structure
 */
export function isValidEmailWrapper(email: EmailComponent): boolean {
  if (email.component !== 'Html') return false;
  if (!email.children || email.children.length !== 2) return false;
  
  const head = email.children[0];
  const body = email.children[1];
  
  if (head.component !== 'Head') return false;
  if (body.component !== 'Body') return false;
  if (!body.children || body.children.length === 0) return false;
  
  const container = body.children[0];
  if (container.component !== 'Container') return false;
  
  return true;
}

