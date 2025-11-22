/**
 * Template Mapping Configuration Types
 * 
 * Defines how to inject semantic block data into HTML templates
 * Uses CSS selectors to target elements for replacement
 */

/**
 * Attribute mapping - maps block properties to HTML attributes
 */
export interface AttributeMapping {
  /** HTML attribute name (e.g., 'src', 'href', 'alt') */
  attribute: string;
  
  /** Path to value in block data (e.g., 'logo.src', 'ctaUrl') */
  valuePath: string;
}

/**
 * Element mapping configuration
 */
export interface ElementMapping {
  /** CSS selector to find element(s) in template */
  selector: string;
  
  /** Attribute mappings for this element */
  attributes?: AttributeMapping[];
  
  /** Content mapping - path to text content in block data */
  content?: string;
  
  /** If true, this mapping repeats for array data */
  repeat?: boolean;
  
  /** Path to array in block data (required if repeat: true) */
  arrayPath?: string;
  
  /** For repeated elements, mappings for each item */
  itemMappings?: {
    attributes?: AttributeMapping[];
    content?: string;
  };
}

/**
 * Complete template mapping configuration
 */
export interface TemplateMapping {
  /** Block type this mapping is for */
  blockType: string;
  
  /** Variant this mapping is for */
  variant: string;
  
  /** Element mappings */
  mappings: ElementMapping[];
  
  /** Description of this mapping */
  description?: string;
}

/**
 * Mapping registry - stores all template mappings
 */
const MAPPING_REGISTRY: Map<string, TemplateMapping> = new Map();

/**
 * Register a template mapping
 */
export function registerMapping(mapping: TemplateMapping): void {
  const key = `${mapping.blockType}/${mapping.variant}`;
  MAPPING_REGISTRY.set(key, mapping);
}

/**
 * Get mapping for a block type and variant
 */
export function getMapping(blockType: string, variant: string): TemplateMapping | null {
  const key = `${blockType}/${variant}`;
  return MAPPING_REGISTRY.get(key) || null;
}

/**
 * Get value from object using dot notation path
 * Example: getValue(block, 'logo.src') => block.logo.src
 */
export function getValue(obj: any, path: string): any {
  const parts = path.split('.');
  let value = obj;
  
  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[part];
  }
  
  return value;
}

