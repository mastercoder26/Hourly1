-- AlterTable
ALTER TABLE "org_profiles" ADD COLUMN "appealMessage" TEXT,
ADD COLUMN "appealSubmittedAt" TIMESTAMP(3),
ADD COLUMN "appealResolvedAt" TIMESTAMP(3),
ADD COLUMN "appealResolutionNote" TEXT,
ADD COLUMN "appealDecision" TEXT;

-- AlterTable
ALTER TABLE "opportunities" ADD COLUMN "adminHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "adminHiddenReason" TEXT,
ADD COLUMN "adminHiddenAt" TIMESTAMP(3);
