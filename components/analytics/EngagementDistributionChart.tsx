'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_TOOLTIP_STYLE, CHART_GRID_PROPS, CHART_AXIS_STYLE } from './chart-config';

interface EngagementDistributionChartProps {
  data: Array<{
    label: string;
    count: number;
  }>;
  height?: number;
}

export function EngagementDistributionChart({ data, height = 250 }: EngagementDistributionChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...CHART_GRID_PROPS} />
          <XAxis 
            dataKey="label" 
            {...CHART_AXIS_STYLE}
            label={{ value: 'Engagement Score', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            {...CHART_AXIS_STYLE}
            label={{ value: 'Contacts', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(value: any) => [value.toLocaleString(), 'Contacts']}
          />
          <Bar dataKey="count" fill="#e9a589" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

