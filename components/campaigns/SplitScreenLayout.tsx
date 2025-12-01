'use client';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isCollapsed?: boolean;
}

/**
 * SplitScreenLayout - Split view for chat/edit modes
 * 
 * Uses 30/70 flex ratio for left/right panels to provide more space for the preview
 * while maintaining a good balance for the chat interface.
 */
export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  isCollapsed = false,
}: SplitScreenLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Chat or Direct Editor (30% width) */}
      <div
        className={`flex-shrink-0 overflow-y-auto overflow-x-hidden bg-background border-r border-border ${
          isCollapsed ? 'w-0 border-r-0' : 'flex-[0.30]'
        }`}
      >
        {leftPanel}
      </div>

      {/* Right Panel - Email Preview (70% width) */}
      <div className="flex-[0.70] overflow-hidden bg-background">
        {rightPanel}
      </div>
    </div>
  );
}

