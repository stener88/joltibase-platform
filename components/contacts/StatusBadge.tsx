import type { ContactStatus } from '@/lib/types/contact';

interface StatusBadgeProps {
  status: ContactStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    subscribed: 'bg-green-50 text-green-700 border-green-200',
    unsubscribed: 'bg-muted text-muted-foreground700 border-border',
    bounced: 'bg-red-50 text-red-700 border-red-200',
    complained: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const labels = {
    subscribed: 'Subscribed',
    unsubscribed: 'Unsubscribed',
    bounced: 'Bounced',
    complained: 'Complained',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

