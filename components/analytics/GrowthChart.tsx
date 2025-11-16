'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  CHART_TOOLTIP_STYLE, 
  CHART_GRID_PROPS, 
  CHART_AXIS_STYLE, 
  formatChartDate,
  sampleChartData 
} from './chart-config';

interface GrowthChartProps {
  data: Array<{
    date: string;
    subscribes: number;
    unsubscribes: number;
    net: number;
    total: number;
  }>;
  height?: number;
}

export function GrowthChart({ data, height = 300 }: GrowthChartProps) {
  // Sample data to reduce chart complexity (show every 3rd day for 90 days)
  const sampledData = sampleChartData(data, 3).map(item => ({
    ...item,
    dateDisplay: formatChartDate(item.date),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid {...CHART_GRID_PROPS} />
          <XAxis 
            dataKey="dateDisplay" 
            {...CHART_AXIS_STYLE}
          />
          <YAxis {...CHART_AXIS_STYLE} />
          <Tooltip 
            contentStyle={CHART_TOOLTIP_STYLE}
            formatter={(value: any, name: string) => {
              const labels: Record<string, string> = {
                total: 'Total Subscribers',
                subscribes: 'New',
                unsubscribes: 'Unsubscribed',
                net: 'Net Growth',
              };
              return [value.toLocaleString(), labels[name] || name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#e9a589" 
            strokeWidth={2}
            name="Total Subscribers"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="subscribes" 
            stroke="#e9a589" 
            strokeWidth={2}
            name="New"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="unsubscribes" 
            stroke="#ea7a76" 
            strokeWidth={2}
            name="Unsubscribed"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

