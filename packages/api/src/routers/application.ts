import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { mockApplications, Application } from '../mock-data';

const applications: Application[] = [...mockApplications];

export const applicationRouter = router({
  apply: publicProcedure
    .input(
      z.object({
        opportunityId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ input }) => {
      const existing = applications.find(
        a => a.opportunityId === input.opportunityId && a.userId === input.userId
      );
      if (existing) {
        return existing;
      }

      const application: Application = {
        id: `app-${Date.now()}`,
        userId: input.userId,
        opportunityId: input.opportunityId,
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
        qrCodeData: `hourly://checkin/${input.opportunityId}/${input.userId}`,
      };

      applications.push(application);
      return application;
    }),

  listByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return applications.filter(a => a.userId === input.userId);
    }),
});
