/**
 * Schemas for AI Email Generation
 * 
 * Uses Zod for API request/response validation
 * Semantic block schemas are in blocks.ts
 */

import { z } from 'zod';

/**
 * DEPRECATED: Old direct component generation schema
 * Kept for backwards compatibility with component refinement
 * 
 * For new email generation, use EmailContentSchema from blocks.ts
 */

/**
 * Zod schema for component refinement
 * Converted from JSON Schema to Zod for native Gemini client compatibility
 */
export const componentRefinementSchema = z.object({
  props: z.record(z.string(), z.any()).optional().describe('Updated props (only include changed props)'),
  content: z.string().optional().describe('Updated content (only if content changed)'),
  // explanation removed to reduce token usage and keep responses concise
});

/**
 * Legacy export name for backwards compatibility
 * @deprecated Use componentRefinementSchema instead
 */
export const componentRefinementJsonSchema = componentRefinementSchema;

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


