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
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel */}
      <div
        className={`flex-shrink-0 overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200 ${
          isCollapsed ? 'w-0 border-r-0' : ''
        }`}
        style={!isCollapsed ? { width: `${leftWidth}%` } : {}}
      >
        {leftPanel}
      </div>

      {/* Divider */}
      <div className="w-px h-full bg-gray-300 flex-shrink-0" />

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
        {rightPanel}
      </div>
    </div>
  );
}

