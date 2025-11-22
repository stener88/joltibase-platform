/**
 * Header Template Mappings
 * 
 * Defines how to inject HeaderBlock data into header templates
 */

import { registerMapping, type TemplateMapping } from './types';

/**
 * Centered Menu Header Mapping
 * Template: templates/header/centered-menu.html
 * 
 * Structure:
 * - Logo image (centered at top)
 * - Menu items (centered below logo, horizontal)
 */
const centeredMenuMapping: TemplateMapping = {
  blockType: 'header',
  variant: 'centered-menu',
  description: 'Header with centered logo and horizontal menu',
  mappings: [
    // Logo image
    {
      selector: 'img[alt*="logo"]',
      attributes: [
        { attribute: 'src', valuePath: 'logoUrl' },
        { attribute: 'alt', valuePath: 'logoAlt' },
      ],
    },
    // Menu items (repeating) - find all links, filter to menu items by context
    // Menu links are inside td elements with padding-right:8px;padding-left:8px
    {
      selector: 'a[href]',
      repeat: true,
      arrayPath: 'menuItems',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'label',
      },
    },
  ],
};

/**
 * Side Menu Header Mapping
 * Template: templates/header/side-menu.html
 * 
 * Structure:
 * - Logo image (left side)
 * - Menu items (right side, horizontal)
 */
const sideMenuMapping: TemplateMapping = {
  blockType: 'header',
  variant: 'side-menu',
  description: 'Header with logo on left and menu on right',
  mappings: [
    // Logo image
    {
      selector: 'img[alt*="logo"]',
      attributes: [
        { attribute: 'src', valuePath: 'logoUrl' },
        { attribute: 'alt', valuePath: 'logoAlt' },
      ],
    },
    // Menu items (repeating) - find all links (menu items are the links in this template)
    {
      selector: 'a[href]',
      repeat: true,
      arrayPath: 'menuItems',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'label',
      },
    },
  ],
};

/**
 * Social Icons Header Mapping
 * Template: templates/header/social-icons.html
 * 
 * Structure:
 * - Logo image (centered at top)
 * - Social icon links (centered below logo)
 */
const socialIconsMapping: TemplateMapping = {
  blockType: 'header',
  variant: 'social-icons',
  description: 'Header with centered logo and social icons',
  mappings: [
    // Logo image
    {
      selector: 'img[alt*="logo"]',
      attributes: [
        { attribute: 'src', valuePath: 'logoUrl' },
        { attribute: 'alt', valuePath: 'logoAlt' },
      ],
    },
    // Social links (repeating)
    {
      selector: 'a[data-social-link]',
      repeat: true,
      arrayPath: 'socialLinks',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'url' },
          { attribute: 'aria-label', valuePath: 'platform' },
        ],
      },
    },
  ],
};

// Register all header mappings
registerMapping(centeredMenuMapping);
registerMapping(sideMenuMapping);
registerMapping(socialIconsMapping);

// Export array for index.ts
export const headerMappings: TemplateMapping[] = [
  centeredMenuMapping,
  sideMenuMapping,
  socialIconsMapping,
];

// Export individual mappings
export {
  centeredMenuMapping,
  sideMenuMapping,
  socialIconsMapping,
};

