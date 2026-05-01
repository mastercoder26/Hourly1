import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Prisma } from 'db';
import { prisma } from 'db';
import { router, protectedProcedure } from '../trpc';
import { resolveWritableOrgProfileId, ensureOrgProfileForOrganizer } from '../lib/organizer-user';
import { recalcOpportunityFilledSpots } from '../lib/student-stats';
import { orgContactEmail, buildAppealRecord, deriveOrgModerationStatus } from '../lib/org-moderation';
import { toApiOpportunity } from '../mappers/opportunity';

const orgIdInput = z.object({ orgId: z.string().optional() });

export const orgRouter = router({
  /** Creates default org profile for the signed-in organizer if missing. */
  bootstrap: protectedProcedure.mutation(async ({ ctx }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);
    const org = await prisma.orgProfile.findUniqueOrThrow({
      where: { id: orgProfileId },
      include: { user: true },
    });
    return {
      orgId: org.id,
      name: org.orgName,
      slug: org.slug,
      contactEmail: orgContactEmail(org, org.user),
      isVerified: org.isVerified,
    };
  }),

  getStats: protectedProcedure.input(orgIdInput.optional()).query(async ({ ctx, input }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId, input?.orgId);

    const opps = await prisma.opportunity.findMany({
      where: { orgProfileId },
    });

    const totalSpots = opps.reduce((s, o) => s + o.totalSpots, 0);
    const filledSpots = opps.reduce((s, o) => s + o.filledSpots, 0);

    const attendanceHours = await prisma.attendanceRecord.aggregate({
      where: {
        opportunity: { orgProfileId },
        verificationStatus: 'VERIFIED',
      },
      _sum: { hoursLogged: true },
    });
    const totalHours = Number(attendanceHours._sum.hoursLogged ?? 0);

    const volunteerIds = await prisma.application.findMany({
      where: { opportunity: { orgProfileId }, status: { in: ['APPROVED', 'PENDING'] } },
      select: { studentId: true },
      distinct: ['studentId'],
    });

    return {
      volunteersThisMonth: volunteerIds.length,
      totalHours: Math.round(totalHours),
      retentionRate: 0.68,
      avgRating: 0,
      activeListings: opps.filter(o => o.isPublished && !o.adminHidden).length,
      totalSpots,
      filledSpots,
    };
  }),

  listOpportunities: protectedProcedure.input(orgIdInput.optional()).query(async ({ ctx, input }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId, input?.orgId);

    const rows = await prisma.opportunity.findMany({
      where: { orgProfileId },
      include: { orgProfile: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    const ids = rows.map(r => r.id);
    const pendingGroups =
      ids.length === 0
        ? []
        : await prisma.application.groupBy({
            by: ['opportunityId'],
            where: { opportunityId: { in: ids }, status: 'PENDING' },
            _count: { _all: true },
          });
    const pendingMap = new Map(pendingGroups.map(g => [g.opportunityId, g._count._all]));

    return rows.map(o => ({
      ...toApiOpportunity(o),
      pendingApplicants: pendingMap.get(o.id) ?? 0,
    }));
  }),

  getApplicants: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const opp = await prisma.opportunity.findFirst({
        where: { id: input.opportunityId, orgProfileId },
      });
      if (!opp) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      const apps = await prisma.application.findMany({
        where: { opportunityId: input.opportunityId },
        include: {
          student: { include: { studentProfile: true } },
        },
        orderBy: { appliedAt: 'desc' },
      });

      return apps.map(app => {
        const sp = app.student.studentProfile;
        const name = [app.student.firstName, app.student.lastName].filter(Boolean).join(' ') || 'Volunteer';
        return {
          id: app.id,
          userId: app.student.clerkUserId,
          opportunityId: app.opportunityId,
          status: app.status,
          appliedAt: app.appliedAt.toISOString(),
          qrCodeData: app.qrCodeData,
          studentName: name,
          studentSchool: sp?.schoolName ?? '—',
          studentGrade: sp?.grade ?? 0,
          studentHours: sp ? Number(sp.totalVerifiedHours) : 0,
        };
      });
    }),

  reviewApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        decision: z.enum(['APPROVED', 'DECLINED', 'WAITLISTED']),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const appRow = await prisma.application.findFirst({
        where: { id: input.applicationId, opportunity: { orgProfileId } },
      });
      if (!appRow) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Application not found' });
      }

      const updated = await prisma.application.update({
        where: { id: input.applicationId },
        data: {
          status: input.decision,
          decidedAt: new Date(),
          decisionNote: input.note ?? null,
        },
      });

      await recalcOpportunityFilledSpots(appRow.opportunityId);

      return {
        id: updated.id,
        userId: ctx.userId,
        opportunityId: updated.opportunityId,
        status: updated.status,
        appliedAt: updated.appliedAt.toISOString(),
        qrCodeData: updated.qrCodeData,
      };
    }),

  getProfile: protectedProcedure.input(orgIdInput.optional()).query(async ({ ctx, input }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId, input?.orgId);
    const org = await prisma.orgProfile.findUniqueOrThrow({
      where: { id: orgProfileId },
      include: { user: true },
    });

    return {
      id: org.id,
      name: org.orgName,
      email: orgContactEmail(org, org.user),
      causeTags: org.causeTags,
      description: org.mission ?? '',
      status: deriveOrgModerationStatus(org),
      logo: org.logoUrl ?? '🌿',
    };
  }),

  listAllApplicants: protectedProcedure.input(orgIdInput.optional()).query(async ({ ctx, input }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId, input?.orgId);

    const apps = await prisma.application.findMany({
      where: { opportunity: { orgProfileId } },
      include: {
        student: { include: { studentProfile: true } },
        opportunity: true,
      },
      orderBy: { appliedAt: 'desc' },
      take: 200,
    });

    return apps.map(app => {
      const sp = app.student.studentProfile;
      const name = [app.student.firstName, app.student.lastName].filter(Boolean).join(' ') || 'Volunteer';
      return {
        id: app.student.id,
        firstName: app.student.firstName ?? name.split(' ')[0] ?? 'Volunteer',
        lastName: app.student.lastName ?? '',
        grade: sp?.grade ?? 0,
        totalHours: sp ? Number(sp.totalVerifiedHours) : 0,
        rating: 0,
        status: app.status,
        opportunityTitle: app.opportunity.title,
      };
    });
  }),

  createOpportunity: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        causeTags: z.array(z.string()).min(1),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        address: z.string().min(1),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        lat: z.number(),
        lng: z.number(),
        totalSpots: z.number().int().positive(),
        ageMinimum: z.number().int().optional(),
        creditEligible: z.boolean().default(false),
        whatToBring: z.array(z.string()).default([]),
        recurring: z.boolean().default(false),
        recurringRule: z.string().optional(),
        publish: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const start = new Date(input.startTime);
      const end = new Date(input.endTime);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid start or end time' });
      }

      const durationMs = end.getTime() - start.getTime();
      const durationHours = new Prisma.Decimal(Math.max(durationMs / 3_600_000, 0.25));

      const date = new Date(input.date);
      if (Number.isNaN(date.getTime())) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid date' });
      }

      const now = new Date();
      const row = await prisma.opportunity.create({
        data: {
          orgProfileId,
          title: input.title,
          description: input.description || 'Volunteer opportunity',
          causeTags: input.causeTags,
          date,
          startTime: start,
          endTime: end,
          durationHours,
          lat: new Prisma.Decimal(input.lat),
          lng: new Prisma.Decimal(input.lng),
          address: input.address,
          city: input.city ?? null,
          state: input.state ?? null,
          zipCode: input.zipCode ?? null,
          totalSpots: input.totalSpots,
          filledSpots: 0,
          ageMinimum: input.ageMinimum ?? null,
          creditEligible: input.creditEligible,
          whatToBring: input.whatToBring,
          recurring: input.recurring,
          recurringRule: input.recurringRule ?? null,
          isPublished: input.publish,
          publishedAt: input.publish ? now : null,
        },
        include: { orgProfile: true },
      });

      return toApiOpportunity(row);
    }),

  publishOpportunity: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const opp = await prisma.opportunity.findFirst({
        where: { id: input.opportunityId, orgProfileId },
      });
      if (!opp) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      const row = await prisma.opportunity.update({
        where: { id: input.opportunityId },
        data: {
          isPublished: true,
          publishedAt: new Date(),
          adminHidden: false,
        },
        include: { orgProfile: true },
      });

      return toApiOpportunity(row);
    }),

  ensureOrgProfile: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findUnique({ where: { clerkUserId: ctx.userId } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (user.role !== 'ORGANIZER') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Switch to an organizer account to manage organization profile.',
      });
    }
    const org = await ensureOrgProfileForOrganizer(user.id);
    return { orgId: org.id, slug: org.slug, orgName: org.orgName };
  }),

  listPendingAttendance: protectedProcedure.input(orgIdInput.optional()).query(async ({ ctx, input }) => {
    const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId, input?.orgId);

    const rows = await prisma.attendanceRecord.findMany({
      where: {
        verificationStatus: 'PENDING',
        opportunity: { orgProfileId },
      },
      include: {
        opportunity: true,
        student: { include: { studentProfile: true } },
      },
      orderBy: { checkinTime: 'desc' },
      take: 100,
    });

    return rows.map(r => {
      const name = [r.student.firstName, r.student.lastName].filter(Boolean).join(' ') || 'Volunteer';
      return {
        id: r.id,
        studentId: r.studentId,
        studentName: name,
        opportunityId: r.opportunityId,
        opportunityTitle: r.opportunity.title,
        checkinTime: r.checkinTime?.toISOString() ?? null,
        checkoutTime: r.checkoutTime?.toISOString() ?? null,
        hoursLogged: Number(r.hoursLogged),
        verificationStatus: r.verificationStatus,
      };
    });
  }),

  getAttendanceRecord: protectedProcedure
    .input(z.object({ attendanceRecordId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const row = await prisma.attendanceRecord.findFirst({
        where: {
          id: input.attendanceRecordId,
          opportunity: { orgProfileId },
        },
        include: {
          opportunity: true,
          student: { include: { studentProfile: true } },
        },
      });
      if (!row) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Attendance record not found' });
      }

      const name = [row.student.firstName, row.student.lastName].filter(Boolean).join(' ') || 'Volunteer';
      return {
        id: row.id,
        studentId: row.studentId,
        studentName: name,
        opportunityId: row.opportunityId,
        opportunityTitle: row.opportunity.title,
        checkinTime: row.checkinTime?.toISOString() ?? null,
        checkoutTime: row.checkoutTime?.toISOString() ?? null,
        hoursLogged: Number(row.hoursLogged),
        verificationStatus: row.verificationStatus,
      };
    }),
});
