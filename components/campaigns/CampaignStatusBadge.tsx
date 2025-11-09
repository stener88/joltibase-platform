import type { CampaignStatus } from '@/lib/types/campaign';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const styles = {
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
    scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    sending: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse',
    sent: 'bg-green-50 text-green-700 border-green-200',
    paused: 'bg-orange-50 text-orange-700 border-orange-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
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

