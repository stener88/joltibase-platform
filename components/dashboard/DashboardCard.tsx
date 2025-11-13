interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardCard({ title, children, action }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e8e7e5] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#e8e7e5] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#3d3d3a]">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="px-3 py-1.5 text-sm font-semibold text-[#3d3d3a] bg-transparent border border-[#e8e7e5] rounded-lg hover:bg-[#e9a589] hover:text-white hover:border-[#e9a589] transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

