/*
  Warnings:

  - The `status` column on the `EventParticipant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '7 days',
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '8 days';

-- AlterTable
ALTER TABLE "EventParticipant" DROP COLUMN "status",
ADD COLUMN     "status" "ParticipationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "EventParticipant_userId_status_idx" ON "EventParticipant"("userId", "status");

-- CreateIndex
CREATE INDEX "EventParticipant_eventId_status_idx" ON "EventParticipant"("eventId", "status");
