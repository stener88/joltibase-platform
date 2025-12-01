'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { Plus, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Campaign } from '@/lib/types/campaign';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, [page, search, statusFilter, typeFilter]);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);

      const response = await fetch(`/api/v3/campaigns?${params}`);
      const result = await response.json();

      if (result.success) {
        setCampaigns(result.data.campaigns);
        setTotalPages(result.data.pagination.totalPages);
        setTotal(result.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        loadCampaigns();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v3/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');

      // Close dialog
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);

      // If we're deleting the last item on a page (and not on page 1), go back one page
      if (campaigns.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // Otherwise, just reload the current page
        loadCampaigns();
      }
    } catch (error: any) {
      console.error('Failed to delete campaign:', error);
      toast.error(error.message || 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Action Buttons */}
        <div className="mb-6">
          <div className="flex items-center justify-end gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
                Create Campaign
              </button>
              
              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => router.push('/dashboard/campaigns/generate')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Generate with AI</p>
                      <p className="text-xs text-muted-foreground">Let AI create your campaign</p>
                    </div>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/campaigns/new')}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Create Manually</p>
                      <p className="text-xs text-muted-foreground">Use the email composer</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CampaignFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            type={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        {/* Campaign Grid */}
        {isLoading && campaigns.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <svg
              className="animate-spin h-12 w-12 text-foreground mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first email campaign
            </p>
            <button
              onClick={() => setShowCreateMenu(true)}
              className="group px-3 py-2 bg-transparent border border-border text-foreground rounded-lg hover:bg-muted hover:border-foreground transition-colors inline-flex items-center gap-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4 text-muted-foreground transition-colors" />
              Create Campaign
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {campaigns.map((campaign) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-card rounded-lg border border-border px-6 py-4">
                <div className="text-sm text-foreground">
                  Showing page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                  {' '}({total} total campaigns)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border hover:bg-muted hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-border hover:bg-muted hover:border-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{campaignToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

