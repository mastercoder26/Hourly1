import { prisma, Prisma } from 'db';
import { TRPCError } from '@trpc/server';
import type { User } from 'db';

/** Placeholder email for Clerk-authenticated students until profile sync fills a real address. */
function placeholderEmailForClerk(clerkUserId: string): string {
  const safe = clerkUserId.replace(/[^a-zA-Z0-9+]/g, '_').slice(0, 120);
  return `student_${safe}@placeholder.hourly`;
}

function isPrismaConstraintOnClerkUserId(error: Prisma.PrismaClientKnownRequestError): boolean {
  const target = error.meta?.target;
  if (Array.isArray(target)) {
    return target.includes('clerkUserId');
  }
  if (typeof target === 'string') {
    return target.includes('clerkUserId');
  }
  return false;
}

/**
 * Resolves the authenticated Clerk user to a persisted `User` row (student role).
 * Creates a minimal row on first use so applications can reference `studentId`.
 */
export async function getOrCreateStudentUser(clerkUserId: string): Promise<User> {
  const existing = await prisma.user.findUnique({
    where: { clerkUserId },
  });
  if (existing) {
    return existing;
  }

  const email = placeholderEmailForClerk(clerkUserId);
  try {
    return await prisma.user.create({
      data: {
        clerkUserId,
        email,
        role: 'STUDENT',
      },
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      if (isPrismaConstraintOnClerkUserId(e)) {
        const again = await prisma.user.findUnique({ where: { clerkUserId } });
        if (again) {
          return again;
        }
      } else {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Could not create user account due to a data conflict.',
        });
      }
    }
    throw e;
  }
}
