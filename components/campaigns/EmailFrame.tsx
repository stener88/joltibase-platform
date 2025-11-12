'use client';

import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';
import { renderBlock } from '@/lib/email/blocks/renderer';

interface EmailFrameProps {
  blocks: EmailBlock[];
  deviceMode: 'desktop' | 'mobile';
  designConfig?: GlobalEmailSettings;
  className?: string;
  interactive?: boolean;
  onCanvasClick?: () => void;
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

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Canvas with gray background (matches visual editor) */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
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
            {sortedBlocks.map((block) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

