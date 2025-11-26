'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { Mail, Users, TrendingUp, Calendar, MoreVertical, Edit, Trash2, Pencil, X } from 'lucide-react';
import type { Campaign } from '@/lib/types/campaign';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete?: (campaign: Campaign) => void;
  onRename?: (campaignId: string, newName: string) => Promise<void>;
}

export function CampaignCard({ campaign, onDelete, onRename }: CampaignCardProps) {
  const router = useRouter();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(campaign.name);
  const [isRenaming, setIsRenaming] = useState(false);

  // Update newName when campaign.name changes
  useEffect(() => {
    setNewName(campaign.name);
  }, [campaign.name]);
  
  const stats = campaign.stats || { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 };
  const hasStats = campaign.stats && stats.sent > 0;
  
  const openRate = stats.delivered > 0 ? ((stats.opened / stats.delivered) * 100).toFixed(1) : '0';
  const clickRate = stats.delivered > 0 ? ((stats.clicked / stats.delivered) * 100).toFixed(1) : '0';

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/campaigns/${campaign.id}/edit`);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewName(campaign.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newName.trim()) {
      toast.error('Campaign name cannot be empty');
      return;
    }

    if (newName.trim() === campaign.name) {
      setIsRenameDialogOpen(false);
      return;
    }

    setIsRenaming(true);
    try {
      if (onRename) {
        await onRename(campaign.id, newName.trim());
      } else {
        // Fallback: call API directly
        const response = await fetch(`/api/v2/campaigns/${campaign.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName.trim() }),
        });

        if (!response.ok) {
          throw new Error('Failed to update campaign name');
        }

        toast.success('Campaign renamed successfully');
        // Reload the page to reflect the change
        window.location.reload();
      }
      setIsRenameDialogOpen(false);
    } catch (error: any) {
      console.error('Error renaming campaign:', error);
      toast.error(error.message || 'Failed to rename campaign');
    } finally {
      setIsRenaming(false);
    }
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
    <>
      <Link href={`/dashboard/campaigns/${campaign.id}/analytics`}>
        <div className="bg-white rounded-lg border border-[#e8e7e5] p-6 hover:shadow-lg transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#3d3d3a] mb-1 truncate">
              {campaign.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              {(campaign.ai_generated || campaign.generation_prompt) && (
                <span className="inline-flex items-center gap-1 text-xs bg-[#e9a589]/10 text-[#e9a589] px-2 py-0.5 rounded-full border border-[#e9a589]/20">
                  ✨ AI Generated
                </span>
              )}
              {campaign.type && <span className="capitalize">{campaign.type}</span>}
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
                <DropdownMenuItem onClick={handleRename}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
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
          <div className="mb-4 pb-4 border-b border-[#e8e7e5]">
            <p className="text-sm text-[#6b6b6b] line-clamp-2">
              {campaign.subject_line}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {campaign.status !== 'draft' && hasStats && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#6b6b6b]" />
              <div>
                <p className="text-xs text-[#6b6b6b]">Sent</p>
                <p className="text-sm font-semibold text-[#3d3d3a]">{stats.sent.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#6b6b6b]" />
              <div>
                <p className="text-xs text-[#6b6b6b]">Delivered</p>
                <p className="text-sm font-semibold text-[#3d3d3a]">{stats.delivered.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6b6b6b]" />
              <div>
                <p className="text-xs text-[#6b6b6b]">Open Rate</p>
                <p className="text-sm font-semibold text-[#3d3d3a]">{openRate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6b6b6b]" />
              <div>
                <p className="text-xs text-[#6b6b6b]">Click Rate</p>
                <p className="text-sm font-semibold text-[#3d3d3a]">{clickRate}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#e8e7e5]">
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
            <Calendar className="w-3.5 h-3.5" />
            {campaign.sent_at ? (
              <span>Sent {new Date(campaign.sent_at).toLocaleDateString()}</span>
            ) : campaign.scheduled_at ? (
              <span>Scheduled for {new Date(campaign.scheduled_at).toLocaleDateString()}</span>
            ) : (
              <span>Created {new Date(campaign.created_at).toLocaleDateString()}</span>
            )}
          </div>
          {campaign.list_ids && (
            <div className="text-xs text-[#6b6b6b]">
              {campaign.list_ids.length} list{campaign.list_ids.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
      </Link>

      {/* Rename Dialog */}
      {isRenameDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRenameDialogOpen(false);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e7e5]">
              <h3 className="text-lg font-semibold text-[#3d3d3a]">Rename Campaign</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsRenameDialogOpen(false);
                }}
                className="p-2 rounded-lg hover:bg-[#f5f4ed] transition-colors"
              >
                <X className="w-5 h-5 text-[#6b6b6b]" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleRenameSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="campaign-name" className="block text-sm font-medium text-[#3d3d3a] mb-2">
                    Campaign Name
                  </label>
                  <input
                    id="campaign-name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsRenameDialogOpen(false);
                      }
                    }}
                    className="w-full px-3 py-2 border border-[#e8e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a589] focus:border-transparent"
                    placeholder="Enter campaign name"
                    autoFocus
                    disabled={isRenaming}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e8e7e5]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsRenameDialogOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#3d3d3a] bg-white border border-[#e8e7e5] rounded-lg hover:bg-[#f5f4ed] transition-colors"
                  disabled={isRenaming}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#141413] rounded-lg hover:bg-[#3d3d3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRenaming || !newName.trim()}
                >
                  {isRenaming ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

