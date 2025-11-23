'use client';

import { EmailBlock, GlobalEmailSettings, getBlockDisplayName } from '@/lib/email/blocks/types';
import { renderBlock } from '@/lib/email/blocks';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { SelectionOverlay } from './visual-edits/SelectionOverlay';
import type { ElementDescriptor } from '@/lib/email-v2/visual-edits/element-descriptor';

interface EmailFrameProps {
  blocks: EmailBlock[];
  deviceMode: 'desktop' | 'mobile';
  designConfig?: GlobalEmailSettings;
  className?: string;
  interactive?: boolean;
  onCanvasClick?: () => void;
  chatMode?: boolean;
  onBlockClick?: (blockId: string, blockType: string, blockName: string) => void;
  visualEditsMode?: boolean;
  selectedElement?: ElementDescriptor | null;
  onElementClick?: (element: HTMLElement) => void;
  currentGlobalSettings?: GlobalEmailSettings;
  onUpdateGlobalSettings?: (settings: Partial<GlobalEmailSettings>) => void;
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
  visualEditsMode = false,
  selectedElement = null,
  onElementClick,
  currentGlobalSettings,
  onUpdateGlobalSettings,
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
  
  // Email always renders at fixed 600px width (Option 2: Fixed/Shrink approach)
  const emailWidth = 600;
  
  // Calculate scale for mobile preview to simulate shrinking
  const scale = deviceMode === 'mobile' ? 0.625 : 1; // 375/600 = 0.625
  const containerWidth = deviceMode === 'desktop' ? emailWidth : 375;

  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);
  
  // Count blocks of each type for position info
  const blockTypeCounts = sortedBlocks.reduce((acc, block) => {
    acc[block.type] = (acc[block.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const getBlockReference = (block: EmailBlock): string => {
    const displayName = getBlockDisplayName(block);
    const count = blockTypeCounts[block.type] || 1;
    
    if (count > 1) {
      // Find position among blocks of same type
      const sameTypeBlocks = sortedBlocks.filter(b => b.type === block.type);
      const position = sameTypeBlocks.findIndex(b => b.id === block.id) + 1;
      return `the ${displayName.toLowerCase()} (position ${position})`;
    }
    return `the ${displayName.toLowerCase()}`;
  };
  
  const handleBlockClick = (e: React.MouseEvent<HTMLDivElement>, block: EmailBlock) => {
    e.stopPropagation();
    
    // Check if click is on nested interactive elements (links, buttons, images)
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.tagName === 'IMG' || target.closest('a, button')) {
      return; // Don't trigger block click if clicking on links/buttons/images
    }
    
    if (onBlockClick && chatMode) {
      const displayName = getBlockDisplayName(block);
      onBlockClick(block.id, block.type, displayName);
    }
  };

  const handleEmailContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Stop propagation to prevent canvas background click
    e.stopPropagation();
    
    // Call the normal canvas click handler
    if (onCanvasClick) {
      onCanvasClick();
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
          className="mx-auto"
          style={{
            width: containerWidth,
            overflow: 'hidden',
          }}
        >
          {/* Scaling wrapper for mobile view */}
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: emailWidth,
              marginLeft: deviceMode === 'mobile' ? `${(emailWidth - containerWidth) / -2}px` : '0',
            }}
          >
            {/* Email Container - ALWAYS 600px wide (Fixed/Shrink approach) */}
            <div
              data-email-frame
              className={`relative ${interactive ? 'cursor-default' : ''}`}
              style={{
                backgroundColor: config.contentBackgroundColor,
                fontFamily: config.fontFamily,
                width: emailWidth,
                minWidth: emailWidth,
              }}
              onClick={handleEmailContainerClick}
            >
            {/* Render blocks individually (same as BlockCanvas) */}
            {sortedBlocks.map((block) => {
              const isSpacer = block.type === 'spacer';
              const displayName = getBlockDisplayName(block);
              
              // Chat mode (not visual edits): render with tooltip
              if (chatMode && !visualEditsMode) {
                return (
                  <Tooltip key={block.id}>
                    <TooltipTrigger asChild>
                      <div
                        data-block-wrapper
                        data-block-id={block.id}
                        data-block-type={block.type}
                        onClick={(e) => handleBlockClick(e, block)}
                        className="relative hover:outline hover:outline-2 hover:outline-[#e9a589]/50 hover:outline-dashed outline-offset-[-2px] hover:shadow-md transition-all cursor-pointer"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderBlock(block, { globalSettings: config }),
                          }}
                          style={{
                            // Enable pointer events in visual edits mode or when interactive
                            pointerEvents: (interactive || visualEditsMode) ? 'auto' : 'none',
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Reference {displayName}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              // Visual edits mode: render with wrapper for block selection
              if (visualEditsMode) {
                return (
                  <div
                    key={block.id}
                    data-block-wrapper
                    data-block-id={block.id}
                    data-block-type={block.type}
                    className="relative"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderBlock(block, { globalSettings: config }),
                      }}
                      style={{
                        pointerEvents: 'auto',
                      }}
                    />
                  </div>
                );
              }
              
              // Default mode: render without wrapper
              return (
                <div
                  key={block.id}
                  className="hover:shadow-lg transition-shadow duration-200"
                  dangerouslySetInnerHTML={{
                    __html: renderBlock(block, { globalSettings: config }),
                  }}
                  style={{
                    // Enable pointer events in visual edits mode or when interactive
                    pointerEvents: (interactive || visualEditsMode) ? 'auto' : 'none',
                  }}
                />
              );
            })}
          </div>
          {/* End scaling wrapper */}
          </div>
        </div>
      </div>
      
      {/* Visual Edits Overlay */}
      {visualEditsMode && onElementClick && (
        <SelectionOverlay
          selectedElementId={selectedElement?.elementId || null}
          onElementClick={onElementClick}
        />
      )}
    </div>
  );
}

