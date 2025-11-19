/**
 * Component Tree Utilities
 * 
 * Utilities for traversing and manipulating the EmailComponent tree
 * Used by the visual editor for component selection and modification
 */

import type { EmailComponent, SelectableElement } from './types';
import { isEditable, canHaveChildren } from './components/registry';

/**
 * Find a component by ID in the tree
 */
export function findComponentById(
  root: EmailComponent,
  targetId: string
): EmailComponent | null {
  if (root.id === targetId) {
    return root;
  }

  if (root.children) {
    for (const child of root.children) {
      const found = findComponentById(child, targetId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a component by path (e.g., "root.children[0].children[1]")
 */
export function findComponentByPath(
  root: EmailComponent,
  path: string
): EmailComponent | null {
  if (path === 'root') return root;

  try {
    // eslint-disable-next-line no-new-func
    const getter = new Function('root', `return root.${path.replace('root.', '')}`);
    return getter(root) as EmailComponent;
  } catch {
    return null;
  }
}

/**
 * Get the path to a component by ID
 */
export function getComponentPath(
  root: EmailComponent,
  targetId: string,
  currentPath: string = 'root'
): string | null {
  if (root.id === targetId) {
    return currentPath;
  }

  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      const childPath = `${currentPath}.children[${i}]`;
      const found = getComponentPath(root.children[i], targetId, childPath);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Get parent component by child ID
 */
export function getParentComponent(
  root: EmailComponent,
  childId: string
): EmailComponent | null {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === childId) {
        return root;
      }
      const found = getParentComponent(child, childId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get parent path by child ID
 */
export function getParentPath(
  root: EmailComponent,
  childId: string
): string | null {
  const childPath = getComponentPath(root, childId);
  if (!childPath || childPath === 'root') return null;
  
  // Remove the last .children[n] segment
  const match = childPath.match(/(.+)\.children\[\d+\]$/);
  return match ? match[1] : null;
}

/**
 * Flatten component tree into a list of selectable elements
 */
export function flattenComponentTree(
  root: EmailComponent,
  parentPath: string = ''
): SelectableElement[] {
  const path = parentPath ? `${parentPath}.children[${root.id}]` : 'root';
  const elements: SelectableElement[] = [];

  // Add current element if it's editable
  if (isEditable(root.component)) {
    elements.push({
      id: root.id,
      path,
      component: root.component,
      props: root.props || {},
      content: root.content,
      editable: true,
      parentPath: parentPath || undefined,
    });
  }

  // Recursively add children
  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      const childPath = path === 'root' ? `root.children[${i}]` : `${path}.children[${i}]`;
      elements.push(...flattenComponentTree(root.children[i], childPath));
    }
  }

  return elements;
}

/**
 * Update a component in the tree by ID
 */
export function updateComponentById(
  root: EmailComponent,
  targetId: string,
  updates: Partial<EmailComponent>
): EmailComponent {
  if (root.id === targetId) {
    return {
      ...root,
      ...updates,
      // Preserve children unless explicitly updated
      children: updates.children !== undefined ? updates.children : root.children,
    };
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child =>
        updateComponentById(child, targetId, updates)
      ),
    };
  }

  return root;
}

/**
 * Update a component in the tree by path
 */
export function updateComponentByPath(
  root: EmailComponent,
  path: string,
  updates: Partial<EmailComponent>
): EmailComponent {
  const component = findComponentByPath(root, path);
  if (!component) return root;
  
  return updateComponentById(root, component.id, updates);
}

/**
 * Delete a component from the tree by ID
 */
export function deleteComponentById(
  root: EmailComponent,
  targetId: string
): EmailComponent | null {
  // Can't delete root
  if (root.id === targetId) {
    return null;
  }

  if (root.children) {
    // Check if target is a direct child
    const childIndex = root.children.findIndex(c => c.id === targetId);
    if (childIndex !== -1) {
      return {
        ...root,
        children: root.children.filter((_, i) => i !== childIndex),
      };
    }

    // Recursively check children
    return {
      ...root,
      children: root.children.map(child => {
        const result = deleteComponentById(child, targetId);
        return result || child;
      }),
    };
  }

  return root;
}

/**
 * Get component depth in tree (root = 0)
 */
export function getComponentDepth(
  root: EmailComponent,
  targetId: string,
  currentDepth: number = 0
): number {
  if (root.id === targetId) {
    return currentDepth;
  }

  if (root.children) {
    for (const child of root.children) {
      const depth = getComponentDepth(child, targetId, currentDepth + 1);
      if (depth !== -1) return depth;
    }
  }

  return -1;
}

/**
 * Get all siblings of a component
 */
export function getSiblings(
  root: EmailComponent,
  targetId: string
): EmailComponent[] {
  const parent = getParentComponent(root, targetId);
  if (!parent || !parent.children) return [];
  
  return parent.children.filter(c => c.id !== targetId);
}

/**
 * Get component index among siblings
 */
export function getComponentIndex(
  root: EmailComponent,
  targetId: string
): number {
  const parent = getParentComponent(root, targetId);
  if (!parent || !parent.children) return -1;
  
  return parent.children.findIndex(c => c.id === targetId);
}

/**
 * Move component up/down among siblings
 */
export function moveComponent(
  root: EmailComponent,
  targetId: string,
  direction: 'up' | 'down'
): EmailComponent {
  const parent = getParentComponent(root, targetId);
  if (!parent || !parent.children) return root;
  
  const index = parent.children.findIndex(c => c.id === targetId);
  if (index === -1) return root;
  
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= parent.children.length) return root;
  
  // Swap elements
  const newChildren = [...parent.children];
  [newChildren[index], newChildren[newIndex]] = [newChildren[newIndex], newChildren[index]];
  
  return updateComponentById(root, parent.id, { children: newChildren });
}

/**
 * Duplicate a component
 */
export function duplicateComponent(
  root: EmailComponent,
  targetId: string
): EmailComponent {
  const component = findComponentById(root, targetId);
  const parent = getParentComponent(root, targetId);
  
  if (!component || !parent || !parent.children) return root;
  
  const index = parent.children.findIndex(c => c.id === targetId);
  if (index === -1) return root;
  
  // Create duplicate with new ID
  const duplicate: EmailComponent = {
    ...component,
    id: `${component.id}-copy-${Date.now()}`,
    children: component.children ? component.children.map(c => ({
      ...c,
      id: `${c.id}-copy-${Date.now()}`,
    })) : undefined,
  };
  
  // Insert after original
  const newChildren = [
    ...parent.children.slice(0, index + 1),
    duplicate,
    ...parent.children.slice(index + 1),
  ];
  
  return updateComponentById(root, parent.id, { children: newChildren });
}

/**
 * Validate that a component can be inserted at a location
 */
export function canInsertComponent(
  root: EmailComponent,
  parentId: string,
  componentType: string
): boolean {
  const parent = findComponentById(root, parentId);
  if (!parent) return false;
  
  // Check if parent can have children
  if (!canHaveChildren(parent.component)) return false;
  
  // Add more validation rules as needed
  // For example: Button can't contain Button, etc.
  
  return true;
}

/**
 * Insert a component as a child of another component
 */
export function insertComponent(
  root: EmailComponent,
  parentId: string,
  component: EmailComponent,
  index?: number
): EmailComponent {
  const parent = findComponentById(root, parentId);
  if (!parent) return root;
  
  const children = parent.children || [];
  const insertIndex = index !== undefined ? index : children.length;
  
  const newChildren = [
    ...children.slice(0, insertIndex),
    component,
    ...children.slice(insertIndex),
  ];
  
  return updateComponentById(root, parentId, { children: newChildren });
}

/**
 * Get breadcrumb path for a component (e.g., ["Container", "Section", "Heading"])
 */
export function getBreadcrumbs(
  root: EmailComponent,
  targetId: string
): string[] {
  const path: string[] = [];
  
  function traverse(node: EmailComponent): boolean {
    path.push(node.component);
    
    if (node.id === targetId) {
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) return true;
      }
    }
    
    path.pop();
    return false;
  }
  
  traverse(root);
  return path;
}

/**
 * Count total components in tree
 */
export function countComponents(root: EmailComponent): number {
  let count = 1; // Count self
  
  if (root.children) {
    for (const child of root.children) {
      count += countComponents(child);
    }
  }
  
  return count;
}

/**
 * Get tree statistics
 */
export interface TreeStats {
  totalComponents: number;
  maxDepth: number;
  componentTypes: Record<string, number>;
  editableComponents: number;
}

export function getTreeStats(root: EmailComponent): TreeStats {
  const stats: TreeStats = {
    totalComponents: 0,
    maxDepth: 0,
    componentTypes: {},
    editableComponents: 0,
  };
  
  function traverse(node: EmailComponent, depth: number) {
    stats.totalComponents++;
    stats.maxDepth = Math.max(stats.maxDepth, depth);
    stats.componentTypes[node.component] = (stats.componentTypes[node.component] || 0) + 1;
    
    if (isEditable(node.component)) {
      stats.editableComponents++;
    }
    
    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    }
  }
  
  traverse(root, 0);
  return stats;
}

