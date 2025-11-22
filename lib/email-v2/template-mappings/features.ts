/**
 * Features Template Mappings
 * 
 * Defines how to inject FeaturesBlock data into feature templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const featuresMappings: TemplateMapping[] = [
  {
    blockType: 'features',
    variant: 'list-items',
    description: 'Features as list items',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        selector: 'p',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="font-size:16px"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
    ],
  },
  {
    blockType: 'features',
    variant: 'numbered-list',
    description: 'Features as numbered list',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        // Subheading: p tag with margin:0 0 40px AND text-align:center (unique to subheading)
        selector: 'p[style*="margin:0 0 40px"][style*="text-align:center"]',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="margin:0"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
    ],
  },
  {
    blockType: 'features',
    variant: 'four-paragraphs',
    description: 'Features as four paragraphs',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        // Subheading: p tag with margin:0 0 40px AND text-align:center (unique to subheading)
        selector: 'p[style*="margin:0 0 40px"][style*="text-align:center"]',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="text-align:center"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
      {
        selector: 'img[alt="Feature icon"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          attributes: [
            {
              attribute: 'src',
              valuePath: 'imageUrl',
            },
            {
              attribute: 'alt',
              valuePath: 'title',
            },
          ],
        },
      },
    ],
  },
  {
    blockType: 'features',
    variant: 'four-paragraphs-two-columns',
    description: 'Features as four paragraphs in two columns',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        // Subheading: p tag with margin:0 0 40px (unique to subheading)
        selector: 'p[style*="margin:0 0 40px"]',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        // Descriptions: p tags with margin:0 and text-align:center BUT NOT margin:0 0 40px
        // These are the feature description paragraphs (not the subheading)
        selector: 'p[style*="margin:0"][style*="text-align:center"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
      {
        selector: 'img[alt="Feature icon"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          attributes: [
            {
              attribute: 'src',
              valuePath: 'imageUrl',
            },
            {
              attribute: 'alt',
              valuePath: 'title',
            },
          ],
        },
      },
    ],
  },
  {
    blockType: 'features',
    variant: 'grid',
    description: 'Features grid (maps to four-paragraphs-two-columns)',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        // Subheading: p tag with margin:0 0 40px AND text-align:center (unique to subheading)
        selector: 'p[style*="margin:0 0 40px"][style*="text-align:center"]',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="text-align:center"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
      {
        selector: 'img[alt="Feature icon"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          attributes: [
            {
              attribute: 'src',
              valuePath: 'imageUrl',
            },
            {
              attribute: 'alt',
              valuePath: 'title',
            },
          ],
        },
      },
    ],
  },
  {
    blockType: 'features',
    variant: 'three-centered-paragraphs',
    description: 'Features as three centered paragraphs',
    mappings: [
      {
        selector: 'h2',
        content: 'heading',
      },
      {
        // Subheading: p tag with margin:0 0 40px AND text-align:center (unique to subheading)
        selector: 'p[style*="margin:0 0 40px"][style*="text-align:center"]',
        content: 'subheading',
      },
      {
        selector: 'h3',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="margin:0"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          content: 'description',
        },
      },
      {
        selector: 'img[alt="Feature icon"]',
        repeat: true,
        arrayPath: 'features',
        itemMappings: {
          attributes: [
            {
              attribute: 'src',
              valuePath: 'imageUrl',
            },
            {
              attribute: 'alt',
              valuePath: 'title',
            },
          ],
        },
      },
    ],
  },
];


// Register all mappings
featuresMappings.forEach(registerMapping);
