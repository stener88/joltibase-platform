'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricCard } from '@/components/analytics/MetricCard';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { TopCampaignsChart } from '@/components/analytics/TopCampaignsChart';
import { CampaignsTable } from '@/components/analytics/CampaignsTable';
import { ContactsTable } from '@/components/analytics/ContactsTable';
import { GrowthChart } from '@/components/analytics/GrowthChart';
import { EngagementDistributionChart } from '@/components/analytics/EngagementDistributionChart';
import { LiveActivityFeed } from '@/components/analytics/LiveActivityFeed';
import { SendingProgress } from '@/components/analytics/SendingProgress';
import { ExportButton } from '@/components/analytics/ExportButton';
import { Mail, Eye, MousePointerClick, XCircle, RefreshCw, Users, TrendingUp, UserPlus, UserMinus, Download } from 'lucide-react';

interface OverviewData {
  overview: {
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalBounced: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    deliveryRate: number;
    campaignCount: number;
  };
  timeSeries: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    bounced: number;
    openRate: number;
    clickRate: number;
  }>;
  topCampaigns: any[];
  worstCampaigns: any[];
}

export default function AnalyticsPage() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [sortBy, setSortBy] = useState('sent_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, dateRange]);

  const loadAnalytics = async () => {
    try {
      // Fetch overview data
      const overviewResponse = await fetch(`/api/analytics/overview?days=${dateRange}`);
      const overviewResult = await overviewResponse.json();
      
      if (overviewResult.success) {
        setOverviewData(overviewResult.data);
      }

      // Fetch campaigns data
      const campaignsResponse = await fetch(
        `/api/analytics/campaigns?days=${dateRange}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      const campaignsResult = await campaignsResponse.json();
      
      if (campaignsResult.success) {
        setCampaigns(campaignsResult.data);
      }

      // Fetch contact analytics
      const contactsResponse = await fetch('/api/analytics/contacts');
      const contactsResult = await contactsResponse.json();
      
      if (contactsResult.success) {
        setContactData(contactsResult.data);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadAnalytics();
    }
  }, [sortBy, sortOrder]);

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-end gap-3 flex-wrap">
              {/* Export Buttons */}
              <ExportButton
                label="Export Campaigns"
                endpoint={`/api/analytics/export?days=${dateRange}`}
                filename={`campaigns-export-${new Date().toISOString().split('T')[0]}.csv`}
              />
              <ExportButton
                label="Export Contacts"
                endpoint="/api/analytics/contacts/export"
                filename={`contacts-export-${new Date().toISOString().split('T')[0]}.csv`}
              />

              {/* Auto-refresh toggle */}
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                Auto-refresh
              </label>

              {/* Manual refresh */}
              <button
                onClick={loadAnalytics}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Date range selector */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-foreground"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              {/* Last updated */}
              <p className="text-xs text-gray-500">Last updated: {getTimeSinceUpdate()}</p>
          </div>
        </div>

        {isLoading && !overviewData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-foreground mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : overviewData ? (
          <>
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Sent"
                value={overviewData.overview.totalSent}
                icon={Mail}
              />
              <MetricCard
                title="Open Rate"
                value={overviewData.overview.openRate.toFixed(1)}
                suffix="%"
                icon={Eye}
              />
              <MetricCard
                title="Click Rate"
                value={overviewData.overview.clickRate.toFixed(1)}
                suffix="%"
                icon={MousePointerClick}
              />
              <MetricCard
                title="Bounce Rate"
                value={overviewData.overview.bounceRate.toFixed(1)}
                suffix="%"
                icon={XCircle}
              />
            </div>

            {/* Performance Chart */}
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Over Time
              </h2>
              <PerformanceChart data={overviewData.timeSeries} height={350} />
            </div>

            {/* Top Campaigns */}
            {overviewData.topCampaigns.length > 0 && (
              <div className="bg-card rounded-lg border border-border p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Campaigns
                </h2>
                <TopCampaignsChart data={overviewData.topCampaigns} height={300} />
              </div>
            )}

            {/* All Campaigns Table */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All Campaigns ({campaigns.length})
              </h2>
              <CampaignsTable
                campaigns={campaigns}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            </div>

            {/* Contact Insights Section */}
            {contactData && (
              <>
                <div className="mb-6 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Insights</h2>
                  <p className="text-gray-600">Subscriber growth and engagement analysis</p>
                </div>

                {/* Contact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    title="Total Contacts"
                    value={contactData.summary.totalContacts}
                    icon={Users}
                  />
                  <MetricCard
                    title="Active Contacts"
                    value={contactData.summary.activePercentage.toFixed(1)}
                    suffix="%"
                    icon={TrendingUp}
                  />
                  <MetricCard
                    title="New This Month"
                    value={contactData.summary.newThisMonth}
                    icon={UserPlus}
                  />
                  <MetricCard
                    title="Churned This Month"
                    value={contactData.summary.churnedThisMonth}
                    icon={UserMinus}
                  />
                </div>

                {/* Growth Chart */}
                <div className="bg-card rounded-lg border border-border p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subscriber Growth (Last 90 Days)
                  </h3>
                  <GrowthChart data={contactData.growthTrend} height={350} />
                </div>

                {/* Engagement Distribution */}
                <div className="bg-card rounded-lg border border-border p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Engagement Score Distribution
                  </h3>
                  <EngagementDistributionChart data={contactData.engagementDistribution} />
                </div>

                {/* Most Engaged & At-Risk Contacts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ContactsTable
                    contacts={contactData.mostEngaged.slice(0, 10)}
                    title="Most Engaged Contacts"
                    emptyMessage="No engaged contacts yet"
                  />
                  <ContactsTable
                    contacts={contactData.inactiveContacts.slice(0, 10)}
                    title="At-Risk Contacts (Inactive)"
                    emptyMessage="No inactive contacts"
                  />
                </div>
              </>
            )}

            {/* Real-Time Analytics Section */}
            <div className="mb-6 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Activity</h2>
              <p className="text-gray-600">Live monitoring of email events and campaign progress</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SendingProgress pollingInterval={10000} />
              <LiveActivityFeed pollingInterval={10000} />
            </div>
          </>
        ) : (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              Start sending campaigns to see analytics data
            </p>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}
