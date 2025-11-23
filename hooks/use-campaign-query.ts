import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EmailComponent, GlobalEmailSettings } from '@/lib/email-v2/types';

interface CampaignData {
  id: string;
  subject_line: string;
  preview_text: string;
  html_content: string;
  campaign: any;
  metadata: any;
  // V2 React Email fields
  version: 'v2';
  root_component?: EmailComponent;
  global_settings?: GlobalEmailSettings;
  semantic_blocks?: any;
}

interface CampaignUpdate {
  html_content?: string;
  subject_line?: string;
  preview_text?: string;
  root_component?: EmailComponent;
  global_settings?: GlobalEmailSettings;
}

// Fetch campaign
export function useCampaignQuery(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch campaign');
      const result = await response.json();
      return result.data as CampaignData;
    },
    enabled: !!campaignId,
  });
}

// Save campaign mutation with optimistic updates
export function useCampaignMutation(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: CampaignUpdate) => {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Save failed');
      return response.json();
    },
    
    // Optimistic update: update UI immediately
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['campaign', campaignId] });
      
      // Snapshot previous value
      const previousCampaign = queryClient.getQueryData(['campaign', campaignId]);
      
      // Optimistically update
      queryClient.setQueryData(['campaign', campaignId], (old: any) => ({
        ...old,
        ...newData,
      }));
      
      return { previousCampaign };
    },
    
    // Rollback on error
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        ['campaign', campaignId],
        context?.previousCampaign
      );
    },
    
    // Refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
  });
}
