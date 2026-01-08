/**
 * Code Diff Generator
 * 
 * Generates human-readable changelogs from TSX code differences
 * Shows users exactly what the AI modified
 */

import { parseAndInjectIds, type ComponentMap } from './tsx-parser';

export interface CodeChange {
  type: 'added' | 'modified' | 'removed';
  componentType: string;
  componentId?: string;
  property?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

/**
 * Generate a diff between two versions of TSX code
 * Returns a concise, prioritized list of meaningful changes
 * 
 * @param oldCode - Previous version of the code
 * @param newCode - New version of the code
 * @returns Array of changes with human-readable descriptions (max 5 most important)
 */
export function generateDiff(oldCode: string, newCode: string): CodeChange[] {
  const allChanges: CodeChange[] = [];
  
  try {
    // Parse both versions to get component maps
    const oldParsed = parseAndInjectIds(oldCode);
    const newParsed = parseAndInjectIds(newCode);
    
    const oldMap = oldParsed.componentMap;
    const newMap = newParsed.componentMap;
    
    // Detect removals (HIGH PRIORITY)
    for (const [id, oldComp] of Object.entries(oldMap)) {
      if (!newMap[id]) {
        allChanges.push({
          type: 'removed',
          componentType: oldComp.type,
          componentId: id,
          description: `Removed ${oldComp.type}`,
          priority: 10, // Highest
        } as any);
      }
    }
    
    // Detect additions (HIGH PRIORITY)
    const addedComponents: string[] = [];
    for (const [id, newComp] of Object.entries(newMap)) {
      const oldComp = oldMap[id];
      
      if (!oldComp) {
        addedComponents.push(newComp.type);
        allChanges.push({
          type: 'added',
          componentType: newComp.type,
          componentId: id,
          description: `Added ${newComp.type}`,
          priority: 10,
        } as any);
      }
    }
    
    // Detect meaningful modifications
    let textChanges = 0;
    let colorChanges = 0;
    let spacingChanges = 0;
    
    for (const [id, newComp] of Object.entries(newMap)) {
      const oldComp = oldMap[id];
      if (!oldComp) continue; // Already handled as addition
      
      // Check for text content changes (MEDIUM PRIORITY)
      const oldText = extractTextFromComponent(oldCode, oldComp);
      const newText = extractTextFromComponent(newCode, newComp);
      
      if (oldText !== newText && (oldText || newText)) {
        textChanges++;
        
        // Only add if it's a significant text change (not empty/whitespace)
        if (oldText.trim() && newText.trim() && oldText.trim() !== newText.trim()) {
          allChanges.push({
            type: 'modified',
            componentType: newComp.type,
            componentId: id,
            property: 'text',
            oldValue: oldText,
            newValue: newText,
            description: `Updated ${newComp.type} text`,
            priority: 7,
          } as any);
        }
      }
      
      // Check for image source changes (HIGH PRIORITY)
      if (newComp.type === 'Img') {
        const oldSrc = extractAttribute(oldCode, oldComp, 'src');
        const newSrc = extractAttribute(newCode, newComp, 'src');
        
        if (oldSrc !== newSrc) {
          allChanges.push({
            type: 'modified',
            componentType: 'Img',
            componentId: id,
            property: 'src',
            oldValue: oldSrc,
            newValue: newSrc,
            description: 'Changed image',
            priority: 9,
          } as any);
        }
      }
      
      // Check for significant style changes only
      const styleChanges = detectSignificantStyleChanges(oldCode, newCode, oldComp, newComp);
      
      styleChanges.forEach(change => {
        if (change.property === 'color') colorChanges++;
        if (change.property === 'spacing') spacingChanges++;
      });
      
      allChanges.push(...styleChanges);
    }
    
    // If no specific changes detected but code is different, log a generic change
    if (allChanges.length === 0 && oldCode !== newCode) {
      allChanges.push({
        type: 'modified',
        componentType: 'Email',
        description: 'Updated email',
        priority: 1,
      } as any);
    }
    
    // Group similar low-priority changes
    const prioritizedChanges = prioritizeAndGroupChanges(allChanges, {
      textChanges,
      colorChanges,
      spacingChanges,
    });
    
    return prioritizedChanges;
    
  } catch (error) {
    return [{
      type: 'modified',
      componentType: 'Email',
      description: 'Updated email',
    }];
  }
}

/**
 * Extract text content from a component
 */
function extractTextFromComponent(code: string, component: any): string {
  const componentCode = code.substring(component.startChar, component.endChar);
  
  // Extract text between tags: >text<
  const textMatch = componentCode.match(/>([^<]+)</);
  if (textMatch) {
    return textMatch[1].trim();
  }
  
  return '';
}

/**
 * Extract attribute value from component
 */
function extractAttribute(code: string, component: any, attrName: string): string {
  const componentCode = code.substring(component.startChar, component.endChar);
  
  // Match attribute with single or double quotes
  const regex = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`);
  const match = componentCode.match(regex);
  
  return match ? match[1] : '';
}

/**
 * Detect ONLY significant style changes (colors, sizes)
 * Ignores minor spacing tweaks
 */
function detectSignificantStyleChanges(
  oldCode: string,
  newCode: string,
  oldComp: any,
  newComp: any
): CodeChange[] {
  const changes: CodeChange[] = [];
  
  // Check className changes
  const oldClassName = extractAttribute(oldCode, oldComp, 'className');
  const newClassName = extractAttribute(newCode, newComp, 'className');
  
  if (oldClassName !== newClassName) {
    // Only track significant changes
    const colorChange = detectColorChange(oldClassName, newClassName);
    const sizeChange = detectSizeChange(oldClassName, newClassName);
    
    if (colorChange) {
      changes.push({
        type: 'modified',
        componentType: newComp.type,
        componentId: newComp.id,
        property: 'color',
        oldValue: colorChange.old,
        newValue: colorChange.new,
        description: `Changed color to ${colorChange.new}`,
        priority: 8,
      } as any);
    }
    
    if (sizeChange) {
      changes.push({
        type: 'modified',
        componentType: newComp.type,
        componentId: newComp.id,
        property: 'size',
        oldValue: sizeChange.old,
        newValue: sizeChange.new,
        description: `Changed size to ${sizeChange.new}`,
        priority: 7,
      } as any);
    }
    
    // Don't track spacing changes individually - too noisy
  }
  
  return changes;
}

/**
 * Prioritize and group changes to show only the most meaningful ones
 * Limits to top 5 changes
 */
function prioritizeAndGroupChanges(
  allChanges: Array<CodeChange & { priority?: number }>,
  stats: { textChanges: number; colorChanges: number; spacingChanges: number }
): CodeChange[] {
  // Sort by priority (highest first)
  const sorted = allChanges.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  // Take top 5 most important changes
  const topChanges = sorted.slice(0, 5);
  
  // Remove priority property before returning
  return topChanges.map(({ priority, ...change }) => change);
}

/**
 * Detect color changes in className
 */
function detectColorChange(oldClassName: string, newClassName: string): { old: string; new: string } | null {
  const colorRegex = /(bg|text)-(red|blue|green|yellow|purple|pink|gray|indigo|orange)-(\d+)/;
  
  const oldColor = oldClassName.match(colorRegex)?.[0];
  const newColor = newClassName.match(colorRegex)?.[0];
  
  if (oldColor && newColor && oldColor !== newColor) {
    return { old: oldColor, new: newColor };
  }
  
  return null;
}

/**
 * Detect size changes in className
 */
function detectSizeChange(oldClassName: string, newClassName: string): { old: string; new: string } | null {
  const sizeRegex = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/;
  
  const oldSize = oldClassName.match(sizeRegex)?.[0];
  const newSize = newClassName.match(sizeRegex)?.[0];
  
  if (oldSize && newSize && oldSize !== newSize) {
    return { old: oldSize, new: newSize };
  }
  
  return null;
}

/**
 * Detect spacing changes in className
 */
function detectSpacingChange(oldClassName: string, newClassName: string): boolean {
  const spacingRegex = /(p|m|px|py|pt|pb|mx|my|mt|mb)-\d+/g;
  
  const oldSpacing = oldClassName.match(spacingRegex)?.join(' ') || '';
  const newSpacing = newClassName.match(spacingRegex)?.join(' ') || '';
  
  return oldSpacing !== newSpacing;
}

/**
 * Generate a summary of changes for user-facing display
 */
export function summarizeChanges(changes: CodeChange[]): string {
  if (changes.length === 0) return 'No changes detected';
  
  if (changes.length === 1) return changes[0].description;
  
  const summary = changes.map(c => c.description).slice(0, 3);
  
  if (changes.length > 3) {
    return `${summary.join(', ')}, and ${changes.length - 3} more changes`;
  }
  
  return summary.join(', ');
}

