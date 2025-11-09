'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formattedData = data.map(item => ({
    ...item,
    dateDisplay: formatDate(item.date),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="dateDisplay" 
            tick={{ fontSize: 12 }}
            stroke="#999"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#999"
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: any) => [`${value.toFixed(1)}%`, '']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="openRate" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Open Rate"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="clickRate" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Click Rate"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

