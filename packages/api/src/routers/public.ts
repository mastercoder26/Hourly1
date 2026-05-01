import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { prisma } from 'db';
import { router, publicProcedure } from '../trpc';

export const publicRouter = router({
  orgBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const slug = decodeURIComponent(input.slug.trim());
    const org = await prisma.orgProfile.findUnique({
      where: { slug },
      include: {
        opportunities: {
          where: { isPublished: true, adminHidden: false },
          select: { id: true },
        },
      },
    });
    if (!org) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Organization not found' });
    }

    const verifiedHours = await prisma.attendanceRecord.aggregate({
      where: {
        verificationStatus: 'VERIFIED',
        opportunity: { orgProfileId: org.id },
      },
      _sum: { hoursLogged: true },
    });

    const volunteerCount = await prisma.application.findMany({
      where: { opportunity: { orgProfileId: org.id }, status: 'APPROVED' },
      select: { studentId: true },
      distinct: ['studentId'],
    });

    return {
      slug: org.slug,
      name: org.orgName,
      verified: org.isVerified,
      mission: org.mission ?? '',
      causeTags: org.causeTags,
      logoUrl: org.logoUrl ?? '🌿',
      totalVolunteers: volunteerCount.length,
      totalHours: Number(verifiedHours._sum.hoursLogged ?? 0),
      activeListings: org.opportunities.length,
      rating: 0,
      ratingCount: 0,
    };
  }),

  portfolioBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const slug = decodeURIComponent(input.slug.trim());
    const profile = await prisma.studentProfile.findFirst({
      where: { publicSlug: slug, isPublicPortfolio: true },
      include: { user: true },
    });
    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Portfolio not found or not public' });
    }

    const verified = await prisma.attendanceRecord.findMany({
      where: { studentId: profile.userId, verificationStatus: 'VERIFIED' },
      include: { opportunity: { include: { orgProfile: true } } },
    });

    const totalVerifiedHours = verified.reduce((s, a) => s + Number(a.hoursLogged), 0);
    const orgsServed = new Set(verified.map(a => a.opportunity.orgProfileId)).size;
    const causes = new Set<string>();
    verified.forEach(a => {
      a.opportunity.causeTags.forEach(c => causes.add(c));
    });

    const display =
      profile.user.firstName && profile.user.lastName
        ? `${profile.user.firstName[0]}. ${profile.user.lastName[0]}.`
        : 'Student';

    return {
      displayLabel: display,
      totalVerifiedHours,
      orgsServed,
      primaryCauses: Array.from(causes).slice(0, 6),
    };
  }),
});
