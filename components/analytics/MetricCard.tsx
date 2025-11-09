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
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-50'
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">
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
  );
}

