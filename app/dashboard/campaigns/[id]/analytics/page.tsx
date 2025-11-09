'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CampaignStatusBadge } from '@/components/campaigns/CampaignStatusBadge';
import { ArrowLeft, Mail, Eye, MousePointerClick, XCircle, TrendingUp, Users, Edit3 } from 'lucide-react';
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
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const result = await response.json();
      if (result.success) {
        setCampaign(result.data);
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
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
            <p className="text-gray-600">Loading campaign...</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign not found</h2>
            <button
              onClick={() => router.push('/dashboard/campaigns')}
              className="text-[#1a1aff] hover:text-[#0000cc]"
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/campaigns')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <CampaignStatusBadge status={campaign.status} />
              </div>
              <p className="text-gray-600">
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
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Sent</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.sent.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Open Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{openRate}%</p>
            <p className="text-sm text-gray-500 mt-1">{stats.opened} opens</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{clickRate}%</p>
            <p className="text-sm text-gray-500 mt-1">{stats.clicked} clicks</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{bounceRate}%</p>
            <p className="text-sm text-gray-500 mt-1">{stats.bounced} bounces</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${deliveryRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{deliveryRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Open Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${openRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{openRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${clickRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{clickRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Subject Line:</dt>
                <dd className="font-medium text-gray-900 text-right max-w-xs truncate">{campaign.subject_line}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">From:</dt>
                <dd className="font-medium text-gray-900">{campaign.from_name}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">From Email:</dt>
                <dd className="font-medium text-gray-900">{campaign.from_email}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Type:</dt>
                <dd className="font-medium text-gray-900 capitalize">{campaign.type.replace('-', ' ')}</dd>
              </div>
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
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Subject:</p>
            <p className="font-medium text-gray-900 mb-4">{campaign.subject_line}</p>
            {campaign.preview_text && (
              <>
                <p className="text-sm text-gray-600 mb-2">Preview Text:</p>
                <p className="text-sm text-gray-700 mb-4">{campaign.preview_text}</p>
              </>
            )}
            <p className="text-sm text-gray-600 mb-2">Content:</p>
            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: campaign.html_content || 'No content' }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

