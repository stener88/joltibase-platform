import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  suffix?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  suffix = '',
  iconColor = 'text-[#3d3d3a]',
  iconBgColor = 'bg-[#f5f4ed]'
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-lg border border-[#e8e7e5] p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-[#e8e7e5]`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#6b6b6b] mb-0.5">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#3d3d3a]">
              {formatValue(value)}{suffix}
            </p>
            
            {change !== undefined && (
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

