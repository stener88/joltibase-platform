/**
 * Article Template Mappings
 * 
 * Defines how to inject ArticleBlock data into article templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const articleMappings: TemplateMapping[] = [
  {
    blockType: 'article',
    variant: 'image-top',
    description: 'Article with image on top',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
  {
    blockType: 'article',
    variant: 'image-right',
    description: 'Article with image on right',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
  {
    blockType: 'article',
    variant: 'image-background',
    description: 'Article with image as background',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
  {
    blockType: 'article',
    variant: 'two-cards',
    description: 'Article with two cards',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
  {
    blockType: 'article',
    variant: 'single-author',
    description: 'Article with single author',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
  {
    blockType: 'article',
    variant: 'multiple-authors',
    description: 'Article with multiple authors',
    mappings: [
      {
        selector: 'h1, h2, h3',
        content: 'headline',
      },
      {
        selector: 'img',
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'imageAlt' },
        ],
      },
      {
        selector: 'p',
        content: 'excerpt',
      },
    ],
  },
];


// Register all mappings
articleMappings.forEach(registerMapping);
