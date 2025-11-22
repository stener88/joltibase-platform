/**
 * Footer Template Mappings
 * 
 * Defines how to inject FooterBlock data into footer templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const footerMappings: TemplateMapping[] = [
  {
    blockType: 'footer',
    variant: 'simple',
    description: 'Simple footer with company name and unsubscribe link',
    mappings: [
      {
        selector: 'p',
        content: 'companyName',
        // First <p> tag is company name/address
      },
      {
        selector: 'a',
        attributes: [
          { attribute: 'href', valuePath: 'unsubscribeUrl' },
        ],
        content: 'Unsubscribe', // Literal text "Unsubscribe"
      },
    ],
  },
];

// Register all footer mappings
footerMappings.forEach(registerMapping);

