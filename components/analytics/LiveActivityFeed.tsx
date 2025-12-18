'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, MousePointerClick, XCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityEvent {
  type: 'opened' | 'clicked' | 'bounced' | 'delivered';
  timestamp: string;
  contact_name: string;
  campaign_name: string;
}

interface LiveActivityFeedProps {
  pollingInterval?: number; // in milliseconds
}

export function LiveActivityFeed({ pollingInterval = 10000 }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/analytics/realtime');
      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to load activity feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadEvents();

    // Set up polling interval
    const interval = setInterval(loadEvents, pollingInterval);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'opened':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'clicked':
        return <MousePointerClick className="w-4 h-4 text-purple-600" />;
      case 'bounced':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'opened':
        return 'opened';
      case 'clicked':
        return 'clicked';
      case 'bounced':
        return 'bounced';
      case 'delivered':
        return 'delivered';
      default:
        return type;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'opened':
        return 'bg-green-50 border-green-200';
      case 'clicked':
        return 'bg-purple-50 border-purple-200';
      case 'bounced':
        return 'bg-red-50 border-red-200';
      case 'delivered':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-muted border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity</h3>
        <div className="text-center py-8 text-gray-500">Loading activity...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <span className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No recent activity in the last hour
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={`${event.type}-${event.timestamp}-${index}`}
              className={`p-3 rounded-lg border ${getEventColor(event.type)} flex items-start gap-3`}
            >
              <div className="mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{event.contact_name}</span>
                  {' '}{getEventLabel(event.type)}{' '}
                  <span className="text-gray-600">from</span>
                  {' '}<span className="font-medium">{event.campaign_name}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

