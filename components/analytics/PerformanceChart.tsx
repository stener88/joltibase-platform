'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  CHART_TOOLTIP_STYLE, 
  CHART_GRID_PROPS, 
  CHART_AXIS_STYLE,
  formatChartDate 
} from './chart-config';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    openRate?: number;
    clickRate?: number;
    [key: string]: any;
  }>;
  height?: number;
}

export function PerformanceChart({ data, height = 300 }: PerformanceChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    dateDisplay: formatChartDate(item.date),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...CHART_GRID_PROPS} />
          <XAxis 
            dataKey="dateDisplay" 
            {...CHART_AXIS_STYLE}
          />
          <YAxis 
            {...CHART_AXIS_STYLE}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(value: any) => [`${value.toFixed(1)}%`, '']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="openRate" 
            stroke="#5f6ad1" 
            strokeWidth={2}
            name="Open Rate"
            dot={{ fill: '#5f6ad1', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="clickRate" 
            stroke="#9ca3af" 
            strokeWidth={2}
            name="Click Rate"
            dot={{ fill: '#9ca3af', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

