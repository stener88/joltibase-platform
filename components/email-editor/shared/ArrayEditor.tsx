'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, updateItem: (updates: Partial<T>) => void, removeItem: () => void) => React.ReactNode;
  addItemLabel?: string;
  createDefaultItem: () => T;
  minItems?: number;
  maxItems?: number;
}

export function ArrayEditor<T>({
  items,
  onChange,
  renderItem,
  addItemLabel = 'Add Item',
  createDefaultItem,
  minItems = 0,
  maxItems,
}: ArrayEditorProps<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const addItem = () => {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, createDefaultItem()]);
    setExpandedIndex(items.length);
  };

  const removeItem = (index: number) => {
    if (minItems && items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(index > 0 ? index - 1 : null);
    }
  };

  const updateItem = (index: number, updates: Partial<T>) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          {/* Item Header */}
          <div
            className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Item {index + 1}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Move Up */}
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, 'up');
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}

              {/* Move Down */}
              {index < items.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveItem(index, 'down');
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}

              {/* Delete */}
              {(!minItems || items.length > minItems) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Expand/Collapse Icon */}
              <svg
                className={`w-4 h-4 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Item Content */}
          {expandedIndex === index && (
            <div className="p-3">
              {renderItem(
                item,
                index,
                (updates) => updateItem(index, updates),
                () => removeItem(index)
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add Item Button */}
      {(!maxItems || items.length < maxItems) && (
        <button
          onClick={addItem}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm text-gray-600"
        >
          <Plus className="w-4 h-4" />
          {addItemLabel}
        </button>
      )}
    </div>
  );
}

