import { prisma, Prisma } from 'db';

/**
 * Recomputes `StudentProfile.totalVerifiedHours` from verified attendance rows.
 */
export async function syncStudentVerifiedHoursFromAttendance(studentUserId: string): Promise<void> {
  const agg = await prisma.attendanceRecord.aggregate({
    where: {
      studentId: studentUserId,
      verificationStatus: 'VERIFIED',
    },
    _sum: { hoursLogged: true },
  });

  const total = agg._sum.hoursLogged ?? new Prisma.Decimal(0);

  await prisma.studentProfile.updateMany({
    where: { userId: studentUserId },
    data: { totalVerifiedHours: total },
  });
}

/**
 * Recounts approved applications for an opportunity into `filledSpots`.
 */
export async function recalcOpportunityFilledSpots(opportunityId: string): Promise<void> {
  const approved = await prisma.application.count({
    where: { opportunityId, status: 'APPROVED' },
  });

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { filledSpots: approved },
  });
}
