import type { Opportunity, OrganizationModerationStatus } from '../mock-data';

/** Default visibility for older mock rows that predate post moderation. */
export function ensurePostDefaults(opportunities: Opportunity[]): void {
  for (const post of opportunities) {
    if (!post.postStatus) {
      post.postStatus = 'VISIBLE';
    }
  }
}

/** Keep opportunity flags aligned when an org is approved or denied. */
export function syncOpportunityOrgApproval(
  opportunities: Opportunity[],
  orgId: string,
  status: OrganizationModerationStatus
): void {
  const approved = status === 'APPROVED';
  for (const post of opportunities) {
    if (post.orgId === orgId) {
      post.orgVerified = approved;
      if (!post.postStatus) {
        post.postStatus = 'VISIBLE';
      }
    }
  }
}
