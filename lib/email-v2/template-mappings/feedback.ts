/**
 * Feedback Template Mappings
 * 
 * Defines how to inject FeedbackBlock data into feedback templates
 */

import { registerMapping, type TemplateMapping } from './types';

/**
 * Survey Section Mapping
 * Template: templates/feedback/survey-section.html
 * 
 * Structure:
 * - Eyebrow text (small colored text above heading)
 * - Heading (main title)
 * - Description/question text
 * - Rating buttons (1-5, repeating)
 */
const surveySectionMapping: TemplateMapping = {
  blockType: 'feedback',
  variant: 'survey-section',
  description: 'Survey with rating buttons',
  mappings: [
    // Eyebrow text
    {
      selector: 'p[style*="font-size:18px"][style*="color:rgb(79,70,229)"]',
      content: 'subheading',
    },
    // Main heading
    {
      selector: 'h1',
      content: 'heading',
    },
    // Question/description text
    {
      selector: 'p[style*="font-size:16px"][style*="color:rgb(55,65,81)"]',
      content: 'questions.0.text',
    },
    // Rating buttons (repeating)
    {
      selector: 'table td a[href]',
      repeat: true,
      arrayPath: 'questions.0.options',
      itemMappings: {
        attributes: [
          { attribute: 'href', valuePath: 'url' },
        ],
        content: 'text',
      },
    },
  ],
};

// Register all feedback mappings
registerMapping(surveySectionMapping);

// Export array for index.ts
export const feedbackMappings: TemplateMapping[] = [
  surveySectionMapping,
];

