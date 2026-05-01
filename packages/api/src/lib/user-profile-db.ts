import { prisma, Prisma } from 'db';
import type { UserProfile } from '../mock-data';

export type UserWithStudent = Prisma.UserGetPayload<{ include: { studentProfile: true } }>;

export function profileFromDbUser(row: UserWithStudent): UserProfile {
  const sp = row.studentProfile;
  return {
    id: row.clerkUserId,
    firstName: row.firstName ?? 'Hourly',
    lastName: row.lastName ?? 'User',
    email: row.email,
    school: sp?.schoolName ?? 'Unknown School',
    grade: sp?.grade ?? 0,
    interests: sp?.interests ?? [],
    totalHours: sp ? Number(sp.totalVerifiedHours) : 0,
  };
}

export async function findUserWithStudentByClerk(
  clerkUserId: string
): Promise<UserWithStudent | null> {
  return prisma.user.findUnique({
    where: { clerkUserId },
    include: { studentProfile: true },
  });
}
