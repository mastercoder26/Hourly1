import { randomUUID } from 'crypto';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from 'db';
import type { Prisma } from 'db';
import { adminSessions } from '../mock-data';
import { adminProcedure, publicProcedure, router } from '../trpc';
import {
  buildAppealRecord,
  deriveOrgModerationStatus,
  orgContactEmail,
  type OrganizationModerationStatus,
} from '../lib/org-moderation';

const ORG_FILTER_STATUS = ['ALL', 'PENDING', 'APPROVED', 'DENIED', 'APPEALED'] as const;
const APPEAL_FILTER_STATUS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
const POST_FILTER_STATUS = ['ALL', 'VISIBLE', 'REMOVED'] as const;

type OrgWithUserAndOpps = Prisma.OrgProfileGetPayload<{
  include: { user: true; opportunities: { select: { id: true; adminHidden: true } } };
}>;

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

function mapOrgToAdminRow(org: OrgWithUserAndOpps) {
  const status = deriveOrgModerationStatus(org);
  const posts = org.opportunities ?? [];
  const postCount = posts.length;
  const visiblePostCount = posts.filter(p => !p.adminHidden).length;

  return {
    id: org.id,
    name: org.orgName,
    contactEmail: orgContactEmail(org, org.user),
    causeTags: org.causeTags,
    description: org.mission ?? '',
    status: status as OrganizationModerationStatus,
    denialReason: org.verificationRejectReason ?? undefined,
    appeal: buildAppealRecord(org),
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
    postCount,
    visiblePostCount,
  };
}

export const adminRouter = router({
  checkConfig: publicProcedure.query(() => {
    const email = process.env.ADMIN_DASHBOARD_EMAIL ?? 'admin@hourly.app';
    const passwordConfigured = Boolean(process.env.ADMIN_DASHBOARD_PASSWORD?.trim());

    return {
      emailHint: email,
      passwordConfigured,
    };
  }),

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

  getOverview: adminProcedure.query(async () => {
    const orgs = await prisma.orgProfile.findMany();
    const opps = await prisma.opportunity.findMany();

    const orgCounts = {
      total: orgs.length,
      pending: orgs.filter(o => deriveOrgModerationStatus(o) === 'PENDING').length,
      approved: orgs.filter(o => deriveOrgModerationStatus(o) === 'APPROVED').length,
      denied: orgs.filter(o => deriveOrgModerationStatus(o) === 'DENIED').length,
      appealed: orgs.filter(o => deriveOrgModerationStatus(o) === 'APPEALED').length,
    };

    const postCounts = {
      total: opps.length,
      visible: opps.filter(p => !p.adminHidden).length,
      removed: opps.filter(p => p.adminHidden).length,
    };

    const pendingAppeals = orgs.filter(
      o => o.appealDecision === 'PENDING' && Boolean(o.appealSubmittedAt)
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
    .query(async ({ input }) => {
      const status = input?.status ?? 'ALL';
      const search = input?.search;
      const cause = input?.cause?.trim();

      const rows = await prisma.orgProfile.findMany({
        include: {
          user: true,
          opportunities: { select: { id: true, adminHidden: true } },
        },
      });

      return rows
        .map(org => mapOrgToAdminRow(org))
        .filter(org => (status === 'ALL' ? true : org.status === status))
        .filter(org => (cause ? org.causeTags.includes(cause) : true))
        .filter(org =>
          matchesSearch(
            `${org.name} ${org.contactEmail} ${org.description} ${org.causeTags.join(' ')} ${org.denialReason ?? ''} ${org.appeal?.message ?? ''}`,
            search
          )
        )
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
    .mutation(async ({ input }) => {
      const org = await prisma.orgProfile.findUnique({ where: { id: input.organizationId } });
      if (!org) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Organization not found' });
      }

      const now = new Date();

      if (input.decision === 'APPROVE') {
        await prisma.orgProfile.update({
          where: { id: org.id },
          data: {
            isVerified: true,
            verificationApprovedAt: now,
            verificationRejectedAt: null,
            verificationRejectReason: null,
            appealMessage: null,
            appealSubmittedAt: null,
            appealResolvedAt: null,
            appealResolutionNote: input.reason ?? 'Approved by admin.',
            appealDecision: null,
          },
        });
      } else {
        await prisma.orgProfile.update({
          where: { id: org.id },
          data: {
            isVerified: false,
            verificationRejectedAt: now,
            verificationRejectReason: input.reason?.trim() || 'Denied by admin review.',
            appealDecision: null,
            appealResolvedAt: null,
            appealMessage: null,
            appealSubmittedAt: null,
          },
        });
      }

      const fresh = await prisma.orgProfile.findUniqueOrThrow({
        where: { id: org.id },
        include: { user: true, opportunities: { select: { id: true, adminHidden: true } } },
      });
      return mapOrgToAdminRow(fresh);
    }),

  submitAppeal: publicProcedure
    .input(
      z.object({
        organizationId: z.string(),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      const org = await prisma.orgProfile.findUnique({ where: { id: input.organizationId } });
      if (!org) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Organization not found' });
      }

      const st = deriveOrgModerationStatus(org);
      if (st !== 'DENIED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Appeals are only allowed for denied organizations.',
        });
      }

      const now = new Date();
      await prisma.orgProfile.update({
        where: { id: org.id },
        data: {
          appealMessage: input.message.trim(),
          appealSubmittedAt: now,
          appealResolvedAt: null,
          appealResolutionNote: null,
          appealDecision: 'PENDING',
        },
      });

      const fresh = await prisma.orgProfile.findUniqueOrThrow({
        where: { id: org.id },
        include: { user: true, opportunities: { select: { id: true, adminHidden: true } } },
      });
      return mapOrgToAdminRow(fresh);
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
    .query(async ({ input }) => {
      const status = input?.status ?? 'ALL';
      const search = input?.search;

      const rows = await prisma.orgProfile.findMany({
        where: {
          appealSubmittedAt: { not: null },
          appealMessage: { not: null },
        },
        include: { user: true },
      });

      return rows
        .map(org => {
          const appeal = buildAppealRecord(org);
          if (!appeal) return null;
          return {
            organizationId: org.id,
            organizationName: org.orgName,
            organizationEmail: orgContactEmail(org, org.user),
            currentStatus: deriveOrgModerationStatus(org),
            denialReason: org.verificationRejectReason,
            appeal,
            updatedAt: org.updatedAt.toISOString(),
          };
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row))
        .filter(row => (status === 'ALL' ? true : row.appeal.status === status))
        .filter(row =>
          matchesSearch(`${row.organizationName} ${row.organizationEmail} ${row.appeal.message}`, search)
        )
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
    .mutation(async ({ input }) => {
      const org = await prisma.orgProfile.findUnique({ where: { id: input.organizationId } });
      if (!org || !org.appealSubmittedAt) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Appeal not found for organization' });
      }

      if (org.appealDecision !== 'PENDING') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Appeal already resolved' });
      }

      const now = new Date();

      if (input.decision === 'APPROVE') {
        await prisma.orgProfile.update({
          where: { id: org.id },
          data: {
            isVerified: true,
            verificationApprovedAt: now,
            verificationRejectedAt: null,
            verificationRejectReason: null,
            appealResolvedAt: now,
            appealResolutionNote: input.note?.trim() || 'Appeal approved by admin.',
            appealDecision: 'APPROVED',
          },
        });
      } else {
        await prisma.orgProfile.update({
          where: { id: org.id },
          data: {
            isVerified: false,
            appealResolvedAt: now,
            appealResolutionNote: input.note?.trim() || org.verificationRejectReason || 'Appeal rejected.',
            appealDecision: 'REJECTED',
          },
        });
      }

      const fresh = await prisma.orgProfile.findUniqueOrThrow({
        where: { id: org.id },
        include: { user: true, opportunities: { select: { id: true, adminHidden: true } } },
      });
      return mapOrgToAdminRow(fresh);
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
    .query(async ({ input }) => {
      const status = input?.status ?? 'ALL';
      const search = input?.search;
      const organizationId = input?.organizationId;
      const cause = input?.cause?.trim();

      const rows = await prisma.opportunity.findMany({
        include: { orgProfile: { include: { user: true } } },
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        take: 500,
      });

      return rows
        .map(post => {
          const org = post.orgProfile;
          const orgStatus = deriveOrgModerationStatus(org);
          const postStatus = post.adminHidden ? ('REMOVED' as const) : ('VISIBLE' as const);
          const canShowToStudents =
            orgStatus === 'APPROVED' && postStatus === 'VISIBLE' && post.isPublished;

          return {
            id: post.id,
            orgId: org.id,
            orgName: org.orgName,
            orgVerified: org.isVerified,
            title: post.title,
            description: post.description,
            causeTags: post.causeTags,
            date: post.date.toISOString().slice(0, 10),
            startTime: post.startTime.toISOString(),
            endTime: post.endTime.toISOString(),
            durationHours: Number(post.durationHours),
            location: {
              lat: Number(post.lat),
              lng: Number(post.lng),
              address: post.address,
              city: post.city ?? org.city ?? '',
              state: post.state ?? org.state ?? '',
            },
            totalSpots: post.totalSpots,
            filledSpots: post.filledSpots,
            ageMinimum: post.ageMinimum ?? undefined,
            creditEligible: post.creditEligible,
            whatToBring: post.whatToBring,
            recurring: post.recurring,
            postStatus,
            removedReason: post.adminHiddenReason ?? undefined,
            moderatedAt: post.adminHiddenAt?.toISOString(),
            orgStatus,
            canShowToStudents,
          };
        })
        .filter(post => (status === 'ALL' ? true : post.postStatus === status))
        .filter(post => (organizationId ? post.orgId === organizationId : true))
        .filter(post => (cause ? post.causeTags.includes(cause) : true))
        .filter(post =>
          matchesSearch(
            `${post.title} ${post.description} ${post.orgName} ${post.causeTags.join(' ')} ${post.removedReason ?? ''}`,
            search
          )
        );
    }),

  moderatePost: adminProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        action: z.enum(['REMOVE', 'RESTORE']),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const now = new Date();

      if (input.action === 'REMOVE') {
        await prisma.opportunity.update({
          where: { id: input.opportunityId },
          data: {
            adminHidden: true,
            adminHiddenReason: input.reason?.trim() || 'Removed by admin moderation.',
            adminHiddenAt: now,
          },
        });
      } else {
        await prisma.opportunity.update({
          where: { id: input.opportunityId },
          data: {
            adminHidden: false,
            adminHiddenReason: null,
            adminHiddenAt: now,
          },
        });
      }

      const post = await prisma.opportunity.findUniqueOrThrow({
        where: { id: input.opportunityId },
        include: { orgProfile: true },
      });

      const orgStatus = deriveOrgModerationStatus(post.orgProfile);
      const postStatus = post.adminHidden ? ('REMOVED' as const) : ('VISIBLE' as const);
      const canShowToStudents =
        orgStatus === 'APPROVED' && postStatus === 'VISIBLE' && post.isPublished;

      return {
        id: post.id,
        orgId: post.orgProfileId,
        orgName: post.orgProfile.orgName,
        orgVerified: post.orgProfile.isVerified,
        title: post.title,
        description: post.description,
        causeTags: post.causeTags,
        date: post.date.toISOString().slice(0, 10),
        startTime: post.startTime.toISOString(),
        endTime: post.endTime.toISOString(),
        durationHours: Number(post.durationHours),
        postStatus,
        removedReason: post.adminHiddenReason ?? undefined,
        moderatedAt: post.adminHiddenAt?.toISOString(),
        orgStatus,
        canShowToStudents,
      };
    }),
});
