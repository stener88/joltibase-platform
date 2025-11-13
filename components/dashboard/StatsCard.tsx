import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, subtitle, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e8e7e5] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#f5f4ed] rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-[#e8e7e5]">
          <Icon className="w-6 h-6 text-[#3d3d3a]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#6b6b6b] mb-0.5">{title}</p>
          <p className="text-3xl font-bold text-[#3d3d3a]">{value}</p>
          {subtitle && (
            <p className="text-sm text-[#6b6b6b] mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

