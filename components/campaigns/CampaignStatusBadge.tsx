import type { CampaignStatus } from '@/lib/types/campaign';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const styles: Record<CampaignStatus, string> = {
    draft: 'bg-muted text-muted-foreground border-border',
    ready: 'bg-primary/10 text-primary border-primary',
    scheduled: 'bg-muted text-foreground border-primary',
    sent: 'bg-muted text-foreground border-border',
  };

  const labels: Record<CampaignStatus, string> = {
    draft: 'Draft',
    ready: 'Ready',
    scheduled: 'Scheduled',
    sent: 'Sent',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

