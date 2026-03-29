import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { mockApplications, Application } from '../mock-data';

const applications: Application[] = [...mockApplications];

export const applicationRouter = router({
  apply: protectedProcedure
    .input(
      z.object({
        opportunityId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const existing = applications.find(
        a => a.opportunityId === input.opportunityId && a.userId === ctx.userId
      );
      if (existing) {
        return existing;
      }

      const application: Application = {
        id: `app-${Date.now()}`,
        userId: ctx.userId,
        opportunityId: input.opportunityId,
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
        qrCodeData: `hourly://checkin/${input.opportunityId}/${ctx.userId}`,
      };

      applications.push(application);
      return application;
    }),

  listMine: protectedProcedure.query(({ ctx }) => {
    return applications.filter(a => a.userId === ctx.userId);
  }),

  // Legacy route kept temporarily while screens migrate.
  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return applications.filter(a => a.userId === input.userId);
    }),
});
