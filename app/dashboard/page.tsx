'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Users, Mail, MailOpen, MousePointerClick, Plus, Upload, Reply } from 'lucide-react';

interface DashboardStats {
  totalContacts: number;
  subscribedContacts: number;
  totalCampaigns: number;
  activeCampaigns: number;
}

interface RecentActivity {
  id: string;
  type: 'contact' | 'campaign';
  description: string;
  timestamp: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    subscribedContacts: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push('/');
          return;
        }
        
        setUser(user);

        // Fetch contacts stats
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('status')
          .eq('user_id', user.id);

        if (!contactsError && contacts) {
          const subscribedCount = contacts.filter(c => c.status === 'subscribed').length;
          setStats(prev => ({
            ...prev,
            totalContacts: contacts.length,
            subscribedContacts: subscribedCount,
          }));
        }

        // Fetch campaigns stats
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('status')
          .eq('user_id', user.id);

        if (!campaignsError && campaigns) {
          const activeCount = campaigns.filter(c => 
            c.status === 'draft' || c.status === 'scheduled' || c.status === 'sending'
          ).length;
          setStats(prev => ({
            ...prev,
            totalCampaigns: campaigns.length,
            activeCampaigns: activeCount,
          }));
        }

        // Fetch recent activity (last 5 contacts and campaigns)
        const { data: recentContacts } = await supabase
          .from('contacts')
          .select('id, email, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        const { data: recentCampaigns } = await supabase
          .from('campaigns')
          .select('id, name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        const activity: RecentActivity[] = [];
        
        if (recentContacts) {
          recentContacts.forEach(contact => {
            activity.push({
              id: contact.id,
              type: 'contact',
              description: `Added contact: ${contact.email}`,
              timestamp: new Date(contact.created_at),
            });
          });
        }

        if (recentCampaigns) {
          recentCampaigns.forEach(campaign => {
            activity.push({
              id: campaign.id,
              type: 'campaign',
              description: `Created campaign: ${campaign.name}`,
              timestamp: new Date(campaign.created_at),
            });
          });
        }

        // Sort by timestamp
        activity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setRecentActivity(activity.slice(0, 5));

      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
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
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={Users}
            subtitle={`${stats.subscribedContacts} subscribed`}
          />
          <StatsCard
            title="Campaigns"
            value={stats.totalCampaigns}
            icon={Mail}
            subtitle={`${stats.activeCampaigns} active`}
          />
          <StatsCard
            title="Reply Rate"
            value="0%"
            icon={Reply}
            subtitle="Coming soon"
          />
          <StatsCard
            title="Open Rate"
            value="0%"
            icon={MailOpen}
            subtitle="Coming soon"
          />
          <StatsCard
            title="Click Rate"
            value="0%"
            icon={MousePointerClick}
            subtitle="Coming soon"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <DashboardCard title="Quick Actions">
            <div className="space-y-2">
              <button
                onClick={() => router.push('/dashboard/campaigns/generate')}
                className="group w-full flex items-center gap-3 p-3 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors"
              >
                <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Create Campaign</div>
                  <div className="text-sm font-normal text-muted-foreground">Start a new email campaign with AI</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/contacts/new')}
                className="group w-full flex items-center gap-3 p-3 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors"
              >
                <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Add Contact</div>
                  <div className="text-sm font-normal text-muted-foreground">Manually add a new contact</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/contacts/import')}
                className="group w-full flex items-center gap-3 p-3 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors"
              >
                <Upload className="w-4 h-4 text-muted-foreground transition-colors" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Import Contacts</div>
                  <div className="text-sm font-normal text-muted-foreground">Upload contacts from CSV</div>
                </div>
              </button>
            </div>
          </DashboardCard>

          {/* Recent Activity */}
          <DashboardCard 
            title="Recent Activity"
            action={{
              label: 'View all',
              onClick: () => router.push('/dashboard/contacts'),
            }}
          >
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
                <p className="text-sm mt-2">Start by creating a campaign or adding contacts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center shrink-0">
                      {activity.type === 'contact' ? (
                        <Users className="w-4 h-4 text-black" />
                      ) : (
                        <Mail className="w-4 h-4 text-black" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
