'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Mail, Users, TrendingUp, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Campaign } from '@/lib/types/campaign';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete?: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const router = useRouter();
  const stats = campaign.stats || { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 };
  
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : '0';
  const clickRate = stats.delivered > 0 ? ((stats.clicked / stats.delivered) * 100).toFixed(1) : '0';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/campaigns/${campaign.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(campaign);
    }
  };

  const canDelete = campaign.status !== 'sending';

  return (
    <Link href={`/dashboard/campaigns/${campaign.id}/analytics`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {campaign.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {campaign.ai_generated && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                  ✨ AI Generated
                </span>
              )}
              <span className="capitalize">{campaign.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CampaignStatusBadge status={campaign.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={!canDelete}
                  variant="destructive"
                  className={!canDelete ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                  {!canDelete && <span className="ml-auto text-xs">(Sending)</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subject Line */}
        {campaign.subject_line && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {campaign.subject_line}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {campaign.status !== 'draft' && stats.sent > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Sent</p>
                <p className="text-sm font-semibold text-gray-900">{stats.sent.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Delivered</p>
                <p className="text-sm font-semibold text-gray-900">{stats.delivered.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Open Rate</p>
                <p className="text-sm font-semibold text-gray-900">{openRate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Click Rate</p>
                <p className="text-sm font-semibold text-gray-900">{clickRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {campaign.sent_at ? (
              <span>Sent {new Date(campaign.sent_at).toLocaleDateString()}</span>
            ) : campaign.scheduled_at ? (
              <span>Scheduled for {new Date(campaign.scheduled_at).toLocaleDateString()}</span>
            ) : (
              <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {campaign.list_ids?.length || 0} list{campaign.list_ids?.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </Link>
  );
}

