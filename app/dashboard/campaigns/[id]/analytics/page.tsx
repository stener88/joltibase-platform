'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CampaignStatusBadge } from '@/components/campaigns/CampaignStatusBadge';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Mail, Eye, MousePointerClick, XCircle, TrendingUp, Users, Edit3 } from 'lucide-react';
import type { Campaign } from '@/lib/types/campaign';
import { format } from 'date-fns';

export default function CampaignAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      const response = await fetch(`/api/v3/campaigns/${campaignId}`);
      const result = await response.json();
      if (result.success) {
        setCampaign(result.campaign);
      }
    } catch (error) {
      console.error('Failed to load campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center py-12">
            <svg
              className="animate-spin h-12 w-12 text-foreground mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-muted-foreground">Loading campaign...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Campaign not found</h2>
            <button
              onClick={() => router.push('/dashboard/campaigns')}
              className="text-primary hover:text-primary/80"
            >
              Back to campaigns
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = campaign.stats || { sent: 0, opened: 0, clicked: 0, bounced: 0, delivered: 0 };
  const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : '0';
  const clickRate = stats.sent > 0 ? ((stats.clicked / stats.sent) * 100).toFixed(1) : '0';
  const bounceRate = stats.sent > 0 ? ((stats.bounced / stats.sent) * 100).toFixed(1) : '0';
  const deliveryRate = stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(1) : '0';

  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
                <CampaignStatusBadge status={campaign.status} />
              </div>
              <p className="text-muted-foreground">
                {campaign.sent_at
                  ? `Sent ${format(new Date(campaign.sent_at), 'MMM dd, yyyy \'at\' HH:mm')}`
                  : campaign.scheduled_at
                  ? `Scheduled for ${format(new Date(campaign.scheduled_at), 'MMM dd, yyyy \'at\' HH:mm')}`
                  : 'Draft'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/dashboard/campaigns/${campaignId}/edit`)}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Edit3 className="w-4 h-4 text-muted-foreground transition-colors" />
                Edit Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Sent"
            value={stats.sent.toLocaleString()}
            icon={Mail}
          />
          <StatsCard
            title="Open Rate"
            value={`${openRate}%`}
            icon={Eye}
            subtitle={`${stats.opened} opens`}
          />
          <StatsCard
            title="Click Rate"
            value={`${clickRate}%`}
            icon={MousePointerClick}
            subtitle={`${stats.clicked} clicks`}
          />
          <StatsCard
            title="Bounce Rate"
            value={`${bounceRate}%`}
            icon={XCircle}
            subtitle={`${stats.bounced} bounces`}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${deliveryRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{deliveryRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Open Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${openRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{openRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Click Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${clickRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{clickRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Subject Line:</dt>
                <dd className="font-medium text-gray-900 text-right max-w-xs truncate">{campaign.subject_line}</dd>
              </div>
              {campaign.from_name && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">From:</dt>
                  <dd className="font-medium text-gray-900">{campaign.from_name}</dd>
                </div>
              )}
              {campaign.from_email && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">From Email:</dt>
                  <dd className="font-medium text-gray-900">{campaign.from_email}</dd>
                </div>
              )}
              {campaign.type && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Type:</dt>
                  <dd className="font-medium text-gray-900 capitalize">{campaign.type.replace('-', ' ')}</dd>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Created:</dt>
                <dd className="font-medium text-gray-900">{format(new Date(campaign.created_at), 'MMM dd, yyyy')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Email Content Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Content</h3>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Subject:</p>
            <p className="font-medium text-gray-900 mb-4">{campaign.subject_line}</p>
            {campaign.preview_text && (
              <>
                <p className="text-sm text-gray-600 mb-2">Preview Text:</p>
                <p className="text-sm text-gray-700 mb-4">{campaign.preview_text}</p>
              </>
            )}
            <p className="text-sm text-gray-600 mb-2">Content:</p>
            {/* HTML is architecturally safe - generated from validated TSX via React Email */}
            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{ 
                __html: campaign.html_content || 'No content'
              }}
            />
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

