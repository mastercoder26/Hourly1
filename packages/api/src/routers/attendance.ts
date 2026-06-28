import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Prisma } from 'db';
import { prisma } from 'db';
import { router, protectedProcedure } from '../trpc';
import { getOrCreateStudentUser } from '../lib/student-user';
import { resolveWritableOrgProfileId } from '../lib/organizer-user';
import { parseHourlyCheckInQr } from '../lib/qr-parse';
import { haversineDistanceMeters } from '../lib/geo';
import { syncStudentVerifiedHoursFromAttendance, recalcOpportunityFilledSpots } from '../lib/student-stats';

/** Geofence radius for student GPS self check-in (meters). */
const GPS_CHECK_IN_RADIUS_M = 120;

async function upsertCheckInRecord(params: {
  studentId: string;
  opportunityId: string;
  applicationId: string;
  checkinTime: Date;
}): Promise<void> {
  await prisma.attendanceRecord.upsert({
    where: { applicationId: params.applicationId },
    create: {
      studentId: params.studentId,
      opportunityId: params.opportunityId,
      applicationId: params.applicationId,
      checkinTime: params.checkinTime,
      hoursLogged: new Prisma.Decimal(0),
      verificationStatus: 'PENDING',
    },
    update: {
      checkinTime: params.checkinTime,
    },
  });
}

export const attendanceRouter = router({
  /**
   * Organizer scans student QR (`hourly://checkin/...`) and records check-in.
   */
  checkInByQr: protectedProcedure
    .input(z.object({ raw: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const parsed = parseHourlyCheckInQr(input.raw);
      if (!parsed) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid QR code' });
      }

      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const opportunity = await prisma.opportunity.findFirst({
        where: { id: parsed.opportunityId, orgProfileId },
        include: { orgProfile: true },
      });
      if (!opportunity) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found for this organization' });
      }

      const application = await prisma.application.findFirst({
        where: {
          studentId: parsed.studentId,
          opportunityId: parsed.opportunityId,
          status: 'APPROVED',
        },
      });
      if (!application) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No approved application found for this volunteer and shift',
        });
      }

      const now = new Date();
      await upsertCheckInRecord({
        studentId: parsed.studentId,
        opportunityId: parsed.opportunityId,
        applicationId: application.id,
        checkinTime: now,
      });

      return {
        success: true as const,
        studentId: parsed.studentId,
        opportunityId: parsed.opportunityId,
        checkinTime: now.toISOString(),
      };
    }),

  /**
   * Student self check-in when within geofence of the opportunity coordinates.
   */
  checkInByGps: protectedProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await getOrCreateStudentUser(ctx.userId);

      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: input.opportunityId,
          isPublished: true,
          adminHidden: false,
          orgProfile: { isVerified: true },
        },
      });
      if (!opportunity) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      const application = await prisma.application.findFirst({
        where: {
          studentId: student.id,
          opportunityId: input.opportunityId,
          status: 'APPROVED',
        },
      });
      if (!application) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You need an approved application to check in',
        });
      }

      const oppLat = Number(opportunity.lat);
      const oppLng = Number(opportunity.lng);
      const distance = haversineDistanceMeters(input.lat, input.lng, oppLat, oppLng);
      if (distance > GPS_CHECK_IN_RADIUS_M) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `You are about ${Math.round(distance)}m from the event location. Move within ${GPS_CHECK_IN_RADIUS_M}m to check in.`,
        });
      }

      const now = new Date();
      await upsertCheckInRecord({
        studentId: student.id,
        opportunityId: input.opportunityId,
        applicationId: application.id,
        checkinTime: now,
      });

      return {
        success: true as const,
        checkinTime: now.toISOString(),
        distanceMeters: Math.round(distance),
      };
    }),

  /** Student self check-in without GPS/QR (requires approved application). */
  checkInSimple: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const student = await getOrCreateStudentUser(ctx.userId);

      const application = await prisma.application.findFirst({
        where: {
          studentId: student.id,
          opportunityId: input.opportunityId,
          status: 'APPROVED',
        },
      });
      if (!application) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You need an approved application to check in',
        });
      }

      const now = new Date();
      const record = await prisma.attendanceRecord.upsert({
        where: { applicationId: application.id },
        create: {
          studentId: student.id,
          opportunityId: input.opportunityId,
          applicationId: application.id,
          checkinTime: now,
          hoursLogged: new Prisma.Decimal(0),
          verificationStatus: 'PENDING',
        },
        update: { checkinTime: now },
      });

      return {
        id: record.id,
        attendanceRecordId: record.id,
        opportunityId: input.opportunityId,
        checkinTime: now.toISOString(),
      };
    }),

  checkOut: protectedProcedure
    .input(
      z
        .object({
          opportunityId: z.string().optional(),
          attendanceRecordId: z.string().optional(),
        })
        .refine(data => Boolean(data.opportunityId || data.attendanceRecordId), {
          message: 'Provide opportunityId or attendanceRecordId',
        })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await getOrCreateStudentUser(ctx.userId);

      const record = input.attendanceRecordId
        ? await prisma.attendanceRecord.findFirst({
            where: { id: input.attendanceRecordId, studentId: student.id },
          })
        : await prisma.attendanceRecord.findFirst({
            where: { studentId: student.id, opportunityId: input.opportunityId! },
            orderBy: { updatedAt: 'desc' },
          });
      if (!record || !record.checkinTime) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active check-in for this shift' });
      }

      const opportunity = await prisma.opportunity.findUniqueOrThrow({
        where: { id: record.opportunityId },
      });
      const end = opportunity.endTime;
      const checkoutTime = new Date();
      const effectiveEnd = checkoutTime > end ? end : checkoutTime;
      const hoursMs = Math.max(effectiveEnd.getTime() - record.checkinTime.getTime(), 0);
      const hours = new Prisma.Decimal(Math.min(hoursMs / 3_600_000, Number(opportunity.durationHours)));

      await prisma.attendanceRecord.update({
        where: { id: record.id },
        data: {
          checkoutTime,
          hoursLogged: hours,
        },
      });

      return {
        success: true as const,
        id: record.id,
        attendanceRecordId: record.id,
        opportunityId: record.opportunityId,
        checkoutTime: checkoutTime.toISOString(),
        hoursLogged: Number(hours),
      };
    }),

  verifyHours: protectedProcedure
    .input(
      z.object({
        attendanceRecordId: z.string(),
        hoursOverride: z.number().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const record = await prisma.attendanceRecord.findFirst({
        where: {
          id: input.attendanceRecordId,
          opportunity: { orgProfileId },
        },
        include: { opportunity: true },
      });
      if (!record) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Attendance record not found' });
      }

      const hours =
        input.hoursOverride !== undefined
          ? new Prisma.Decimal(input.hoursOverride)
          : Number(record.hoursLogged) > 0
            ? record.hoursLogged
            : record.opportunity.durationHours;

      const updated = await prisma.attendanceRecord.update({
        where: { id: record.id },
        data: {
          verificationStatus: 'VERIFIED',
          verifiedByOrgId: orgProfileId,
          hoursLogged: hours,
          verificationNote: null,
        },
      });

      await syncStudentVerifiedHoursFromAttendance(record.studentId);
      await recalcOpportunityFilledSpots(record.opportunityId);

      return {
        id: updated.id,
        verificationStatus: updated.verificationStatus,
        hoursLogged: Number(updated.hoursLogged),
      };
    }),

  /** Organizer: list attendance rows for an opportunity (roster / verify flow). */
  listForOpportunity: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { orgProfileId } = await resolveWritableOrgProfileId(ctx.userId);

      const opp = await prisma.opportunity.findFirst({
        where: { id: input.opportunityId, orgProfileId },
      });
      if (!opp) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      const rows = await prisma.attendanceRecord.findMany({
        where: { opportunityId: input.opportunityId },
        include: { student: { include: { studentProfile: true } } },
        orderBy: { checkinTime: 'desc' },
      });

      return rows.map(r => ({
        id: r.id,
        studentId: r.studentId,
        studentClerkId: r.student.clerkUserId,
        studentName: [r.student.firstName, r.student.lastName].filter(Boolean).join(' ') || 'Volunteer',
        checkinTime: r.checkinTime?.toISOString() ?? null,
        checkoutTime: r.checkoutTime?.toISOString() ?? null,
        hoursLogged: Number(r.hoursLogged),
        verificationStatus: r.verificationStatus,
      }));
    }),
});
