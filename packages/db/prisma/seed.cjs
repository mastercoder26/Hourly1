/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.opportunity.count();
  if (count > 0) {
    console.log('Seed skipped: opportunities already exist.');
    return;
  }

  const orgUser = await prisma.user.create({
    data: {
      clerkUserId: 'seed_org_owner_dev',
      email: 'seed-org-owner-dev@hourly.local',
      role: 'ORGANIZER',
      orgProfile: {
        create: {
          orgName: 'Green Earth Foundation (Dev Seed)',
          slug: 'green-earth-dev-seed',
          causeTags: ['Environment'],
          isVerified: true,
          city: 'Austin',
          state: 'TX',
          address: '1234 Riverside Dr',
        },
      },
    },
    include: { orgProfile: true },
  });

  const orgId = orgUser.orgProfile?.id;
  if (!orgId) {
    throw new Error('Seed failed: org profile missing');
  }

  const day = new Date('2026-05-15T14:00:00.000Z');

  await prisma.opportunity.createMany({
    data: [
      {
        orgProfileId: orgId,
        title: 'Park cleanup & tree planting (seed)',
        description:
          'Dev seed opportunity. Join us for a morning of park cleanup. Tools provided.',
        causeTags: ['Environment'],
        date: day,
        startTime: new Date('2026-05-15T14:00:00.000Z'),
        endTime: new Date('2026-05-15T17:00:00.000Z'),
        durationHours: 3,
        lat: 30.2672,
        lng: -97.7431,
        address: '1234 Riverside Dr',
        city: 'Austin',
        state: 'TX',
        totalSpots: 20,
        filledSpots: 0,
        ageMinimum: 14,
        creditEligible: true,
        whatToBring: ['Water bottle', 'Sunscreen'],
        recurring: false,
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        orgProfileId: orgId,
        title: 'Food sorting & distribution (seed)',
        description: 'Second seed shift for local QA.',
        causeTags: ['Food'],
        date: new Date('2026-05-18T15:00:00.000Z'),
        startTime: new Date('2026-05-18T15:00:00.000Z'),
        endTime: new Date('2026-05-18T19:00:00.000Z'),
        durationHours: 4,
        lat: 30.25,
        lng: -97.75,
        address: '8201 S Congress Ave',
        city: 'Austin',
        state: 'TX',
        totalSpots: 30,
        filledSpots: 0,
        ageMinimum: 16,
        creditEligible: false,
        whatToBring: ['Closed-toe shoes'],
        recurring: false,
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
  });

  console.log('Seed complete: dev org + 2 opportunities.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
