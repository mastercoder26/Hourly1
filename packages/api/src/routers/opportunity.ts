import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from 'db';
import { router, publicProcedure } from '../trpc';
import { toApiOpportunity } from '../mappers/opportunity';

const publishedWhere = {
  isPublished: true,
  orgProfile: { isVerified: true },
} as const;

export const opportunityRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          causes: z.array(z.string()).optional(),
          maxDistance: z.number().optional(),
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

      return rows.map(toApiOpportunity);
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
