import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from 'db';
import { mockUsers, UserProfile } from '../mock-data';
import { findUserWithStudentByClerk, profileFromDbUser } from '../lib/user-profile-db';
import { getOrCreateStudentUser } from '../lib/student-user';
import { getOrCreateOrganizerUser, ensureOrgProfileForOrganizer } from '../lib/organizer-user';

const users: UserProfile[] = [...mockUsers];

const emptyPortfolioStats = {
  totalVerifiedHours: 0,
  totalShifts: 0,
  earnedBadges: 0,
  badgesEarned: 0,
  orgsServed: 0,
  pendingHours: 0,
  publicSlug: null as string | null,
};

export const userRouter = router({
  syncFromClerk: protectedProcedure
    .input(
      z.object({
        role: z.enum(['student', 'organizer']).optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const desiredRole = input.role ?? 'student';

      if (desiredRole === 'organizer') {
        const user = await getOrCreateOrganizerUser(ctx.userId);
        const updates: { firstName?: string; lastName?: string; email?: string } = {};
        if (input.firstName !== undefined) updates.firstName = input.firstName;
        if (input.lastName !== undefined) updates.lastName = input.lastName;
        if (input.email !== undefined) updates.email = input.email;
        if (Object.keys(updates).length > 0) {
          await prisma.user.update({ where: { id: user.id }, data: updates });
        }
        await ensureOrgProfileForOrganizer(user.id);
      } else {
        const user = await getOrCreateStudentUser(ctx.userId);
        const updates: { firstName?: string; lastName?: string; email?: string } = {};
        if (input.firstName !== undefined) updates.firstName = input.firstName;
        if (input.lastName !== undefined) updates.lastName = input.lastName;
        if (input.email !== undefined) updates.email = input.email;
        if (Object.keys(updates).length > 0) {
          await prisma.user.update({ where: { id: user.id }, data: updates });
        }
        await prisma.studentProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            schoolName: 'Unknown School',
            grade: 0,
            interests: [],
            availabilityDays: [],
          },
          update: {},
        });
      }

      const fresh = await findUserWithStudentByClerk(ctx.userId);
      if (!fresh) {
        throw new Error(`User not found after sync: ${ctx.userId}`);
      }
      return profileFromDbUser(fresh);
    }),

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
        schoolId: z.string().optional(),
        grade: z.number().int().optional(),
        interests: z.array(z.string()).optional(),
        availabilityDays: z.array(z.string()).optional(),
        zipCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let dbRow = await findUserWithStudentByClerk(ctx.userId);
      if (!dbRow) {
        await getOrCreateStudentUser(ctx.userId);
        dbRow = await findUserWithStudentByClerk(ctx.userId);
      }

      if (dbRow) {
        const userUpdate: { firstName?: string; lastName?: string } = {};
        if (input.firstName !== undefined) userUpdate.firstName = input.firstName;
        if (input.lastName !== undefined) userUpdate.lastName = input.lastName;
        if (Object.keys(userUpdate).length > 0) {
          await prisma.user.update({ where: { id: dbRow.id }, data: userUpdate });
        }

        if (dbRow.role === 'STUDENT') {
          let schoolName = input.school;
          if (input.schoolId) {
            const school = await prisma.schoolLookup.findUnique({ where: { id: input.schoolId } });
            if (school) {
              schoolName = school.name;
            }
          }

          const profileCreate = {
            userId: dbRow.id,
            schoolId: input.schoolId ?? null,
            schoolName: schoolName ?? 'Unknown School',
            grade: input.grade ?? 0,
            interests: input.interests ?? [],
            availabilityDays: input.availabilityDays ?? [],
            zipCode: input.zipCode ?? null,
          };
          const profileUpdate: {
            schoolId?: string | null;
            schoolName?: string;
            grade?: number;
            interests?: string[];
            availabilityDays?: string[];
            zipCode?: string | null;
          } = {};
          if (input.schoolId !== undefined) profileUpdate.schoolId = input.schoolId;
          if (schoolName !== undefined) profileUpdate.schoolName = schoolName;
          if (input.school !== undefined && !input.schoolId) profileUpdate.schoolName = input.school;
          if (input.grade !== undefined) profileUpdate.grade = input.grade;
          if (input.interests !== undefined) profileUpdate.interests = input.interests;
          if (input.availabilityDays !== undefined) profileUpdate.availabilityDays = input.availabilityDays;
          if (input.zipCode !== undefined) profileUpdate.zipCode = input.zipCode;

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
      users[index] = {
        ...users[index],
        ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
        ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
        ...(input.school !== undefined ? { school: input.school } : {}),
        ...(input.grade !== undefined ? { grade: input.grade } : {}),
        ...(input.interests !== undefined ? { interests: input.interests } : {}),
      };
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

    return [];
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

    return [];
  }),

  getPortfolioStats: protectedProcedure.query(async ({ ctx }) => {
    const dbRow = await findUserWithStudentByClerk(ctx.userId);
    if (dbRow) {
      const attendance = await prisma.attendanceRecord.findMany({
        where: { studentId: dbRow.id },
        include: { opportunity: true },
      });
      const verified = attendance.filter(a => a.verificationStatus === 'VERIFIED');
      const verifiedHours = verified.reduce((sum, a) => sum + Number(a.hoursLogged), 0);
      const uniqueShifts = new Set(attendance.map(a => a.opportunityId)).size;
      const orgsServed = new Set(verified.map(a => a.opportunity.orgProfileId)).size;
      const earnedBadges = await prisma.badgeUnlock.count({ where: { userId: dbRow.id } });
      const pendingHours = attendance
        .filter(a => a.verificationStatus === 'PENDING')
        .reduce((sum, a) => sum + Number(a.hoursLogged), 0);

      return {
        totalVerifiedHours: verifiedHours,
        totalShifts: uniqueShifts,
        earnedBadges,
        badgesEarned: earnedBadges,
        orgsServed,
        pendingHours,
        publicSlug: dbRow.studentProfile?.publicSlug ?? null,
      };
    }

    return emptyPortfolioStats;
  }),
});
