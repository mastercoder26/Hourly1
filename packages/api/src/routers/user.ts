import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from 'db';
import { mockUsers, UserProfile, mockOpportunities } from '../mock-data';
import { findUserWithStudentByClerk, profileFromDbUser } from '../lib/user-profile-db';

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
  me: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      return profileFromDbUser(dbRow);
    }

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

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      return profileFromDbUser(dbRow);
    }

    const user = users.find(u => u.id === ctx.userId);
    if (!user) {
      throw new Error(`User not found: ${ctx.userId}`);
    }
    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        school: z.string().optional(),
        grade: z.number().optional(),
        interests: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dbRow = await findUserWithStudentByClerk(ctx.userId);
      if (dbRow) {
        const userUpdate: { firstName?: string; lastName?: string } = {};
        if (input.firstName !== undefined) {
          userUpdate.firstName = input.firstName;
        }
        if (input.lastName !== undefined) {
          userUpdate.lastName = input.lastName;
        }
        if (Object.keys(userUpdate).length > 0) {
          await prisma.user.update({
            where: { id: dbRow.id },
            data: userUpdate,
          });
        }

        if (dbRow.role === 'STUDENT') {
          const profileCreate = {
            userId: dbRow.id,
            schoolName: input.school ?? 'Unknown School',
            grade: input.grade ?? 0,
            interests: input.interests ?? [],
          };
          const profileUpdate: {
            schoolName?: string;
            grade?: number;
            interests?: string[];
          } = {};
          if (input.school !== undefined) {
            profileUpdate.schoolName = input.school;
          }
          if (input.grade !== undefined) {
            profileUpdate.grade = input.grade;
          }
          if (input.interests !== undefined) {
            profileUpdate.interests = input.interests;
          }

          await prisma.studentProfile.upsert({
            where: { userId: dbRow.id },
            create: profileCreate,
            update: profileUpdate,
          });
        }

        const fresh = await findUserWithStudentByClerk(ctx.userId);
        if (!fresh) {
          throw new Error(`User not found after update: ${ctx.userId}`);
        }
        return profileFromDbUser(fresh);
      }

      const index = users.findIndex(u => u.id === ctx.userId);
      if (index === -1) {
        throw new Error(`User not found: ${ctx.userId}`);
      }
      users[index] = { ...users[index], ...input };
      return users[index];
    }),

  getAttendance: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      const records = await prisma.attendanceRecord.findMany({
        where: { studentId: dbRow.id },
        include: { opportunity: { include: { orgProfile: true } } },
        orderBy: { checkinTime: 'desc' },
      });
      return records.map(r => ({
        id: r.id,
        studentId: ctx.userId,
        opportunityId: r.opportunityId,
        checkinTime: r.checkinTime?.toISOString() ?? '',
        checkoutTime: r.checkoutTime?.toISOString() ?? '',
        hoursLogged: Number(r.hoursLogged),
        verificationStatus: r.verificationStatus,
        opportunityTitle: r.opportunity?.title ?? 'Unknown Shift',
        orgName: r.opportunity?.orgProfile?.orgName ?? 'Unknown Org',
        orgLogo: '🌿',
      }));
    }

    return mockAttendance
      .filter(a => a.studentId === ctx.userId || a.studentId === 'user-001')
      .map(record => {
        const opp = mockOpportunities.find(o => o.id === record.opportunityId);
        return {
          ...record,
          opportunityTitle: opp?.title ?? 'Unknown Shift',
          orgName: opp?.orgName ?? 'Unknown Org',
          orgLogo: '🌿',
        };
      });
  }),

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      const unlocks = await prisma.badgeUnlock.findMany({
        where: { userId: dbRow.id },
        include: { badge: true },
        orderBy: { unlockedAt: 'desc' },
      });
      return unlocks.map((u, i) => ({
        type: u.badge.key,
        label: u.badge.label,
        description: u.badge.description,
        icon: u.badge.icon ?? '⭐',
        earnedAt: u.unlockedAt.toISOString().slice(0, 10),
        isNew: i === 0,
      }));
    }

    return mockBadges;
  }),

  getPortfolioStats: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      const attendance = await prisma.attendanceRecord.findMany({
        where: { studentId: dbRow.id },
      });
      const verifiedHours = attendance
        .filter(a => a.verificationStatus === 'VERIFIED')
        .reduce((sum, a) => sum + Number(a.hoursLogged), 0);
      const uniqueShifts = new Set(attendance.map(a => a.opportunityId)).size;
      const earnedBadges = await prisma.badgeUnlock.count({ where: { userId: dbRow.id } });
      const pendingHours = attendance
        .filter(a => a.verificationStatus === 'PENDING')
        .reduce((sum, a) => sum + Number(a.hoursLogged), 0);

      return {
        totalVerifiedHours: verifiedHours,
        totalShifts: uniqueShifts,
        earnedBadges,
        pendingHours,
      };
    }

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
