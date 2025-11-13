'use client';

import { useState, useCallback, useEffect } from 'react';
import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { createDefaultBlock } from '@/lib/email/blocks/registry';
import { BlockCanvas } from './BlockCanvas';
import { BlockSettingsPanel } from './settings/BlockSettingsPanel';
import { BlockPaletteModal } from './BlockPaletteModal';

type DeviceMode = 'desktop' | 'mobile';

interface VisualBlockEditorProps {
  initialBlocks: EmailBlock[];
  initialDesignConfig: GlobalEmailSettings;
  campaignId: string;
  deviceMode?: DeviceMode;
  onSave?: (blocks: EmailBlock[], designConfig: GlobalEmailSettings) => Promise<void>;
}

export function VisualBlockEditor({
  initialBlocks,
  initialDesignConfig,
  campaignId,
  deviceMode = 'desktop',
  onSave,
}: VisualBlockEditorProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);
  const [designConfig, setDesignConfig] = useState<GlobalEmailSettings>(initialDesignConfig);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [showAddBlockModal, setShowAddBlockModal] = useState<{
    position: number;
    type: 'above' | 'below';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Get selected block
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  // Debounced save
  useEffect(() => {
    if (saveStatus === 'saving') {
      const timer = setTimeout(async () => {
        if (onSave) {
          setIsSaving(true);
          setSaveError(null);
          try {
            await onSave(blocks, designConfig);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } catch (error) {
            console.error('Failed to save:', error);
            setSaveStatus('error');
            setSaveError(error instanceof Error ? error.message : 'Failed to save');
            setTimeout(() => {
              setSaveStatus('idle');
              setSaveError(null);
            }, 3000);
          } finally {
            setIsSaving(false);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [saveStatus, blocks, designConfig, onSave]);

  // Trigger save on changes
  const triggerSave = useCallback(() => {
    setSaveStatus('saving');
  }, []);

  // Update block
  const updateBlock = useCallback(
    (blockId: string, updates: Partial<EmailBlock>) => {
      setBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId ? { ...block, ...updates } : block
        )
      );
      triggerSave();
    },
    [triggerSave]
  );

  // Insert block
  const insertBlock = useCallback(
    (type: string, position: number) => {
      const newBlock = createDefaultBlock(type as any, position);
      
      setBlocks((prev) => {
        // Adjust positions of blocks at or after insertion point
        const updated = prev.map((block) =>
          block.position >= position
            ? { ...block, position: block.position + 1 }
            : block
        );
        return [...updated, newBlock].sort((a, b) => a.position - b.position);
      });
      
      setSelectedBlockId(newBlock.id);
      setShowAddBlockModal(null);
      triggerSave();
    },
    [triggerSave]
  );

  // Delete block
  const deleteBlock = useCallback(
    (blockId: string) => {
      const blockToDelete = blocks.find((b) => b.id === blockId);
      if (!blockToDelete) return;

      setBlocks((prev) => {
        const filtered = prev.filter((b) => b.id !== blockId);
        // Adjust positions after deletion
        return filtered.map((block) =>
          block.position > blockToDelete.position
            ? { ...block, position: block.position - 1 }
            : block
        );
      });
      
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
      triggerSave();
    },
    [blocks, selectedBlockId, triggerSave]
  );

  // Move block up
  const moveBlockUp = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block || block.position === 0) return;

      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id === blockId) {
            return { ...b, position: b.position - 1 };
          }
          if (b.position === block.position - 1) {
            return { ...b, position: b.position + 1 };
          }
          return b;
        })
      );
      triggerSave();
    },
    [blocks, triggerSave]
  );

  // Move block down
  const moveBlockDown = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (!block || block.position === blocks.length - 1) return;

      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id === blockId) {
            return { ...b, position: b.position + 1 };
          }
          if (b.position === block.position + 1) {
            return { ...b, position: b.position - 1 };
          }
          return b;
        })
      );
      triggerSave();
    },
    [blocks, triggerSave]
  );

  // Duplicate block
  const duplicateBlock = useCallback(
    (blockId: string) => {
      const blockToDupe = blocks.find((b) => b.id === blockId);
      if (!blockToDupe) return;

      const newBlock: EmailBlock = {
        ...blockToDupe,
        id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        position: blockToDupe.position + 1,
      };

      setBlocks((prev) => {
        // Adjust positions of blocks after the duplicated one
        const updated = prev.map((block) =>
          block.position > blockToDupe.position
            ? { ...block, position: block.position + 1 }
            : block
        );
        return [...updated, newBlock].sort((a, b) => a.position - b.position);
      });
      
      setSelectedBlockId(newBlock.id);
      triggerSave();
    },
    [blocks, triggerSave]
  );

  // Update design config
  const updateDesignConfig = useCallback(
    (updates: Partial<GlobalEmailSettings>) => {
      setDesignConfig((prev) => ({ ...prev, ...updates }));
      triggerSave();
    },
    [triggerSave]
  );

  return (
    <div className="flex h-full bg-[#f9fafb]">
      {/* Left: Settings Panel (35% width) */}
      <div className="flex-[0.35] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
        <BlockSettingsPanel
          selectedBlock={selectedBlock}
          designConfig={designConfig}
          onUpdateBlock={updateBlock}
          onUpdateDesignConfig={updateDesignConfig}
          campaignId={campaignId}
        />
        
        {/* Save Status */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className={`text-xs transition-colors duration-200 ${
            saveStatus === 'error' ? 'text-red-600' : 
            saveStatus === 'saved' ? 'text-green-600' : 
            'text-gray-500'
          }`}>
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}
            {saveStatus === 'saved' && '✅ All changes saved'}
            {saveStatus === 'error' && `❌ ${saveError || 'Failed to save'}`}
            {saveStatus === 'idle' && <span className="opacity-0">.</span>}
          </div>
        </div>
      </div>

      {/* Right: Canvas (65% width) */}
      <div className="flex-[0.65] overflow-hidden">
        <BlockCanvas
          blocks={blocks}
          designConfig={designConfig}
          selectedBlockId={selectedBlockId}
          hoveredBlockId={hoveredBlockId}
          deviceMode={deviceMode}
          onBlockSelect={setSelectedBlockId}
          onBlockHover={setHoveredBlockId}
          onAddBlockClick={(position, type) => setShowAddBlockModal({ position, type })}
          onMoveUp={moveBlockUp}
          onMoveDown={moveBlockDown}
          onDuplicate={duplicateBlock}
          onDelete={deleteBlock}
        />
      </div>

      {/* Add Block Modal */}
      {showAddBlockModal && (
        <BlockPaletteModal
          position={showAddBlockModal.type}
          onSelect={(blockType) => insertBlock(blockType, showAddBlockModal.position)}
          onClose={() => setShowAddBlockModal(null)}
        />
      )}
    </div>
  );
}

