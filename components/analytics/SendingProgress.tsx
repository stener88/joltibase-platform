'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface SendingCampaign {
  id: string;
  name: string;
  queued: number;
  sent: number;
  total: number;
}

interface SendingProgressProps {
  pollingInterval?: number; // in milliseconds
}

export function SendingProgress({ pollingInterval = 10000 }: SendingProgressProps) {
  const [campaigns, setCampaigns] = useState<SendingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaigns = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data.sendingCampaigns || []);
      }
    } catch (error) {
      console.error('Failed to load sending campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadCampaigns();

    // Set up polling interval
    const interval = setInterval(loadCampaigns, pollingInterval);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  const calculateProgress = (campaign: SendingCampaign) => {
    if (campaign.total === 0) return 0;
    return (campaign.sent / campaign.total) * 100;
  };

  const estimateTimeRemaining = (campaign: SendingCampaign) => {
    if (campaign.queued === 0) return 'Complete';
    // Rough estimate: ~100 emails per minute (Resend rate limiting)
    const minutesRemaining = Math.ceil(campaign.queued / 100);
    if (minutesRemaining < 2) return '< 2 min';
    if (minutesRemaining < 60) return `~${minutesRemaining} min`;
    const hoursRemaining = Math.ceil(minutesRemaining / 60);
    return `~${hoursRemaining}h`;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sending Progress</h3>
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Sending Progress</h3>
        <div className="text-center py-8 text-muted-foreground">
          No campaigns currently sending
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Sending Progress</h3>
        <span className="text-xs text-muted-foreground">
          {campaigns.length} active
        </span>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const progress = calculateProgress(campaign);
          const timeRemaining = estimateTimeRemaining(campaign);

          return (
            <div key={campaign.id} className="p-4 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Send className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {campaign.name}
                  </h4>
                </div>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {timeRemaining}
                </span>
              </div>

              <div className="mb-2">
                <div className="w-full bg-muted-foreground/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {campaign.sent.toLocaleString()} / {campaign.total.toLocaleString()} sent
                </span>
                <span>{progress.toFixed(1)}%</span>
              </div>

              {campaign.queued > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {campaign.queued.toLocaleString()} queued
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

