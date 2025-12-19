import { useQuery } from '@tanstack/react-query';

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      console.log('[useCampaign] Fetching campaign:', campaignId);
      const res = await fetch(`/api/v3/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      const data = await res.json();
      console.log('[useCampaign] Fetched campaign, html_content length:', data.campaign?.html_content?.length);
      return data.campaign;
    },
    staleTime: Infinity, // NEVER auto-refetch - only on explicit invalidation
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

