import type { CampaignStatus } from '@/lib/types/campaign';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const styles = {
    draft: 'bg-muted text-muted-foreground border-border',
    scheduled: 'bg-muted text-foreground border-primary',
    sending: 'bg-primary/10 text-primary border-primary animate-pulse',
    sent: 'bg-muted text-foreground border-border',
    paused: 'bg-muted text-muted-foreground border-border',
    cancelled: 'bg-destructive/10 text-destructive border-destructive',
  };

  const labels = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    sending: 'Sending',
    sent: 'Sent',
    paused: 'Paused',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

