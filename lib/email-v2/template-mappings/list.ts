/**
 * List Template Mappings
 * 
 * Defines how to inject ListBlock data into list templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const listMappings: TemplateMapping[] = [
  {
    blockType: 'list',
    variant: 'simple-list',
    description: 'Simple numbered list with table structure',
    mappings: [
      {
        selector: 'h1',
        content: 'heading',
      },
      {
        // Numbered circles: p tags with border-radius:50% and background-color
        // Use special __INDEX__ marker to indicate this should use the array index
        selector: 'p[style*="border-radius:50%"][style*="background-color"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: '__INDEX__', // Special marker for index-based numbering
        },
      },
      {
        selector: 'h2',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="font-size:14px"][style*="line-height:24px"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'description',
        },
      },
    ],
  },
  {
    blockType: 'list',
    variant: 'numbered',
    description: 'Numbered list (maps to simple-list)',
    mappings: [
      {
        selector: 'h1',
        content: 'heading',
      },
      {
        // Numbered circles: p tags with border-radius:50% and background-color
        // Use special __INDEX__ marker to indicate this should use the array index
        selector: 'p[style*="border-radius:50%"][style*="background-color"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: '__INDEX__', // Special marker for index-based numbering
        },
      },
      {
        selector: 'h2',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="font-size:14px"][style*="line-height:24px"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'description',
        },
      },
    ],
  },
  {
    blockType: 'list',
    variant: 'image-left',
    description: 'List with images on the left',
    mappings: [
      {
        selector: 'h1',
        content: 'heading',
      },
      {
        selector: 'img[alt="List item image"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'h2',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'p[style*="font-size:14px"][style*="line-height:24px"]',
        repeat: true,
        arrayPath: 'items',
        itemMappings: {
          content: 'description',
        },
      },
    ],
  },
];

// Register all mappings
listMappings.forEach(registerMapping);

