'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface TagSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ tags, onChange }: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleAddTag = () => {
    const tag = inputValue.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue('');
    setShowInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setShowInput(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        {showInput ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            placeholder="Type tag name..."
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:border-[#1a1aff] hover:text-[#1a1aff] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add tag
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Press Enter to add, click X to remove
      </p>
    </div>
  );
}

