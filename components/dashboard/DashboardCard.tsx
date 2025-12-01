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
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="px-3 py-1.5 text-sm font-semibold text-foreground bg-transparent border border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors"
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

