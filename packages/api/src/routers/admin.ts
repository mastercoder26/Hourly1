import { randomUUID } from 'crypto';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  adminSessions,
  mockOpportunities,
  mockOrganizations,
  type OrganizationModerationStatus,
} from '../mock-data';
import { adminProcedure, publicProcedure, router } from '../trpc';

const ORG_FILTER_STATUS = ['ALL', 'PENDING', 'APPROVED', 'DENIED', 'APPEALED'] as const;
const APPEAL_FILTER_STATUS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
const POST_FILTER_STATUS = ['ALL', 'VISIBLE', 'REMOVED'] as const;

function nowIso() {
  return new Date().toISOString();
}

function matchesSearch(haystack: string, search?: string) {
  if (!search?.trim()) return true;
  return haystack.toLowerCase().includes(search.trim().toLowerCase());
}

function getAdminCredentials() {
  const email = process.env.ADMIN_DASHBOARD_EMAIL ?? 'admin@hourly.app';
  const password = process.env.ADMIN_DASHBOARD_PASSWORD ?? '';
  return { email, password };
}

function ensurePostDefaults() {
  for (const post of mockOpportunities) {
    if (!post.postStatus) {
      post.postStatus = 'VISIBLE';
    }
  }
}

function syncOpportunityOrgApproval(orgId: string, status: OrganizationModerationStatus) {
  const approved = status === 'APPROVED';
  for (const post of mockOpportunities) {
    if (post.orgId === orgId) {
      post.orgVerified = approved;
      if (!post.postStatus) {
        post.postStatus = 'VISIBLE';
      }
    }
  }
}

export const adminRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const { email, password } = getAdminCredentials();

      const matches = input.email.toLowerCase() === email.toLowerCase() && input.password === password;
      if (!matches) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid admin credentials' });
      }

      const createdAt = nowIso();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
      const token = `admin_${randomUUID()}`;

      adminSessions.push({
        token,
        email,
        createdAt,
        expiresAt,
      });

      return {
        token,
        email,
        createdAt,
        expiresAt,
      };
    }),

  logout: adminProcedure.mutation(({ ctx }) => {
    const index = adminSessions.findIndex(session => session.token === ctx.adminToken);
    if (index >= 0) {
      adminSessions.splice(index, 1);
    }

    return { success: true };
  }),

  getOverview: adminProcedure.query(() => {
    ensurePostDefaults();

    const orgCounts = {
      total: mockOrganizations.length,
      pending: mockOrganizations.filter(org => org.status === 'PENDING').length,
      approved: mockOrganizations.filter(org => org.status === 'APPROVED').length,
      denied: mockOrganizations.filter(org => org.status === 'DENIED').length,
      appealed: mockOrganizations.filter(org => org.status === 'APPEALED').length,
    };

    const postCounts = {
      total: mockOpportunities.length,
      visible: mockOpportunities.filter(post => post.postStatus === 'VISIBLE').length,
      removed: mockOpportunities.filter(post => post.postStatus === 'REMOVED').length,
    };

    const pendingAppeals = mockOrganizations.filter(
      org => org.appeal?.status === 'PENDING' && org.status === 'APPEALED'
    ).length;

    return {
      orgCounts,
      postCounts,
      pendingAppeals,
      lastUpdatedAt: nowIso(),
    };
  }),

  listOrganizations: adminProcedure
    .input(
      z
        .object({
          status: z.enum(ORG_FILTER_STATUS).default('ALL'),
          search: z.string().optional(),
          cause: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      const status = input?.status ?? 'ALL';
      const search = input?.search;
      const cause = input?.cause?.trim();

      return mockOrganizations
        .filter(org => (status === 'ALL' ? true : org.status === status))
        .filter(org => (cause ? org.causeTags.includes(cause) : true))
        .filter(org =>
          matchesSearch(
            `${org.name} ${org.contactEmail} ${org.description} ${org.causeTags.join(' ')} ${org.denialReason ?? ''} ${org.appeal?.message ?? ''}`,
            search
          )
        )
        .map(org => {
          const posts = mockOpportunities.filter(post => post.orgId === org.id);
          return {
            ...org,
            postCount: posts.length,
            visiblePostCount: posts.filter(post => post.postStatus !== 'REMOVED').length,
          };
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }),

  reviewOrganization: adminProcedure
    .input(
      z.object({
        organizationId: z.string(),
        decision: z.enum(['APPROVE', 'DENY']),
        reason: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const org = mockOrganizations.find(item => item.id === input.organizationId);
      if (!org) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Organization not found' });
      }

      if (input.decision === 'APPROVE') {
        org.status = 'APPROVED';
        org.denialReason = undefined;
        if (org.appeal) {
          org.appeal.status = 'APPROVED';
          org.appeal.resolutionNote = input.reason ?? 'Appeal approved by admin.';
          org.appeal.resolvedAt = nowIso();
        }
      } else {
        org.status = 'DENIED';
        org.denialReason = input.reason?.trim() || 'Denied by admin review.';
        if (org.appeal && org.appeal.status === 'PENDING') {
          org.appeal.status = 'REJECTED';
          org.appeal.resolutionNote = org.denialReason;
          org.appeal.resolvedAt = nowIso();
        }
      }

      org.updatedAt = nowIso();
      syncOpportunityOrgApproval(org.id, org.status);

      return org;
    }),

  submitAppeal: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
        message: z.string().min(10),
      })
    )
    .mutation(({ input }) => {
      const org = mockOrganizations.find(item => item.id === input.organizationId);
      if (!org) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Organization not found' });
      }

      if (org.status !== 'DENIED' && org.status !== 'APPEALED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Appeals are only allowed for denied organizations.',
        });
      }

      org.status = 'APPEALED';
      org.appeal = {
        id: `appeal_${randomUUID()}`,
        message: input.message.trim(),
        submittedAt: nowIso(),
        status: 'PENDING',
      };
      org.updatedAt = nowIso();

      return org;
    }),

  listAppeals: adminProcedure
    .input(
      z
        .object({
          status: z.enum(APPEAL_FILTER_STATUS).default('ALL'),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      const status = input?.status ?? 'ALL';
      const search = input?.search;

      return mockOrganizations
        .filter(org => Boolean(org.appeal))
        .filter(org => (status === 'ALL' ? true : org.appeal?.status === status))
        .filter(org =>
          matchesSearch(`${org.name} ${org.contactEmail} ${org.appeal?.message ?? ''}`, search)
        )
        .map(org => ({
          organizationId: org.id,
          organizationName: org.name,
          organizationEmail: org.contactEmail,
          currentStatus: org.status,
          denialReason: org.denialReason,
          appeal: org.appeal!,
          updatedAt: org.updatedAt,
        }))
        .sort((a, b) => b.appeal.submittedAt.localeCompare(a.appeal.submittedAt));
    }),

  resolveAppeal: adminProcedure
    .input(
      z.object({
        organizationId: z.string(),
        decision: z.enum(['APPROVE', 'REJECT']),
        note: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const org = mockOrganizations.find(item => item.id === input.organizationId);
      if (!org || !org.appeal) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Appeal not found for organization' });
      }

      if (org.appeal.status !== 'PENDING') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Appeal already resolved' });
      }

      if (input.decision === 'APPROVE') {
        org.status = 'APPROVED';
        org.denialReason = undefined;
        org.appeal.status = 'APPROVED';
        org.appeal.resolutionNote = input.note?.trim() || 'Appeal approved by admin.';
        org.appeal.resolvedAt = nowIso();
      } else {
        org.status = 'DENIED';
        org.denialReason = input.note?.trim() || org.denialReason || 'Appeal denied by admin.';
        org.appeal.status = 'REJECTED';
        org.appeal.resolutionNote = org.denialReason;
        org.appeal.resolvedAt = nowIso();
      }

      org.updatedAt = nowIso();
      syncOpportunityOrgApproval(org.id, org.status);

      return org;
    }),

  listPosts: adminProcedure
    .input(
      z
        .object({
          status: z.enum(POST_FILTER_STATUS).default('ALL'),
          search: z.string().optional(),
          organizationId: z.string().optional(),
          cause: z.string().optional(),
        })
        .optional()
    )
    .query(({ input }) => {
      ensurePostDefaults();

      const status = input?.status ?? 'ALL';
      const search = input?.search;
      const organizationId = input?.organizationId;
      const cause = input?.cause?.trim();

      return mockOpportunities
        .filter(post => (status === 'ALL' ? true : post.postStatus === status))
        .filter(post => (organizationId ? post.orgId === organizationId : true))
        .filter(post => (cause ? post.causeTags.includes(cause) : true))
        .filter(post =>
          matchesSearch(
            `${post.title} ${post.description} ${post.orgName} ${post.causeTags.join(' ')} ${post.removedReason ?? ''}`,
            search
          )
        )
        .map(post => {
          const org = mockOrganizations.find(item => item.id === post.orgId);
          const canShowToStudents =
            (org?.status ?? 'PENDING') === 'APPROVED' && (post.postStatus ?? 'VISIBLE') === 'VISIBLE';

          return {
            ...post,
            orgStatus: org?.status ?? 'PENDING',
            canShowToStudents,
          };
        })
        .sort((a, b) => b.date.localeCompare(a.date));
    }),

  moderatePost: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        action: z.enum(['REMOVE', 'RESTORE']),
        reason: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      ensurePostDefaults();

      const post = mockOpportunities.find(item => item.id === input.opportunityId);
      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      if (input.action === 'REMOVE') {
        post.postStatus = 'REMOVED';
        post.removedReason = input.reason?.trim() || 'Removed by admin moderation.';
        post.moderatedAt = nowIso();
      } else {
        post.postStatus = 'VISIBLE';
        post.removedReason = undefined;
        post.moderatedAt = nowIso();
      }

      return post;
    }),
});
