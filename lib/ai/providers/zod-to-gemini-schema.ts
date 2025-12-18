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
    const checks = (schema as any)._def?.checks || [];
    const maxCheck = checks.find((c: any) => c.kind === 'max');
    const minCheck = checks.find((c: any) => c.kind === 'min');
    
    const result: any = {
      type: SchemaType.STRING,
    };
    
    // Extract maxLength constraint from ZodString.max()
    if (maxCheck && typeof maxCheck.value === 'number') {
      // Gemini doesn't support maxLength in schema, but we can add it to description
      result.description = `Maximum length: ${maxCheck.value} characters`;
    }
    
    // Extract minLength constraint from ZodString.min()
    if (minCheck && typeof minCheck.value === 'number') {
      const desc = result.description || '';
      result.description = desc ? `${desc}. Minimum length: ${minCheck.value} characters` : `Minimum length: ${minCheck.value} characters`;
    }
    
    return result;
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

  // Handle ZodUndefined (for optional fields in unions)
  if (schema instanceof z.ZodUndefined) {
    return {
      type: SchemaType.STRING,
      nullable: true,
    };
  }

  // Handle ZodNull (for nullable fields in unions)
  if (schema instanceof z.ZodNull) {
    return {
      type: SchemaType.STRING,
      nullable: true,
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
    const enumValues = schema.options;
    return {
      type: SchemaType.STRING,
      enum: enumValues,
      description: `Must be EXACTLY one of: ${enumValues.join(', ')}. Do not invent new values.`,
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

    // Check if this is a passthrough object (empty shape)
    const isPassthrough = Object.keys(shape).length === 0;
    
    if (isPassthrough) {
      // For passthrough objects, don't enforce any specific properties
      // Let Gemini generate whatever makes sense
      return {
        type: SchemaType.OBJECT,
        description: 'Flexible object structure (passthrough)',
      };
    }

    return {
      type: SchemaType.OBJECT,
      properties,
      required,
    };
  }

  // Handle ZodUnion (including discriminated unions)
  if (schema instanceof z.ZodUnion || schema instanceof z.ZodDiscriminatedUnion) {
    // For discriminated unions: Convert ALL options with full property constraints
    // This ensures variant enums and nested fields are enforced
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
        
        // Merge all properties from all options with descriptions
        // This ensures variant enums and nested required fields are included
        const allProperties: Record<string, any> = {};
        const allRequired: Set<string> = new Set([discriminatorKey]);
        
        for (const option of options) {
          const converted = convertZodToGemini(option);
          if (converted.properties) {
            // Merge properties, keeping the most restrictive constraints
            for (const [key, value] of Object.entries(converted.properties)) {
              const typedValue = value as any;
              if (!allProperties[key]) {
                allProperties[key] = typedValue;
              } else {
                // If property exists, merge enum constraints if present
                if (typedValue.enum && allProperties[key].enum) {
                  // Combine enums (union of all possible values)
                  const combinedEnum = [...new Set([...allProperties[key].enum, ...typedValue.enum])];
                  allProperties[key] = {
                    ...allProperties[key],
                    enum: combinedEnum,
                    description: `Must be one of: ${combinedEnum.join(', ')}`,
                  };
                } else if (typedValue.enum) {
                  // Use the enum constraint
                  allProperties[key] = typedValue;
                }
                // Otherwise keep existing property definition
              }
            }
          }
          if (converted.required) {
            converted.required.forEach((r: string) => allRequired.add(r));
          }
        }
        
        return {
          type: SchemaType.OBJECT,
          description: `Block object with discriminator '${discriminatorKey}'. Valid types: ${discriminatorValues.join(', ')}. Each type has specific required fields and variant options.`,
          properties: allProperties,  // Includes variant enums, nested fields
          required: Array.from(allRequired),
        };
      }
    }

    // For regular unions: Check if it's an enum union with undefined/null (optional enum)
    const options = (schema as any)._def?.options;
    if (options && Array.isArray(options)) {
      // Check if this is an enum + undefined/null pattern (e.g., z.union([z.enum([...]), z.undefined(), z.null()]))
      const hasUndefined = options.some((opt: any) => opt instanceof z.ZodUndefined);
      const hasNull = options.some((opt: any) => opt instanceof z.ZodNull);
      const enumOptions = options.filter((opt: any) => opt instanceof z.ZodEnum);
      
      if ((hasUndefined || hasNull) && enumOptions.length === 1) {
        // This is an optional/nullable enum - convert the enum part and make it nullable
        const enumSchema = convertZodToGemini(enumOptions[0]);
        return {
          ...enumSchema,
          nullable: true,
        };
      }
      
      // Otherwise, convert first option (fallback)
      if (options.length > 0) {
        return convertZodToGemini(options[0]);
      }
    }
  }

  // Handle ZodRecord - Gemini requires at least one property for OBJECT type
  // Add a flexible placeholder that accepts any value type
  if (schema instanceof z.ZodRecord) {
    return {
      type: SchemaType.OBJECT,
      description: 'Flexible object with dynamic properties',
      properties: {
        // Placeholder property to satisfy Gemini's requirement
        // Actual objects can have any properties
        _flexible: {
          type: SchemaType.STRING,
          description: 'Placeholder - actual properties vary',
          nullable: true,
        },
      },
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

