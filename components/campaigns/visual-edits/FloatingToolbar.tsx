/**
 * Floating Toolbar
 * 
 * Compact icon-based toolbar with expandable inline panels
 * Layout: [AI Input] | [T] [🎨] [↔️] | [⚙️] | [🗑️]
 * Customizes based on component type via ToolbarConfig 
 */

'use client';

import { useState, useRef } from 'react';
import { Type, Palette, Trash2, ArrowUp, Settings, MoveHorizontal } from 'lucide-react';
import { ElementDescriptor, getDeleteBehavior } from '@/lib/email-v2/visual-edits/element-descriptor';
import type { ToolbarConfig } from '@/lib/email-v2/toolbar-config';
import type { ComponentType } from '@/lib/email-v2/types';

interface FloatingToolbarProps {
  descriptor: ElementDescriptor;
  position: { x: number; y: number };
  onAISubmit: (prompt: string) => void;
  onContentClick: () => void;
  onStylesClick: () => void;
  onSpacingClick: () => void;
  onGlobalSettingsClick: () => void;
  onDeleteClick: () => void;
  isAILoading?: boolean;
  toolbarConfig?: ToolbarConfig; // Optional config for V2 components
  componentType?: ComponentType; // For formatting quick action prompts
}

export function FloatingToolbar({
  descriptor,
  position,
  onAISubmit,
  onContentClick,
  onStylesClick,
  onSpacingClick,
  onGlobalSettingsClick,
  onDeleteClick,
  isAILoading = false,
  toolbarConfig,
  componentType,
}: FloatingToolbarProps) {
  const [aiInput, setAiInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAISubmit = () => {
    if (aiInput.trim() && !isAILoading) {
      onAISubmit(aiInput.trim());
      setAiInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAISubmit();
    }
  };

  // Use toolbar config if provided, otherwise fall back to V1 behavior
  const showAIInput = toolbarConfig?.showAIInput ?? true;
  const showContentButton = toolbarConfig?.showContentButton ?? true;
  const showStylesButton = toolbarConfig?.showStylesButton ?? true;
  const showSpacingButton = toolbarConfig?.showSpacingButton ?? true;
  const aiPlaceholder = toolbarConfig?.aiPromptPlaceholder ?? 'Ask for quick changes...';

  // Delete button logic - prefer toolbarConfig, fall back to V1 logic
  let showDeleteButton = true;
  let deleteTooltip = 'Delete';
  
  if (toolbarConfig) {
    showDeleteButton = toolbarConfig.showDeleteButton;
    deleteTooltip = 'Delete component';
  } else {
    // V1 behavior
    const deleteBehavior = getDeleteBehavior(descriptor.elementType, descriptor.elementId);
    showDeleteButton = deleteBehavior.behavior !== 'not-deletable';
    deleteTooltip = deleteBehavior.tooltip;
  }

  // Determine if we need separator before buttons section
  const hasEditButtons = showContentButton || showStylesButton || showSpacingButton;

  return (
    <div
      className="fixed bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-700 flex items-center gap-2 p-2 z-[100]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {/* AI Input Field */}
      {showAIInput && (
        <div className="flex items-center gap-1 bg-[#3d3d3d] rounded-lg px-3 py-1.5 min-w-[200px]">
          <input
            ref={inputRef}
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={aiPlaceholder}
            disabled={isAILoading}
            className="bg-transparent text-white text-sm placeholder-gray-400 outline-none flex-1 min-w-[150px] disabled:opacity-50"
          />
          <button
            onClick={handleAISubmit}
            disabled={!aiInput.trim() || isAILoading}
            className="p-1 hover:bg-[#4d4d4d] rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAILoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Separator before edit buttons */}
      {showAIInput && hasEditButtons && (
        <div className="w-px h-6 bg-gray-600" />
      )}

      {/* Content Button */}
      {showContentButton && (
        <button
          onClick={onContentClick}
          className="p-2 hover:bg-[#4d4d4d] rounded-lg transition-colors group"
          title="Edit content"
        >
          <Type className="w-4 h-4 text-gray-300 group-hover:text-white" />
        </button>
      )}

      {/* Styles Button */}
      {showStylesButton && (
        <button
          onClick={onStylesClick}
          className="p-2 hover:bg-[#4d4d4d] rounded-lg transition-colors group"
          title="Edit styles"
        >
          <Palette className="w-4 h-4 text-gray-300 group-hover:text-white" />
        </button>
      )}

      {/* Spacing Button */}
      {showSpacingButton && (
        <button
          onClick={onSpacingClick}
          className="p-2 hover:bg-[#4d4d4d] rounded-lg transition-colors group"
          title="Edit spacing"
        >
          <MoveHorizontal className="w-4 h-4 text-gray-300 group-hover:text-white" />
        </button>
      )}

      {/* Global Settings Button - always shown */}
      {hasEditButtons && <div className="w-px h-6 bg-gray-600" />}
      <button
        onClick={onGlobalSettingsClick}
        className="p-2 hover:bg-[#4d4d4d] rounded-lg transition-colors group"
        title="Global settings"
      >
        <Settings className="w-4 h-4 text-gray-300 group-hover:text-white" />
      </button>

      {/* Delete Button - conditionally shown */}
      {showDeleteButton && (
        <>
          {/* Separator */}
          <div className="w-px h-6 bg-gray-600" />
          
          <button
            onClick={onDeleteClick}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors group"
            title={deleteTooltip}
          >
            <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-white" />
          </button>
        </>
      )}
    </div>
  );
}
