import { useMemo } from 'react';
import { trpc } from '../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../lib/opportunity-adapter';

export function useOpportunities(filters?: { causes?: string[]; creditEligible?: boolean; maxDistance?: number }) {
  const query = trpc.opportunity.list.useQuery({
    causes: filters?.causes,
    creditEligible: filters?.creditEligible,
    maxDistance: filters?.maxDistance,
  });

  const data = useMemo(
    () => (query.data ?? []).map(item => toMobileOpportunity(item as ApiOpportunityLike)),
    [query.data]
  );

  return {
    data,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
