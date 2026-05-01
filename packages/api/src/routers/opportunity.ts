import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from 'db';
import { router, publicProcedure } from '../trpc';
import { toApiOpportunity } from '../mappers/opportunity';
import { haversineDistanceMeters } from '../lib/geo';

const publishedWhere = {
  isPublished: true,
  adminHidden: false,
  orgProfile: { isVerified: true },
} as const;

export const opportunityRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          causes: z.array(z.string()).optional(),
          maxDistance: z.number().optional(),
          /** User location for `maxDistance` filtering (WGS84). */
          lat: z.number().optional(),
          lng: z.number().optional(),
          creditEligible: z.boolean().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const rows = await prisma.opportunity.findMany({
        where: {
          ...publishedWhere,
          ...(input?.creditEligible !== undefined
            ? { creditEligible: input.creditEligible }
            : {}),
          ...(input?.causes && input.causes.length > 0
            ? { causeTags: { hasSome: input.causes } }
            : {}),
          ...(input?.search
            ? {
                OR: [
                  { title: { contains: input.search, mode: 'insensitive' } },
                  { description: { contains: input.search, mode: 'insensitive' } },
                  { orgProfile: { orgName: { contains: input.search, mode: 'insensitive' } } },
                ],
              }
            : {}),
        },
        include: { orgProfile: true },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        take: 200,
      });

      let mapped = rows.map(toApiOpportunity);

      if (
        input?.maxDistance !== undefined &&
        input.lat !== undefined &&
        input.lng !== undefined
      ) {
        mapped = mapped
          .map(opp => {
            const distance = haversineDistanceMeters(
              input.lat!,
              input.lng!,
              opp.location.lat,
              opp.location.lng
            );
            return { ...opp, distance };
          })
          .filter(opp => (opp.distance ?? 0) <= input.maxDistance!);
      }

      return mapped;
    }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const row = await prisma.opportunity.findFirst({
      where: {
        id: input.id,
        ...publishedWhere,
      },
      include: { orgProfile: true },
    });
    if (!row) {
      throw new TRPCError({ code: 'NOT_FOUND', message: `Opportunity not found: ${input.id}` });
    }
    return toApiOpportunity(row);
  }),
});
