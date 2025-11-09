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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-[#1a1aff] hover:text-[#0000cc] font-medium"
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

