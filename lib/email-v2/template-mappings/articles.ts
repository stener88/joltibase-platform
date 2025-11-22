/**
 * Articles Template Mappings
 * 
 * Defines how to inject ArticlesBlock data into articles templates
 * Note: This is separate from the 'article' block type
 */

import { registerMapping, type TemplateMapping } from './types';

export const articlesMappings: TemplateMapping[] = [
  {
    blockType: 'articles',
    variant: 'with-image',
    description: 'Article listing with image',
    mappings: [
      {
        selector: 'h1',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'img',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'excerpt',
        },
      },
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'articles',
    variant: 'image-right',
    description: 'Article listing with image on right',
    mappings: [
      {
        selector: 'h1',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'img',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'excerpt',
        },
      },
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'articles',
    variant: 'image-background',
    description: 'Article listing with image as background',
    mappings: [
      {
        selector: 'h1',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'img',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'excerpt',
        },
      },
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'articles',
    variant: 'two-cards',
    description: 'Article listing with two cards',
    mappings: [
      {
        selector: 'h1',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'img',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'excerpt',
        },
      },
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
        },
      },
    ],
  },
  {
    blockType: 'articles',
    variant: 'single-author',
    description: 'Article listing with single author',
    mappings: [
      {
        selector: 'h1',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'title',
        },
      },
      {
        selector: 'img',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'src', valuePath: 'imageUrl' },
            { attribute: 'alt', valuePath: 'title' },
          ],
        },
      },
      {
        selector: 'p',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          content: 'excerpt',
        },
      },
      {
        selector: 'a[href]',
        repeat: true,
        arrayPath: 'articles',
        itemMappings: {
          attributes: [
            { attribute: 'href', valuePath: 'url' },
          ],
        },
      },
    ],
  },
];


// Register all mappings
articlesMappings.forEach(registerMapping);
