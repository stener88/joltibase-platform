'use client';

interface SplitScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  isCollapsed?: boolean;
  defaultLeftWidth?: number; // percentage (0-100), fixed width
}

export function SplitScreenLayout({
  leftPanel,
  rightPanel,
  isCollapsed = false,
  defaultLeftWidth = 30,
}: SplitScreenLayoutProps) {
  const leftWidth = defaultLeftWidth; // Fixed width, not draggable

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Left Panel */}
      <div
        className={`flex-shrink-0 overflow-auto bg-white border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? 'w-0 border-r-0' : ''
        }`}
        style={!isCollapsed ? { width: `${leftWidth}%` } : {}}
      >
        <div className={isCollapsed ? 'hidden' : 'h-full'}>
          {leftPanel}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-full bg-gray-300 flex-shrink-0" />

      {/* Right Panel */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {rightPanel}
      </div>
    </div>
  );
}

