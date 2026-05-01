import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from 'db';
import { router, protectedProcedure } from '../trpc';
import { getOrCreateStudentUser } from '../lib/student-user';

export const applicationRouter = router({
  apply: protectedProcedure
    .input(
      z.object({
        opportunityId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await getOrCreateStudentUser(ctx.userId);

      const opportunity = await prisma.opportunity.findFirst({
        where: {
          id: input.opportunityId,
          isPublished: true,
          orgProfile: { isVerified: true },
        },
      });
      if (!opportunity) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Opportunity not found' });
      }

      const existing = await prisma.application.findUnique({
        where: {
          studentId_opportunityId: {
            studentId: student.id,
            opportunityId: input.opportunityId,
          },
        },
      });
      if (existing) {
        return {
          id: existing.id,
          userId: ctx.userId,
          opportunityId: existing.opportunityId,
          status: existing.status,
          appliedAt: existing.appliedAt.toISOString(),
          qrCodeData: existing.qrCodeData,
        };
      }

      const qrCodeData = `hourly://checkin/${input.opportunityId}/${student.id}`;

      const created = await prisma.application.create({
        data: {
          studentId: student.id,
          opportunityId: input.opportunityId,
          qrCodeData,
        },
      });

      return {
        id: created.id,
        userId: ctx.userId,
        opportunityId: created.opportunityId,
        status: created.status,
        appliedAt: created.appliedAt.toISOString(),
        qrCodeData: created.qrCodeData,
      };
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const student = await getOrCreateStudentUser(ctx.userId);

    const rows = await prisma.application.findMany({
      where: { studentId: student.id },
      orderBy: { appliedAt: 'desc' },
    });

    return rows.map(a => ({
      id: a.id,
      userId: ctx.userId,
      opportunityId: a.opportunityId,
      status: a.status,
      appliedAt: a.appliedAt.toISOString(),
      qrCodeData: a.qrCodeData,
    }));
  }),
});
