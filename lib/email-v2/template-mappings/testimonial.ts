/**
 * Testimonial Template Mappings
 * 
 * Defines how to inject TestimonialBlock data into testimonial templates
 */

import { registerMapping, type TemplateMapping } from './types';

export const testimonialMappings: TemplateMapping[] = [
  {
    blockType: 'testimonial',
    variant: 'simple-centered',
    description: 'Simple centered testimonial',
    mappings: [
      {
        selector: 'p',
        content: 'quote',
      },
      {
        selector: 'img[alt]',
        attributes: [
          { attribute: 'src', valuePath: 'authorImage' },
          { attribute: 'alt', valuePath: 'authorName' },
        ],
      },
    ],
  },
  {
    blockType: 'testimonial',
    variant: 'large-avatar',
    description: 'Testimonial with large avatar',
    mappings: [
      {
        selector: 'p',
        content: 'quote',
      },
      {
        selector: 'img[alt]',
        attributes: [
          { attribute: 'src', valuePath: 'authorImage' },
          { attribute: 'alt', valuePath: 'authorName' },
        ],
      },
    ],
  },
  {
    blockType: 'testimonial',
    variant: 'centered',
    description: 'Centered testimonial',
    mappings: [
      {
        selector: 'p',
        content: 'quote',
      },
      {
        selector: 'img[alt]',
        attributes: [
          { attribute: 'src', valuePath: 'authorImage' },
          { attribute: 'alt', valuePath: 'authorName' },
        ],
      },
    ],
  },
];


// Register all mappings
testimonialMappings.forEach(registerMapping);
