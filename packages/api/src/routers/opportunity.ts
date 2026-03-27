import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { mockOpportunities } from '../mock-data';

export const opportunityRouter = router({
  list: publicProcedure
    .input(
      z.object({
        causes: z.array(z.string()).optional(),
        maxDistance: z.number().optional(),
        creditEligible: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => {
      let results = [...mockOpportunities];

      if (input?.creditEligible) {
        results = results.filter(o => o.creditEligible);
      }
      if (input?.causes && input.causes.length > 0) {
        results = results.filter(o => o.causeTags.some(t => input.causes!.includes(t)));
      }
      if (input?.maxDistance !== undefined) {
        results = results.filter(o => o.distance === undefined || o.distance <= input.maxDistance!);
      }
      if (input?.search) {
        const q = input.search.toLowerCase();
        results = results.filter(
          o =>
            o.title.toLowerCase().includes(q) ||
            o.description.toLowerCase().includes(q) ||
            o.orgName.toLowerCase().includes(q)
        );
      }

      return results;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const opportunity = mockOpportunities.find(o => o.id === input.id);
      if (!opportunity) {
        throw new Error(`Opportunity not found: ${input.id}`);
      }
      return opportunity;
    }),
});
