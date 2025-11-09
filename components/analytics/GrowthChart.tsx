'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Sample data to reduce chart complexity (show every 3rd day for 90 days)
  const sampledData = data.filter((_, index) => index % 3 === 0).map(item => ({
    ...item,
    dateDisplay: formatDate(item.date),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="dateDisplay" 
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
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
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Total Subscribers"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="subscribes" 
            stroke="#10b981" 
            strokeWidth={2}
            name="New"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="unsubscribes" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Unsubscribed"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

