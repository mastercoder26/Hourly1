import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { mockOpportunities, mockApplications, mockOrganizations, mockUsers } from '../mock-data';

// Mock applicant data for the org applicants tab
const mockApplicantsList = [
  { id: 'stu-001', firstName: 'Alex', lastName: 'R.', grade: 11, totalHours: 47.5, rating: 4.9, status: 'APPROVED' as const },
  { id: 'stu-002', firstName: 'Jordan', lastName: 'T.', grade: 10, totalHours: 23, rating: 4.5, status: 'APPROVED' as const },
  { id: 'stu-003', firstName: 'Mia', lastName: 'C.', grade: 12, totalHours: 89, rating: 5.0, status: 'PENDING' as const },
  { id: 'stu-004', firstName: 'Ethan', lastName: 'P.', grade: 11, totalHours: 15, rating: 4.2, status: 'PENDING' as const },
  { id: 'stu-005', firstName: 'Sophia', lastName: 'K.', grade: 9, totalHours: 8, rating: 0, status: 'WAITLISTED' as const },
  { id: 'stu-006', firstName: 'Liam', lastName: 'W.', grade: 10, totalHours: 31, rating: 4.7, status: 'DECLINED' as const },
];

export const orgRouter = router({
  // Get stats for an org dashboard
  getStats: protectedProcedure
    .input(z.object({ orgId: z.string() }).optional())
    .query(({ ctx, input }) => {
      // In a real app, we'd look up the org by the user's profile.
      // For now, we'll use the provided orgId or default to org-001.
      const orgId = input?.orgId ?? 'org-001';

      const orgOpportunities = mockOpportunities.filter(opp => opp.orgId === orgId);
      const totalSpots = orgOpportunities.reduce((sum, opp) => sum + opp.totalSpots, 0);
      const filledSpots = orgOpportunities.reduce((sum, opp) => sum + opp.filledSpots, 0);
      const totalHours = orgOpportunities.reduce((sum, opp) => sum + opp.durationHours * opp.filledSpots, 0);

      // Count unique volunteers from applications
      const orgOppIds = new Set(orgOpportunities.map(opp => opp.id));
      const orgApplications = mockApplications.filter(app => orgOppIds.has(app.opportunityId));
      const uniqueVolunteers = new Set(orgApplications.map(app => app.userId)).size;

      // Calculate average rating
      const ratingsCount = orgOpportunities.filter(opp => opp.rating !== undefined).length;
      const avgRating = ratingsCount > 0
        ? orgOpportunities.reduce((sum, opp) => sum + (opp.rating ?? 0), 0) / ratingsCount
        : 0;

      // Mock retention rate - in reality this would be calculated from attendance data
      const retentionRate = 0.68;

      return {
        volunteersThisMonth: uniqueVolunteers > 0 ? uniqueVolunteers : filledSpots,
        totalHours: Math.round(totalHours),
        retentionRate,
        avgRating: Math.round(avgRating * 10) / 10,
        activeListings: orgOpportunities.filter(opp => (opp.postStatus ?? 'VISIBLE') === 'VISIBLE').length,
        totalSpots,
        filledSpots,
      };
    }),

  // List opportunities for an org
  listOpportunities: protectedProcedure
    .input(z.object({ orgId: z.string() }).optional())
    .query(({ ctx, input }) => {
      const orgId = input?.orgId ?? 'org-001';

      return mockOpportunities
        .filter(opp => opp.orgId === orgId && (opp.postStatus ?? 'VISIBLE') === 'VISIBLE')
        .map(opp => {
          // Count pending applicants for this opportunity
          const pendingApplicants = mockApplications.filter(
            app => app.opportunityId === opp.id && app.status === 'PENDING'
          ).length;

          return {
            ...opp,
            pendingApplicants,
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }),

  // Get applicants for an opportunity
  getApplicants: protectedProcedure
    .input(z.object({ opportunityId: z.string() }))
    .query(({ input }) => {
      const applications = mockApplications.filter(app => app.opportunityId === input.opportunityId);

      return applications.map(app => ({
        ...app,
        // In a real app, we'd join with user data
        studentName: 'Alex Rivera',
        studentSchool: 'Austin High School',
        studentGrade: 11,
        studentHours: 24,
      }));
    }),

  // Review an application (approve/decline)
  reviewApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        decision: z.enum(['APPROVED', 'DECLINED', 'WAITLISTED']),
        note: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const application = mockApplications.find(app => app.id === input.applicationId);
      if (!application) {
        throw new Error(`Application not found: ${input.applicationId}`);
      }

      application.status = input.decision;
      return application;
    }),

  // Get org profile
  getProfile: protectedProcedure
    .input(z.object({ orgId: z.string() }).optional())
    .query(({ input }) => {
      const orgId = input?.orgId ?? 'org-001';
      const org = mockOrganizations.find(o => o.id === orgId);

      if (!org) {
        throw new Error(`Organization not found: ${orgId}`);
      }

      return {
        id: org.id,
        name: org.name,
        email: org.contactEmail,
        causeTags: org.causeTags,
        description: org.description,
        status: org.status,
        logo: '🌿', // Mock logo
      };
    }),

  // List all applicants across all org opportunities
  listAllApplicants: protectedProcedure
    .input(z.object({ orgId: z.string() }).optional())
    .query(({ input }) => {
      // In a real app, we'd filter by org. For now return the mock list.
      return mockApplicantsList;
    }),
});
