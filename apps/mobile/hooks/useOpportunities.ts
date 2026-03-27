import { useState, useEffect } from 'react';
import { mockOpportunities } from '../mocks/opportunities';
import { Opportunity } from '../types';

// This hook tries to use the tRPC API, but falls back to mock data
// until the API server is running. This is the Phase 2 migration pattern.
export function useOpportunities(filters?: { causes?: string[]; creditEligible?: boolean }) {
  const [data, setData] = useState<Opportunity[]>(mockOpportunities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO Phase 2: Replace with tRPC query when API server is running:
    // const result = trpc.opportunity.list.useQuery(filters);
    // For now, filter mock data locally
    let filtered = mockOpportunities;
    if (filters?.creditEligible) {
      filtered = filtered.filter(o => o.creditEligible);
    }
    if (filters?.causes && filters.causes.length > 0) {
      filtered = filtered.filter(o => o.causeTags.some(t => filters.causes!.includes(t)));
    }
    setData(filtered);
  }, [filters?.creditEligible, filters?.causes?.join(',')]);

  return { data, loading, error };
}
