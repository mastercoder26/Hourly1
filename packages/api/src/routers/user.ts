import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { mockUsers, UserProfile, mockOpportunities } from '../mock-data';

const users: UserProfile[] = [...mockUsers];

// Mock attendance data
const mockAttendance = [
  { id: 'att-001', studentId: 'user-001', opportunityId: 'opp-001', checkinTime: '2026-03-01T09:02:00Z', checkoutTime: '2026-03-01T12:05:00Z', hoursLogged: 3, verificationStatus: 'VERIFIED' as const },
  { id: 'att-002', studentId: 'user-001', opportunityId: 'opp-002', checkinTime: '2026-03-08T10:00:00Z', checkoutTime: '2026-03-08T14:10:00Z', hoursLogged: 4, verificationStatus: 'VERIFIED' as const },
  { id: 'att-003', studentId: 'user-001', opportunityId: 'opp-003', checkinTime: '2026-03-10T15:30:00Z', checkoutTime: '2026-03-10T17:35:00Z', hoursLogged: 2, verificationStatus: 'VERIFIED' as const },
  { id: 'att-004', studentId: 'user-001', opportunityId: 'opp-004', checkinTime: '2026-03-12T08:00:00Z', checkoutTime: '2026-03-12T11:00:00Z', hoursLogged: 3, verificationStatus: 'VERIFIED' as const },
  { id: 'att-005', studentId: 'user-001', opportunityId: 'opp-005', checkinTime: '2026-03-14T14:00:00Z', checkoutTime: '2026-03-14T16:00:00Z', hoursLogged: 2, verificationStatus: 'VERIFIED' as const },
  { id: 'att-006', studentId: 'user-001', opportunityId: 'opp-006', checkinTime: '2026-03-19T08:00:00Z', checkoutTime: '2026-03-19T13:00:00Z', hoursLogged: 5, verificationStatus: 'PENDING' as const },
];

// Mock badges data
const mockBadges = [
  { type: 'first-shift', label: 'First shift', description: 'Completed your very first volunteer shift', icon: '🌟', earnedAt: '2026-03-01', isNew: false },
  { type: '10-hours', label: '10 hours', description: 'Logged 10 verified volunteer hours', icon: '⏱️', earnedAt: '2026-03-10', isNew: false },
  { type: '25-hours', label: '25 hours', description: 'Logged 25 verified volunteer hours', icon: '🔥', earnedAt: '2026-03-14', isNew: true },
  { type: '50-hours', label: '50 hours', description: 'Logged 50 verified volunteer hours', icon: '🏆', earnedAt: undefined, isNew: false },
  { type: '100-hours', label: '100 hours', description: 'Logged 100 verified volunteer hours', icon: '💎', earnedAt: undefined, isNew: false },
  { type: '5-orgs', label: '5 organizations', description: 'Volunteered with 5 different organizations', icon: '🤝', earnedAt: undefined, isNew: false },
  { type: '1-year-streak', label: '1 year streak', description: 'Volunteered at least once every month for a year', icon: '👑', earnedAt: undefined, isNew: false },
];

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    let user = users.find(u => u.id === ctx.userId);

    if (!user) {
      user = {
        id: ctx.userId,
        firstName: 'Hourly',
        lastName: 'User',
        email: 'user@hourly.local',
        school: 'Unknown School',
        grade: 0,
        interests: [],
        totalHours: 0,
      };
      users.push(user);
    }

    return user;
  }),

  // Legacy route kept temporarily while screens migrate.
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      const user = users.find(u => u.id === input.userId);
      if (!user) {
        throw new Error(`User not found: ${input.userId}`);
      }
      return user;
    }),

  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        school: z.string().optional(),
        grade: z.number().optional(),
        interests: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) => {
      const { userId, ...updates } = input;
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) {
        throw new Error(`User not found: ${userId}`);
      }
      users[index] = { ...users[index], ...updates };
      return users[index];
    }),

  // Get attendance records for portfolio
  getAttendance: protectedProcedure.query(({ ctx }) => {
    // Return attendance with opportunity details
    return mockAttendance
      .filter(a => a.studentId === ctx.userId || a.studentId === 'user-001')
      .map(record => {
        const opp = mockOpportunities.find(o => o.id === record.opportunityId);
        return {
          ...record,
          opportunityTitle: opp?.title ?? 'Unknown Shift',
          orgName: opp?.orgName ?? 'Unknown Org',
          orgLogo: '🌿', // Default logo
        };
      });
  }),

  // Get badges for portfolio
  getBadges: protectedProcedure.query(({ ctx }) => {
    return mockBadges;
  }),

  // Get portfolio summary stats
  getPortfolioStats: protectedProcedure.query(({ ctx }) => {
    const attendance = mockAttendance.filter(
      a => a.studentId === ctx.userId || a.studentId === 'user-001'
    );
    const verifiedHours = attendance
      .filter(a => a.verificationStatus === 'VERIFIED')
      .reduce((sum, a) => sum + a.hoursLogged, 0);
    const uniqueShifts = new Set(attendance.map(a => a.opportunityId)).size;
    const earnedBadges = mockBadges.filter(b => b.earnedAt).length;

    return {
      totalVerifiedHours: verifiedHours,
      totalShifts: uniqueShifts,
      earnedBadges,
      pendingHours: attendance
        .filter(a => a.verificationStatus === 'PENDING')
        .reduce((sum, a) => sum + a.hoursLogged, 0),
    };
  }),
});
