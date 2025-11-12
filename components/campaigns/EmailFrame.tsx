'use client';

import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { renderBlock } from '@/lib/email/blocks/renderer';
import { getBlockDefinition } from '@/lib/email/blocks/registry';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface EmailFrameProps {
  blocks: EmailBlock[];
  deviceMode: 'desktop' | 'mobile';
  designConfig?: GlobalEmailSettings;
  className?: string;
  interactive?: boolean;
  onCanvasClick?: () => void;
  chatMode?: boolean;
  onBlockClick?: (blockId: string, blockType: string, blockName: string) => void;
}

/**
 * EmailFrame - Shared email canvas component
 * 
 * Provides consistent email preview frame across all editor modes.
 * Renders blocks individually (like Visual Editor) for exact consistency.
 */
export function EmailFrame({
  blocks,
  deviceMode,
  designConfig,
  className = '',
  interactive = false,
  onCanvasClick,
  chatMode = false,
  onBlockClick,
}: EmailFrameProps) {
  
  // Default design config if not provided
  const defaultConfig: GlobalEmailSettings = {
    backgroundColor: '#f3f4f6',
    contentBackgroundColor: '#ffffff',
    maxWidth: 600,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mobileBreakpoint: 480,
  };

  const config = designConfig || defaultConfig;
  
  // Determine email width based on device mode
  const emailWidth = deviceMode === 'desktop' ? config.maxWidth : 375;

  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  
  // Count blocks of each type for position info
  const blockTypeCounts = sortedBlocks.reduce((acc, block) => {
    acc[block.type] = (acc[block.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const getBlockReference = (block: EmailBlock): string => {
    const blockDef = getBlockDefinition(block.type);
    const count = blockTypeCounts[block.type] || 1;
    
    if (count > 1) {
      // Find position among blocks of same type
      const sameTypeBlocks = sortedBlocks.filter(b => b.type === block.type);
      const position = sameTypeBlocks.findIndex(b => b.id === block.id) + 1;
      return `the ${blockDef.name.toLowerCase()} block (position ${position})`;
    }
    return `the ${blockDef.name.toLowerCase()} block`;
  };
  
  const handleBlockClick = (e: React.MouseEvent<HTMLDivElement>, block: EmailBlock) => {
    e.stopPropagation();
    
    // Check if click is on nested interactive elements (links, buttons, images)
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.tagName === 'IMG' || target.closest('a, button')) {
      return; // Don't trigger block click if clicking on links/buttons/images
    }
    
    if (onBlockClick && chatMode) {
      const blockDef = getBlockDefinition(block.type);
      onBlockClick(block.id, block.type, blockDef.name);
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Canvas with background color from design config */}
      <div 
        className="flex-1 overflow-y-auto p-8"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div
          className="mx-auto transition-all duration-300"
          style={{
            width: emailWidth,
            maxWidth: '100%',
          }}
        >
          {/* Email Container - renders blocks directly like Visual Editor */}
          <div
            className={`relative ${interactive ? 'cursor-default' : ''}`}
            style={{
              backgroundColor: config.contentBackgroundColor,
              fontFamily: config.fontFamily,
            }}
            onClick={onCanvasClick}
          >
            {/* Render blocks individually (same as BlockCanvas) */}
            {sortedBlocks.map((block) => {
              const blockDef = getBlockDefinition(block.type);
              const isSpacer = block.type === 'spacer';
              
              if (chatMode) {
                return (
                  <Tooltip key={block.id}>
                    <TooltipTrigger asChild>
                      <div
                        data-block-wrapper
                        data-block-id={block.id}
                        data-block-type={block.type}
                        onClick={(e) => handleBlockClick(e, block)}
                        className={`relative transition-all ${
                          isSpacer
                            ? 'border border-gray-300 border-dashed min-h-[20px]'
                            : 'hover:border-2 hover:border-blue-200 hover:border-dashed'
                        } cursor-pointer`}
                        style={{
                          // Show spacer blocks in chat mode
                          ...(isSpacer && chatMode ? {
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            minHeight: '20px',
                          } : {}),
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderBlock(block, { globalSettings: config }),
                          }}
                          style={{
                            // Disable link clicks in preview
                            pointerEvents: interactive ? 'auto' : 'none',
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Reference {blockDef.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              // Non-chat mode: render as before
              return (
                <div
                  key={block.id}
                  dangerouslySetInnerHTML={{
                    __html: renderBlock(block, { globalSettings: config }),
                  }}
                  style={{
                    // Disable link clicks in preview
                    pointerEvents: interactive ? 'auto' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

