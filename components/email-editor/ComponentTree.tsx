'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff, Copy, Trash2, MoveUp, MoveDown } from 'lucide-react';
import type { EmailComponent } from '@/lib/email-v2/types';
import { getComponentDepth, getBreadcrumbs } from '@/lib/email-v2';
import { Button } from '@/components/ui/button';

interface ComponentTreeProps {
  rootComponent: EmailComponent;
  selectedId?: string;
  onSelectComponent: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

interface TreeNodeProps {
  component: EmailComponent;
  depth: number;
  selectedId?: string;
  onSelectComponent: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function TreeNode({
  component,
  depth,
  selectedId,
  onSelectComponent,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2); // Auto-expand first 2 levels
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = component.id === selectedId;

  // Get component label
  const getLabel = () => {
    if (component.content) {
      // Truncate content for display
      const preview = component.content.substring(0, 30);
      return `${component.component} "${preview}${component.content.length > 30 ? '...' : ''}"`;
    }
    return component.component;
  };

  // Get component icon/indicator
  const getIcon = () => {
    switch (component.component) {
      case 'Container':
        return '📦';
      case 'Section':
        return '📄';
      case 'Row':
        return '↔️';
      case 'Column':
        return '▓';
      case 'Heading':
        return 'H';
      case 'Text':
        return 'T';
      case 'Button':
        return '🔘';
      case 'Img':
        return '🖼️';
      case 'Link':
        return '🔗';
      case 'Hr':
        return '➖';
      default:
        return '•';
    }
  };

  return (
    <div className="select-none">
      {/* Node row */}
      <div
        className={`
          flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer
          hover:bg-gray-100 transition-colors
          ${isSelected ? 'bg-violet-100 hover:bg-violet-200' : ''}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelectComponent(component.id)}
      >
        {/* Expand/collapse toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-0.5 hover:bg-gray-200 rounded"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )
          ) : (
            <span className="w-3.5 inline-block" />
          )}
        </button>

        {/* Component icon */}
        <span className="text-xs mr-1">{getIcon()}</span>

        {/* Component label */}
        <span className={`text-sm flex-1 ${isSelected ? 'font-medium' : ''}`}>
          {getLabel()}
        </span>

        {/* Actions (show on hover or selected) */}
        {isSelected && (
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            {onMoveUp && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMoveUp(component.id)}
                title="Move up"
              >
                <MoveUp size={12} />
              </Button>
            )}
            {onMoveDown && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMoveDown(component.id)}
                title="Move down"
              >
                <MoveDown size={12} />
              </Button>
            )}
            {onDuplicate && component.component !== 'Container' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onDuplicate(component.id)}
                title="Duplicate"
              >
                <Copy size={12} />
              </Button>
            )}
            {onDelete && component.component !== 'Container' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(component.id)}
                title="Delete"
              >
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {component.children!.map((child) => (
            <TreeNode
              key={child.id}
              component={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelectComponent={onSelectComponent}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ComponentTree({
  rootComponent,
  selectedId,
  onSelectComponent,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: ComponentTreeProps) {
  // Get breadcrumbs for selected component
  const breadcrumbs = selectedId ? getBreadcrumbs(rootComponent, selectedId) : [];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Component Tree</h3>
        {breadcrumbs.length > 0 && (
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-1 overflow-x-auto">
            {breadcrumbs.map((item, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-1">›</span>}
                <span className={index === breadcrumbs.length - 1 ? 'font-medium text-violet-600' : ''}>
                  {item}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <TreeNode
          component={rootComponent}
          depth={0}
          selectedId={selectedId}
          onSelectComponent={onSelectComponent}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>

      {/* Footer with stats */}
      <div className="p-2 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            {rootComponent.children ? countComponents(rootComponent) : 1} component{countComponents(rootComponent) !== 1 ? 's' : ''}
          </span>
          {selectedId && (
            <span className="text-violet-600 font-medium">Selected</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to count components
function countComponents(component: EmailComponent): number {
  let count = 1;
  if (component.children) {
    for (const child of component.children) {
      count += countComponents(child);
    }
  }
  return count;
}

