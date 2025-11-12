'use client';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isCollapsed?: boolean;
}

/**
 * SplitScreenLayout - Split view for chat/edit modes
 * 
 * Uses fixed 384px left panel to match visual editor's settings panel width.
 * This creates consistent proportions across all three editor modes.
 */
export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  isCollapsed = false,
}: SplitScreenLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Chat or Direct Editor (384px to match visual editor) */}
      <div
        className={`flex-shrink-0 overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200 ${
          isCollapsed ? 'w-0 border-r-0' : 'w-96'
        }`}
      >
        {leftPanel}
      </div>

      {/* Divider */}
      <div className="w-px h-full bg-gray-300 flex-shrink-0" />

      {/* Right Panel - Email Preview (flex-1 to match visual editor canvas) */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {rightPanel}
      </div>
    </div>
  );
}

