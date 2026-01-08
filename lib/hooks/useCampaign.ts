import { useQuery } from '@tanstack/react-query';

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/v3/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      const data = await res.json();
      return data.campaign;
    },
    staleTime: Infinity, // NEVER auto-refetch - only on explicit invalidation
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

