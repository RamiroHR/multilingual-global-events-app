/*
  Warnings:

  - Made the column `location` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `webinar` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '7 days',
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "location" SET DEFAULT '',
ALTER COLUMN "webinar" SET NOT NULL,
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '8 days';

-- AlterTable
ALTER TABLE "Password" ALTER COLUMN "password" SET DEFAULT '';
