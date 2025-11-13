'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import type { GlobalEmailSettings } from '@/lib/email/blocks/types';

const DEFAULT_DESIGN_CONFIG: GlobalEmailSettings = {
  backgroundColor: '#f3f4f6',
  contentBackgroundColor: '#ffffff',
  maxWidth: 600,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mobileBreakpoint: 480,
};

export default function NewCampaignPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createCampaign = async () => {
      try {
        // Get user email
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user?.email) {
          throw new Error('Please sign in to create a campaign');
        }

        // Generate campaign name
        const timestamp = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const campaignName = `Untitled Campaign - ${timestamp}`;
        const fromName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);

        // Create campaign with empty blocks and default design config
        const response = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: campaignName,
            type: 'one-time',
            from_name: fromName,
            from_email: user.email,
            blocks: [],
            design_config: DEFAULT_DESIGN_CONFIG,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create campaign');
        }

        // Redirect to edit page with visual mode
        router.push(`/dashboard/campaigns/${result.data.id}/edit?mode=visual`);
      } catch (err: any) {
        console.error('Failed to create campaign:', err);
        setError(err.message || 'Failed to create campaign');
        setIsCreating(false);
      }
    };

    createCampaign();
  }, [router]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Create Campaign</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard/campaigns')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your campaign...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
