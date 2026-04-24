import { useMemo } from 'react';
import { errorMessageFromUnknown } from '../lib/errors';
import { trpc } from '../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../lib/opportunity-adapter';
import { isDemoMode, isLiveMode } from '../lib/dataMode';
import { filterDemoOpportunities, useDemoStore } from '../lib/demo/demoStore';
import { Opportunity } from '../types';

export function useOpportunities(filters?: {
  causes?: string[];
  creditEligible?: boolean;
  maxDistance?: number;
}) {
  const demoOpportunities = useDemoStore(s => s.opportunities);

  const query = trpc.opportunity.list.useQuery(
    {
      causes: filters?.causes,
      creditEligible: filters?.creditEligible,
      maxDistance: filters?.maxDistance,
    },
    { enabled: isLiveMode() },
  );

  const demoData = useMemo(
    () => filterDemoOpportunities(demoOpportunities, filters),
    [demoOpportunities, filters?.causes, filters?.creditEligible, filters?.maxDistance],
  );

  const apiData: Opportunity[] = useMemo(
    () => (query.data ?? []).map(item => toMobileOpportunity(item as ApiOpportunityLike)),
    [query.data],
  );

  if (isDemoMode()) {
    return {
      data: demoData,
      loading: false,
      error: null,
      refetch: async () => {},
      isFetching: false,
      usingFallback: false,
    };
  }

  return {
    data: apiData,
    loading: query.isLoading,
    error: errorMessageFromUnknown(query.error),
    refetch: query.refetch,
    isFetching: query.isFetching,
    usingFallback: false,
  };
}
