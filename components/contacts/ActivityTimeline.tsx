import { Mail, MousePointer, Eye, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailEvent {
  id: string;
  subject: string;
  status: string;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  campaign_id: string | null;
  campaigns?: { name: string } | null;
}

interface ActivityTimelineProps {
  emailHistory: EmailEvent[];
}

export function ActivityTimeline({ emailHistory }: ActivityTimelineProps) {
  if (!emailHistory || emailHistory.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Mail className="w-12 h-12 text-muted-foreground300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground900 mb-2">No email activity yet</h3>
        <p className="text-muted-foreground600">
          This contact hasn't received any emails from your campaigns
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'opened':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'clicked':
        return <MousePointer className="w-5 h-5 text-purple-600" />;
      case 'bounced':
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Mail className="w-5 h-5 text-muted-foreground400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return 'bg-green-50 border-green-200';
      case 'opened':
        return 'bg-blue-50 border-blue-200';
      case 'clicked':
        return 'bg-purple-50 border-purple-200';
      case 'bounced':
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-muted-foreground900 mb-6">Email Activity</h3>
      
      <div className="space-y-4">
        {emailHistory.map((event, idx) => (
          <div
            key={event.id}
            className={`p-4 border rounded-lg ${getStatusColor(event.status)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(event.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-muted-foreground900 truncate">
                      {event.subject}
                    </p>
                    {event.campaigns && (
                      <p className="text-xs text-muted-foreground600 mt-1">
                        Campaign: {event.campaigns.name}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground500 ml-2 flex-shrink-0">
                    {event.sent_at ? new Date(event.sent_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground600">
                  {event.sent_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>
                        Sent {new Date(event.sent_at).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {event.opened_at && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>
                        Opened {new Date(event.opened_at).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {event.clicked_at && (
                    <div className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      <span>
                        Clicked {new Date(event.clicked_at).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

