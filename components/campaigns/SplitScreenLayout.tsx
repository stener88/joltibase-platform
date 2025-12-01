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
    // Outer container with minimal padding
    <div className="h-full w-full p-3">
      {/* Unified card with rounded edges - no border */}
      <div className="flex h-full w-full overflow-hidden rounded-xl bg-card shadow-lg">
        {/* Left Panel - Chat or Direct Editor (30% width) */}
        <div
          className={`flex-shrink-0 overflow-y-auto overflow-x-hidden bg-background rounded-l-xl ${
            isCollapsed ? 'w-0' : 'flex-[0.30]'
          }`}
        >
          {leftPanel}
        </div>

        {/* Right Panel - Email Preview (70% width) */}
        <div className="flex-[0.70] overflow-hidden bg-background rounded-r-xl">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}

