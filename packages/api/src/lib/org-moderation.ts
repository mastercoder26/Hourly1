import type { OrgProfile, User } from 'db';

export type OrganizationModerationStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'APPEALED';

export function deriveOrgModerationStatus(org: OrgProfile): OrganizationModerationStatus {
  if (org.isVerified) {
    return 'APPROVED';
  }
  if (org.appealSubmittedAt && org.appealDecision === 'PENDING') {
    return 'APPEALED';
  }
  if (org.verificationRejectedAt) {
    return 'DENIED';
  }
  return 'PENDING';
}

export function buildAppealRecord(org: OrgProfile):
  | {
      id: string;
      message: string;
      submittedAt: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      resolutionNote?: string;
      resolvedAt?: string;
    }
  | undefined {
  if (!org.appealSubmittedAt || !org.appealMessage) {
    return undefined;
  }

  const status: 'PENDING' | 'APPROVED' | 'REJECTED' =
    org.appealDecision === 'APPROVED'
      ? 'APPROVED'
      : org.appealDecision === 'REJECTED'
        ? 'REJECTED'
        : 'PENDING';

  return {
    id: `appeal_${org.id}`,
    message: org.appealMessage,
    submittedAt: org.appealSubmittedAt.toISOString(),
    status,
    resolutionNote: org.appealResolutionNote ?? undefined,
    resolvedAt: org.appealResolvedAt?.toISOString(),
  };
}

export function orgContactEmail(org: OrgProfile, owner: User): string {
  return org.email?.trim() || owner.email;
}
