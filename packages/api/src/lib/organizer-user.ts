import { prisma, Prisma } from 'db';
import { TRPCError } from '@trpc/server';
import type { OrgProfile, User } from 'db';

function placeholderEmailForClerkOrganizer(clerkUserId: string): string {
  const safe = clerkUserId.replace(/[^a-zA-Z0-9+]/g, '_').slice(0, 120);
  return `organizer_${safe}@placeholder.hourly`;
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

export type UserWithOrgProfile = User & { orgProfile: OrgProfile | null };

/**
 * Resolves Clerk user to an organizer-capable DB user (ORGANIZER role).
 * Does not create OrgProfile — use `ensureOrgProfileForOrganizer`.
 */
export async function getOrCreateOrganizerUser(clerkUserId: string): Promise<User> {
  const existing = await prisma.user.findUnique({
    where: { clerkUserId },
  });
  if (existing) {
    if (existing.role === 'STUDENT') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'This account is registered as a student. Use a separate organizer account.',
      });
    }
    return existing;
  }

  const email = placeholderEmailForClerkOrganizer(clerkUserId);
  try {
    return await prisma.user.create({
      data: {
        clerkUserId,
        email,
        role: 'ORGANIZER',
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
          message: 'Could not create organizer account due to a data conflict.',
        });
      }
    }
    throw e;
  }
}

/**
 * Ensures the organizer has an `OrgProfile` row (minimal defaults on first use).
 */
export async function ensureOrgProfileForOrganizer(userId: string): Promise<OrgProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { orgProfile: true },
  });
  if (!user || user.role !== 'ORGANIZER') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not an organizer account' });
  }
  if (user.orgProfile) {
    return user.orgProfile;
  }

  const baseSlug = `org-${userId.slice(-8)}`;
  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 20) {
    const taken = await prisma.orgProfile.findUnique({ where: { slug } });
    if (!taken) {
      break;
    }
    attempt += 1;
    slug = `${baseSlug}-${attempt}`;
  }

  return prisma.orgProfile.create({
    data: {
      userId: user.id,
      orgName: 'My organization',
      slug,
      causeTags: [],
      mission: null,
    },
  });
}

export async function findOrganizerWithOrgByClerk(
  clerkUserId: string
): Promise<UserWithOrgProfile | null> {
  return prisma.user.findUnique({
    where: { clerkUserId },
    include: { orgProfile: true },
  });
}

/**
 * Resolves org profile for an organizer user, or via org membership (coordinator / event manager).
 */
export async function resolveWritableOrgProfileId(
  clerkUserId: string,
  explicitOrgProfileId?: string
): Promise<{ orgProfileId: string; userDbId: string }> {
  const user = await getOrCreateOrganizerUser(clerkUserId);

  const withOrg = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      orgProfile: true,
      orgMemberships: { include: { orgProfile: true } },
    },
  });

  if (!withOrg) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
  }

  if (explicitOrgProfileId) {
    if (withOrg.orgProfile?.id === explicitOrgProfileId) {
      return { orgProfileId: explicitOrgProfileId, userDbId: withOrg.id };
    }
    const membership = withOrg.orgMemberships.find(m => m.orgProfileId === explicitOrgProfileId);
    if (
      membership &&
      (membership.memberRole === 'COORDINATOR' || membership.memberRole === 'EVENT_MANAGER')
    ) {
      return { orgProfileId: explicitOrgProfileId, userDbId: withOrg.id };
    }
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this organization' });
  }

  if (withOrg.orgProfile) {
    return { orgProfileId: withOrg.orgProfile.id, userDbId: withOrg.id };
  }

  const elevated = withOrg.orgMemberships.find(
    m => m.memberRole === 'COORDINATOR' || m.memberRole === 'EVENT_MANAGER'
  );
  if (elevated) {
    return { orgProfileId: elevated.orgProfileId, userDbId: withOrg.id };
  }

  const ensured = await ensureOrgProfileForOrganizer(withOrg.id);
  return { orgProfileId: ensured.id, userDbId: withOrg.id };
}
