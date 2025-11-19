/**
 * Schemas for AI Email Generation
 * 
 * Uses Zod for API request/response validation
 * Semantic block schemas are in blocks.ts
 */

import { z } from 'zod';
import { jsonSchema } from 'ai';

/**
 * DEPRECATED: Old direct component generation schema
 * Kept for backwards compatibility with component refinement
 * 
 * For new email generation, use EmailContentSchema from blocks.ts
 */

/**
 * JSON Schema for component refinement
 */
export const componentRefinementJsonSchema = jsonSchema<{
  props?: Record<string, any>;
  content?: string;
  explanation?: string;
}>({
  type: 'object',
  properties: {
    props: {
      type: 'object',
      description: 'Updated props (only include changed props)',
      additionalProperties: true
    },
    content: {
      type: 'string',
      description: 'Updated content (only if content changed)'
    },
    explanation: {
      type: 'string',
      description: 'Brief explanation of changes made'
    },
  },
});

/**
 * Schema for AI generation request
 */
export const GenerateEmailRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  campaignId: z.string().uuid('Invalid campaign ID'),
});

/**
 * Schema for AI refinement request
 */
export const RefineComponentRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  campaignId: z.string().uuid('Invalid campaign ID'),
  componentPath: z.string().min(1, 'Component path is required'),
});

/**
 * Schema for global email settings
 */
export const GlobalEmailSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  fontFamily: z.string().min(1, 'Font family is required'),
  maxWidth: z.string().regex(/^\d+px$/, 'Max width must be in pixels'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});


