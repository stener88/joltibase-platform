/**
 * Ecommerce Template Mappings
 * 
 * Defines how to inject EcommerceBlock data into ecommerce templates
 */

import { registerMapping, type TemplateMapping } from './types';

/**
 * One Product Mapping (centered)
 * Template: templates/ecommerce/one-product.html
 */
const oneProductMapping: TemplateMapping = {
  blockType: 'ecommerce',
  variant: 'one-product',
  description: 'Single product showcase centered',
  mappings: [
    // Product image
    {
      selector: 'img[alt*="Collection"]',
      attributes: [
        { attribute: 'src', valuePath: 'products.0.imageUrl' },
        { attribute: 'alt', valuePath: 'products.0.name' },
      ],
    },
    // Category/eyebrow
    {
      selector: 'p[style*="color:rgb(79,70,229)"]',
      content: 'subheading',
    },
    // Product name
    {
      selector: 'h1',
      content: 'products.0.name',
    },
    // Product description
    {
      selector: 'p[style*="color:rgb(107,114,128)"]',
      content: 'products.0.description',
    },
    // Price
    {
      selector: 'p[style*="font-weight:600"][style*="color:rgb(17,24,39)"]',
      content: 'products.0.price',
    },
    // Buy button
    {
      selector: 'a[style*="background-color:rgb(79,70,229)"]',
      attributes: [
        { attribute: 'href', valuePath: 'products.0.ctaUrl' },
      ],
      content: 'products.0.ctaText',
    },
  ],
};

/**
 * One Product Left Mapping (image on left)
 * Template: templates/ecommerce/one-product-left.html
 */
const oneProductLeftMapping: TemplateMapping = {
  blockType: 'ecommerce',
  variant: 'one-product-left',
  description: 'Product with image on left side',
  mappings: [
    // Product image
    {
      selector: 'img[alt*="Vintage"]',
      attributes: [
        { attribute: 'src', valuePath: 'products.0.imageUrl' },
        { attribute: 'alt', valuePath: 'products.0.name' },
      ],
    },
    // Product name
    {
      selector: 'p[style*="font-size:20px"][style*="font-weight:600"]',
      content: 'products.0.name',
    },
    // Product description
    {
      selector: 'p[style*="color:rgb(107,114,128)"]',
      content: 'products.0.description',
    },
    // Price
    {
      selector: 'p[style*="font-size:18px"][style*="font-weight:600"]',
      content: 'products.0.price',
    },
    // Buy button
    {
      selector: 'a[style*="background-color:rgb(79,70,229)"]',
      attributes: [
        { attribute: 'href', valuePath: 'products.0.ctaUrl' },
      ],
      content: 'products.0.ctaText',
    },
  ],
};

/**
 * Three Cards Row Mapping
 * Template: templates/ecommerce/three-cards-row.html
 */
const threeCardsRowMapping: TemplateMapping = {
  blockType: 'ecommerce',
  variant: 'three-cards-row',
  description: 'Three products in a horizontal row',
  mappings: [
    // Section heading
    {
      selector: 'p[style*="font-size:20px"][style*="font-weight:600"]',
      content: 'heading',
    },
    // Section subheading
    {
      selector: 'p[style*="color:rgb(107,114,128)"]',
      content: 'subheading',
    },
    // Product cards (repeating)
    {
      selector: 'table[style*="max-width:200px"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [],
        content: '',
      },
    },
    // Within each product card: image
    {
      selector: 'table[style*="max-width:200px"] img',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'name' },
        ],
      },
    },
    // Product name
    {
      selector: 'table[style*="max-width:200px"] p[style*="font-size:20px"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'name',
      },
    },
    // Product description
    {
      selector: 'table[style*="max-width:200px"] p[style*="color:rgb(107,114,128)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'description',
      },
    },
    // Price
    {
      selector: 'table[style*="max-width:200px"] p[style*="font-weight:600"][style*="color:rgb(17,24,39)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'price',
      },
    },
    // Buy button
    {
      selector: 'table[style*="max-width:200px"] a[style*="background-color:rgb(79,70,229)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'ctaUrl' },
        ],
        content: 'ctaText',
      },
    },
  ],
};

/**
 * Four Cards Mapping
 * Template: templates/ecommerce/four-cards.html
 */
const fourCardsMapping: TemplateMapping = {
  blockType: 'ecommerce',
  variant: 'four-cards',
  description: 'Four products in 2x2 grid',
  mappings: [
    // Section heading
    {
      selector: 'p[style*="font-size:20px"][style*="font-weight:600"]',
      content: 'heading',
    },
    // Section subheading
    {
      selector: 'p[style*="color:rgb(107,114,128)"]',
      content: 'subheading',
    },
    // Product images (repeating)
    {
      selector: 'td[data-id="__react-email-column"] img',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'name' },
        ],
      },
    },
    // Product names (repeating)
    {
      selector: 'td[data-id="__react-email-column"] p[style*="font-size:20px"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'name',
      },
    },
    // Product descriptions (repeating)
    {
      selector: 'td[data-id="__react-email-column"] p[style*="color:rgb(107,114,128)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'description',
      },
    },
    // Prices (repeating)
    {
      selector: 'td[data-id="__react-email-column"] p[style*="font-weight:600"][style*="color:rgb(17,24,39)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'price',
      },
    },
    // Buy buttons (repeating)
    {
      selector: 'td[data-id="__react-email-column"] a[style*="background-color:rgb(79,70,229)"]',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'ctaUrl' },
        ],
        content: 'ctaText',
      },
    },
  ],
};

/**
 * Checkout Mapping
 * Template: templates/ecommerce/checkout.html
 */
const checkoutMapping: TemplateMapping = {
  blockType: 'ecommerce',
  variant: 'checkout',
  description: 'Shopping cart table with product list',
  mappings: [
    // Cart heading
    {
      selector: 'h1',
      content: 'heading',
    },
    // Cart items (repeating table rows)
    {
      selector: 'table tr:has(td img)',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [],
        content: '',
      },
    },
    // Product images (repeating)
    {
      selector: 'table tr:has(td img) img',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        attributes: [
          { attribute: 'src', valuePath: 'imageUrl' },
          { attribute: 'alt', valuePath: 'name' },
        ],
      },
    },
    // Product names (repeating)
    {
      selector: 'table tr:has(td img) td[colspan="6"] p',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'name',
      },
    },
    // Prices (repeating)
    {
      selector: 'table tr:has(td img) td[align="center"]:last-child p',
      repeat: true,
      arrayPath: 'products',
      itemMappings: {
        content: 'price',
      },
    },
    // Checkout button
    {
      selector: 'a[style*="background-color:rgb(79,70,229)"][style*="width:100%"]',
      attributes: [
        { attribute: 'href', valuePath: 'products.0.ctaUrl' },
      ],
      content: 'products.0.ctaText',
    },
  ],
};

// Register all ecommerce mappings
registerMapping(oneProductMapping);
registerMapping(oneProductLeftMapping);
registerMapping(threeCardsRowMapping);
registerMapping(fourCardsMapping);
registerMapping(checkoutMapping);

// Export array for index.ts
export const ecommerceMappings: TemplateMapping[] = [
  oneProductMapping,
  oneProductLeftMapping,
  threeCardsRowMapping,
  fourCardsMapping,
  checkoutMapping,
];

