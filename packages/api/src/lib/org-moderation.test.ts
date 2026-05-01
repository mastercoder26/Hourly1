import { describe, expect, it } from 'vitest';
import type { OrgProfile } from 'db';
import { deriveOrgModerationStatus } from '../lib/org-moderation';

function baseOrg(over: Partial<OrgProfile> = {}): OrgProfile {
  return {
    id: 'org1',
    userId: 'u1',
    orgName: 'Test Org',
    slug: 'test-org',
    ein: null,
    mission: null,
    logoUrl: null,
    websiteUrl: null,
    phone: null,
    email: null,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    lat: null,
    lng: null,
    causeTags: [],
    isVerified: false,
    verificationRequestedAt: null,
    verificationApprovedAt: null,
    verificationRejectedAt: null,
    verificationRejectReason: null,
    trustBadge: false,
    appealMessage: null,
    appealSubmittedAt: null,
    appealResolvedAt: null,
    appealResolutionNote: null,
    appealDecision: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  };
}

describe('deriveOrgModerationStatus', () => {
  it('returns APPROVED when verified', () => {
    expect(deriveOrgModerationStatus(baseOrg({ isVerified: true }))).toBe('APPROVED');
  });

  it('returns APPEALED when appeal pending', () => {
    expect(
      deriveOrgModerationStatus(
        baseOrg({
          isVerified: false,
          verificationRejectedAt: new Date(),
          appealSubmittedAt: new Date(),
          appealDecision: 'PENDING',
        })
      )
    ).toBe('APPEALED');
  });

  it('returns DENIED when rejected and no pending appeal', () => {
    expect(
      deriveOrgModerationStatus(
        baseOrg({
          isVerified: false,
          verificationRejectedAt: new Date(),
          appealDecision: null,
        })
      )
    ).toBe('DENIED');
  });

  it('returns PENDING by default', () => {
    expect(deriveOrgModerationStatus(baseOrg())).toBe('PENDING');
  });
});
