/**
 * Direct DOM Manipulation
 * 
 * Applies simple edits directly to TSX source code without AI rewrite.
 * Used for instant feedback on simple changes like color, text, size.
 */

import fs from 'fs';
import path from 'path';
import type { SimpleEdit, ComponentContext } from './simple-edits';

const GENERATED_DIR = path.join(process.cwd(), 'emails/generated');

/**
 * Apply a simple edit directly to the source code
 */
export async function applySimpleEdit(
  filename: string,
  component: ComponentContext,
  edit: SimpleEdit
): Promise<void> {
  const filepath = path.join(GENERATED_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    throw new Error(`Email file not found: ${filename}`);
  }
  
  const code = fs.readFileSync(filepath, 'utf-8');
  
  let updated = code;
  
  if (edit.type === 'color' && edit.value) {
    updated = updateColorInSource(code, component, edit.value);
  } else if (edit.type === 'text' && edit.value) {
    updated = updateTextInSource(code, component, edit.value);
  } else if (edit.type === 'size' && edit.operation && edit.amount) {
    updated = updateSizeInSource(code, component, edit.operation, edit.amount);
  }
  
  if (updated !== code) {
    fs.writeFileSync(filepath, updated, 'utf-8');
    console.log(`✅ [SIMPLE EDIT] Updated ${filename} - ${edit.type}`);
  } else {
    console.warn(`⚠️ [SIMPLE EDIT] No changes made to ${filename}`);
  }
}

/**
 * Update backgroundColor in style objects
 * Finds the component by matching text content, then updates its style
 */
function updateColorInSource(
  code: string,
  component: ComponentContext,
  newColor: string
): string {
  // Try to find the component by its text content
  const componentText = component.text.trim();
  if (!componentText) {
    // Fallback: update first backgroundColor found
    return code.replace(
      /backgroundColor:\s*['"](.*?)['"]/g,
      (match, oldColor) => {
        return `backgroundColor: '${newColor}'`;
      }
    );
  }
  
  // Find the component by matching text content
  // Look for patterns like: <Button>text</Button> or <Text>text</Text>
  const escapedText = componentText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const textPattern = new RegExp(`(>${escapedText}<)`, 'i');
  
  if (!textPattern.test(code)) {
    // Text not found, update first backgroundColor
    return code.replace(
      /backgroundColor:\s*['"](.*?)['"]/,
      `backgroundColor: '${newColor}'`
    );
  }
  
  // Find the style object associated with this component
  // Look backwards from the text to find the style prop
  const lines = code.split('\n');
  let foundLineIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (textPattern.test(lines[i])) {
      foundLineIndex = i;
      break;
    }
  }
  
  if (foundLineIndex === -1) {
    // Fallback: update first backgroundColor
    return code.replace(
      /backgroundColor:\s*['"](.*?)['"]/,
      `backgroundColor: '${newColor}'`
    );
  }
  
  // Look backwards from found line to find style object
  for (let i = foundLineIndex; i >= 0; i--) {
    const line = lines[i];
    
    // Check if this line has a backgroundColor
    if (line.includes('backgroundColor')) {
      return code.replace(
        new RegExp(`(backgroundColor:\\s*['"])(.*?)(['"])`, 'g'),
        (match, prefix, oldColor, suffix) => {
          // Only replace if we're in the right context (near our component)
          const matchIndex = code.indexOf(match);
          const textIndex = code.indexOf(componentText);
          if (Math.abs(matchIndex - textIndex) < 500) {
            return `${prefix}${newColor}${suffix}`;
          }
          return match;
        }
      );
    }
  }
  
  // Fallback: update first backgroundColor
  return code.replace(
    /backgroundColor:\s*['"](.*?)['"]/,
    `backgroundColor: '${newColor}'`
  );
}

/**
 * Update text content in JSX
 */
function updateTextInSource(
  code: string,
  component: ComponentContext,
  newText: string
): string {
  const oldText = component.text.trim();
  if (!oldText) {
    return code;
  }
  
  // Escape regex special characters
  const escaped = oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Replace text content between tags
  // Pattern: >old text< -> >new text<
  const pattern = new RegExp(`(>)${escaped}(<)`, 'g');
  
  if (pattern.test(code)) {
    return code.replace(pattern, `$1${newText}$2`);
  }
  
  return code;
}

/**
 * Update fontSize in style objects
 */
function updateSizeInSource(
  code: string,
  component: ComponentContext,
  operation: 'increase' | 'decrease',
  multiplier: number
): string {
  const componentText = component.text.trim();
  
  // Find fontSize values and multiply them
  return code.replace(
    /fontSize:\s*['"](\d+)px['"]/g,
    (match, size) => {
      const currentSize = parseInt(size, 10);
      const newSize = Math.round(currentSize * multiplier);
      
      // Only update if we're in the right context (near our component)
      if (componentText) {
        const matchIndex = code.indexOf(match);
        const textIndex = code.indexOf(componentText);
        if (Math.abs(matchIndex - textIndex) < 500) {
          return `fontSize: '${newSize}px'`;
        }
        return match;
      }
      
      // No component text, update all
      return `fontSize: '${newSize}px'`;
    }
  );
}





