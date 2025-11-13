'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopCampaignsChartProps {
  data: Array<{
    name: string;
    engagement_score: number;
    stats?: any;
  }>;
  height?: number;
}

export function TopCampaignsChart({ data, height = 300 }: TopCampaignsChartProps) {
  // Prepare data for chart
  const chartData = data.map(campaign => ({
    name: campaign.name.length > 30 ? campaign.name.substring(0, 30) + '...' : campaign.name,
    fullName: campaign.name,
    score: Math.round(campaign.engagement_score),
    sent: campaign.stats?.sent || 0,
  }));

  // Colors for bars
  const colors = ['#ea7a76', '#e9a589', '#e9a589', '#fcd093'];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            tick={{ fontSize: 12 }}
            stroke="#999"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            tick={{ fontSize: 12 }}
            stroke="#999"
            width={150}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: any, name: any, props: any) => {
              return [
                <>
                  <div><strong>{props.payload.fullName}</strong></div>
                  <div>Engagement: {value}%</div>
                  <div>Sent: {props.payload.sent.toLocaleString()}</div>
                </>,
                ''
              ];
            }}
            labelFormatter={() => ''}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

