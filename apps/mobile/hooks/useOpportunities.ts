import { useEffect, useMemo, useState } from 'react';
import { trpc } from '../lib/trpc';
import { ApiOpportunityLike, toMobileOpportunity } from '../lib/opportunity-adapter';
import { mockOpportunities } from '../mocks/opportunities';
import { Opportunity } from '../types';

function filterMockOpportunities(
  opportunities: Opportunity[],
  filters?: { causes?: string[]; creditEligible?: boolean; maxDistance?: number }
) {
  let results = opportunities;

  if (filters?.creditEligible) {
    results = results.filter(item => item.creditEligible);
  }

  if (filters?.causes && filters.causes.length > 0) {
    results = results.filter(item => item.causeTags.some(tag => filters.causes!.includes(tag)));
  }

  if (filters?.maxDistance !== undefined) {
    results = results.filter(item => item.distance === undefined || item.distance <= filters.maxDistance!);
  }

  return results;
}

export function useOpportunities(filters?: { causes?: string[]; creditEligible?: boolean; maxDistance?: number }) {
  const [useMockFallback, setUseMockFallback] = useState(false);

  const query = trpc.opportunity.list.useQuery({
    causes: filters?.causes,
    creditEligible: filters?.creditEligible,
    maxDistance: filters?.maxDistance,
  });

  useEffect(() => {
    if (!query.isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setUseMockFallback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [query.isLoading]);

  useEffect(() => {
    if (query.isSuccess) {
      setUseMockFallback(false);
    }
  }, [query.isSuccess]);

  useEffect(() => {
    if (query.isError) {
      setUseMockFallback(true);
    }
  }, [query.isError]);

  const apiData = useMemo(
    () => (query.data ?? []).map(item => toMobileOpportunity(item as ApiOpportunityLike)),
    [query.data]
  );

  const fallbackData = useMemo(
    () => filterMockOpportunities(mockOpportunities, filters),
    [filters?.causes, filters?.creditEligible, filters?.maxDistance]
  );

  const shouldUseFallback = useMockFallback || query.isError;
  const data = shouldUseFallback ? fallbackData : apiData;
  const queryErrorMessage =
    query.error && typeof query.error === 'object' && 'message' in query.error
      ? String((query.error as { message?: string }).message ?? '')
      : null;

  return {
    data,
    loading: query.isLoading && !shouldUseFallback,
    error: shouldUseFallback ? null : queryErrorMessage,
    refetch: query.refetch,
    isFetching: query.isFetching,
    usingFallback: shouldUseFallback,
  };
}
