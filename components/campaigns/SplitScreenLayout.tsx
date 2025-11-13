'use client';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isCollapsed?: boolean;
}

/**
 * SplitScreenLayout - Split view for chat/edit modes
 * 
 * Uses 35/65 flex ratio for left/right panels to provide more space for the editor
 * while maintaining a good balance for the preview.
 */
export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  isCollapsed = false,
}: SplitScreenLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Chat or Direct Editor (35% width) */}
      <div
        className={`flex-shrink-0 overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200 ${
          isCollapsed ? 'w-0 border-r-0' : 'flex-[0.35]'
        }`}
      >
        {leftPanel}
      </div>

      {/* Divider */}
      <div className="w-px h-full bg-gray-300 flex-shrink-0" />

      {/* Right Panel - Email Preview (65% width) */}
      <div className="flex-[0.65] overflow-hidden bg-gray-50">
        {rightPanel}
      </div>
    </div>
  );
}

