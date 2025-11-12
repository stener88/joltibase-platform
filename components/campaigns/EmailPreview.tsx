'use client';

import { EmailFrame } from './EmailFrame';
import { EmailBlock, GlobalEmailSettings } from '@/lib/email/blocks/types';

export type DeviceMode = 'desktop' | 'mobile';
export type ViewMode = 'html' | 'text';

interface EmailPreviewProps {
  blocks: EmailBlock[];
  designConfig: GlobalEmailSettings;
  plainText?: string;
  subject?: string;
  deviceMode?: DeviceMode;
  viewMode?: ViewMode;
  onDeviceModeChange?: (mode: DeviceMode) => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

/**
 * EmailPreview - Preview component for chat and edit modes
 * 
 * Now uses the shared EmailFrame component for consistent styling
 * across all editor modes. Renders blocks directly for exact match
 * with Visual Editor (no wrapper padding).
 */
export function EmailPreview({
  blocks,
  designConfig,
  plainText = '',
  subject,
  deviceMode = 'desktop',
  viewMode = 'html',
  onDeviceModeChange,
  onViewModeChange,
}: EmailPreviewProps) {
  return (
    <div className="flex flex-col h-full">
      {viewMode === 'html' ? (
        <EmailFrame
          blocks={blocks}
          designConfig={designConfig}
          deviceMode={deviceMode}
          interactive={false}
        />
      ) : (
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {plainText || 'No plain text version available'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
