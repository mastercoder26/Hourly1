import type { Opportunity as PrismaOpportunity, OrgProfile } from 'db';

export type OpportunityWithOrg = PrismaOpportunity & { orgProfile: OrgProfile };

function decimalToNumber(value: { toNumber: () => number } | number): number {
  if (typeof value === 'number') {
    return value;
  }
  return value.toNumber();
}

/**
 * Maps persisted opportunity + org to the wire shape expected by
 * `apps/mobile/lib/opportunity-adapter.ts` (previously mock-backed).
 */
export function toApiOpportunity(row: OpportunityWithOrg) {
  const org = row.orgProfile;
  const lat = decimalToNumber(row.lat);
  const lng = decimalToNumber(row.lng);
  const durationHours = decimalToNumber(row.durationHours);
  const city = row.city ?? org.city ?? '';
  const state = row.state ?? org.state ?? '';

  return {
    id: row.id,
    orgId: org.id,
    orgName: org.orgName,
    orgVerified: org.isVerified,
    title: row.title,
    description: row.description,
    causeTags: row.causeTags,
    date: row.date.toISOString(),
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    durationHours,
    location: {
      lat,
      lng,
      address: row.address,
      city,
      state,
    },
    totalSpots: row.totalSpots,
    filledSpots: row.filledSpots,
    ageMinimum: row.ageMinimum ?? undefined,
    creditEligible: row.creditEligible,
    whatToBring: row.whatToBring,
    recurring: row.recurring,
    postStatus: row.adminHidden
      ? ('REMOVED' as const)
      : row.isPublished
        ? ('VISIBLE' as const)
        : ('REMOVED' as const),
    removedReason: row.adminHidden ? (row.adminHiddenReason ?? undefined) : undefined,
    moderatedAt: row.adminHiddenAt?.toISOString(),
  };
}
