-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "EventParticipant" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
