'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  sent_at: string | null;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    engagementScore: number;
  };
}

interface CampaignsTableProps {
  campaigns: Campaign[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

export function CampaignsTable({ campaigns, sortBy, sortOrder, onSort }: CampaignsTableProps) {
  const router = useRouter();

  const SortButton = ({ column, label }: { column: string; label: string }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-4 h-4 ${sortBy === column ? 'text-primary' : 'text-muted-foreground'}`} />
    </button>
  );

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="name" label="Campaign" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="sent_at" label="Sent Date" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="sent" label="Sent" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="openRate" label="Open Rate" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="clickRate" label="Click Rate" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton column="engagement" label="Engagement" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/analytics`)}
                  className="hover:bg-muted cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.sent_at 
                      ? format(new Date(campaign.sent_at), 'MMM dd, yyyy')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {campaign.metrics.sent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {campaign.metrics.openRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {campaign.metrics.clickRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.metrics.engagementScore >= 30
                        ? 'bg-green-100 text-green-800'
                        : campaign.metrics.engagementScore >= 15
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.metrics.engagementScore.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

