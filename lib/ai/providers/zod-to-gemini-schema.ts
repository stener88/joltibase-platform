/**
 * Zod to Gemini Schema Converter
 * 
 * Converts Zod schemas to Gemini's native schema format
 * This is much simpler than OpenAI's JSON Schema conversion!
 */

import { z } from 'zod';
import { SchemaType } from '@google/generative-ai';

/**
 * Convert a Zod schema to Gemini's schema format
 * 
 * Gemini supports:
 * - STRING, NUMBER, INTEGER, BOOLEAN, ARRAY, OBJECT
 * - Nested structures
 * - Optional properties (nullable: true)
 * - Enums
 */
export function zodToGoogleAISchema(zodSchema: z.ZodType<any, any, any>): any {
  return convertZodToGemini(zodSchema);
}

function convertZodToGemini(schema: z.ZodType<any, any, any>): any {
  // Handle ZodOptional
  if (schema instanceof z.ZodOptional) {
    const innerSchema = convertZodToGemini(schema.unwrap() as z.ZodType<any, any, any>);
    return {
      ...innerSchema,
      nullable: true,
    };
  }

  // Handle ZodNullable
  if (schema instanceof z.ZodNullable) {
    const innerSchema = convertZodToGemini(schema.unwrap() as z.ZodType<any, any, any>);
    return {
      ...innerSchema,
      nullable: true,
    };
  }

  // Handle ZodDefault
  if (schema instanceof z.ZodDefault) {
    return convertZodToGemini(schema.removeDefault() as z.ZodType<any, any, any>);
  }

  // Handle ZodString
  if (schema instanceof z.ZodString) {
    return {
      type: SchemaType.STRING,
    };
  }

  // Handle ZodNumber
  if (schema instanceof z.ZodNumber) {
    return {
      type: SchemaType.NUMBER,
    };
  }

  // Handle ZodBoolean
  if (schema instanceof z.ZodBoolean) {
    return {
      type: SchemaType.BOOLEAN,
    };
  }

  // Handle ZodLiteral
  if (schema instanceof z.ZodLiteral) {
    const value = schema.value;
    if (typeof value === 'string') {
      return {
        type: SchemaType.STRING,
        enum: [value],
      };
    } else if (typeof value === 'number') {
      return {
        type: SchemaType.NUMBER,
        enum: [value],
      };
    } else if (typeof value === 'boolean') {
      return {
        type: SchemaType.BOOLEAN,
      };
    }
  }

  // Handle ZodEnum
  if (schema instanceof z.ZodEnum) {
    return {
      type: SchemaType.STRING,
      enum: schema.options,
    };
  }

  // Handle ZodArray
  if (schema instanceof z.ZodArray) {
    return {
      type: SchemaType.ARRAY,
      items: convertZodToGemini(schema.element as z.ZodType<any, any, any>),
    };
  }

  // Handle ZodObject
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const zodValue = value as z.ZodType<any>;
      properties[key] = convertZodToGemini(zodValue);

      // Check if field is required (not optional or nullable)
      if (
        !(zodValue instanceof z.ZodOptional) &&
        !(zodValue instanceof z.ZodNullable)
      ) {
        required.push(key);
      }
    }

    return {
      type: SchemaType.OBJECT,
      properties,
      required,
    };
  }

  // Handle ZodUnion (including discriminated unions)
  if (schema instanceof z.ZodUnion || schema instanceof z.ZodDiscriminatedUnion) {
    // For discriminated unions: Keep it simple!
    // Don't try to define the full nested structure - let Gemini infer from examples
    // We validate with Zod after the response anyway
    if (schema instanceof z.ZodDiscriminatedUnion) {
      const options = (schema as any)._def?.options || [];
      const discriminatorKey = (schema as any)._def?.discriminator;
      
      if (options.length > 0 && discriminatorKey) {
        // Extract all possible type values
        const discriminatorValues: string[] = [];
        for (const option of options) {
          const discriminatorField = option.shape?.[discriminatorKey];
          if (discriminatorField && discriminatorField._def?.value) {
            discriminatorValues.push(discriminatorField._def.value);
          }
        }
        
        // Simple approach: Just tell Gemini it's an object with a type field
        // The prompt examples will guide the actual structure
        return {
          type: SchemaType.OBJECT,
          description: `Object with '${discriminatorKey}' field. Valid types: ${discriminatorValues.join(', ')}`,
          properties: {
            [discriminatorKey]: {
              type: SchemaType.STRING,
              description: `Must be one of: ${discriminatorValues.join(', ')}`,
            },
          },
          required: [discriminatorKey],
        };
      }
    }

    // For simple unions, convert first option (fallback)
    const options = (schema as any)._def?.options;
    if (options && Array.isArray(options) && options.length > 0) {
      return convertZodToGemini(options[0]);
    }
  }

  // Handle ZodRecord
  if (schema instanceof z.ZodRecord) {
    return {
      type: SchemaType.OBJECT,
      properties: {},
      additionalProperties: convertZodToGemini((schema as any)._def.valueType),
    };
  }

  // Handle ZodIntersection
  if (schema instanceof z.ZodIntersection) {
    const left = convertZodToGemini((schema as any)._def.left);
    const right = convertZodToGemini((schema as any)._def.right);
    
    // Merge two object schemas
    if (left.type === SchemaType.OBJECT && right.type === SchemaType.OBJECT) {
      return {
        type: SchemaType.OBJECT,
        properties: {
          ...left.properties,
          ...right.properties,
        },
        required: [
          ...(left.required || []),
          ...(right.required || []),
        ],
      };
    }
    
    return left; // Fallback to left side
  }

  // Fallback for unknown types
  console.warn('[ZOD_TO_GEMINI] Unknown Zod type, defaulting to STRING:', schema.constructor.name);
  return {
    type: SchemaType.STRING,
  };
}

/**
 * Validate that a Zod schema can be converted to Gemini format
 */
export function validateZodSchemaForGemini(zodSchema: z.ZodType<any, any, any>): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  function checkSchema(schema: z.ZodType<any, any, any>, path: string = 'root'): void {
    // Check for ZodTransformer/ZodEffects (refinements/transforms)
    // Note: Zod v4 may have renamed ZodEffects
    if ((schema as any)._def?.typeName === 'ZodEffects') {
      warnings.push(`${path}: Refinements/transforms are not supported by Gemini API (only validated client-side)`);
      checkSchema((schema as any)._def.schema, path);
      return;
    }

    // Check for ZodUnion - limited support
    if (schema instanceof z.ZodUnion && !(schema instanceof z.ZodDiscriminatedUnion)) {
      warnings.push(`${path}: Regular unions have limited support, consider using discriminated unions`);
    }

    // Recursively check nested schemas
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape;
      for (const [key, value] of Object.entries(shape)) {
        checkSchema(value as z.ZodType<any, any, any>, `${path}.${key}`);
      }
    }

    if (schema instanceof z.ZodArray) {
      checkSchema(schema.element as z.ZodType<any, any, any>, `${path}[]`);
    }

    if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
      checkSchema(schema.unwrap() as z.ZodType<any, any, any>, path);
    }
  }

  checkSchema(zodSchema);

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

