-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '7 days',
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '8 days';

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_creatorId_idx" ON "Event"("creatorId");

-- CreateIndex
CREATE INDEX "Event_isOnline_isCancelled_date_idx" ON "Event"("isOnline", "isCancelled", "date");

-- CreateIndex
CREATE INDEX "EventParticipant_userId_status_idx" ON "EventParticipant"("userId", "status");

-- CreateIndex
CREATE INDEX "EventParticipant_eventId_status_idx" ON "EventParticipant"("eventId", "status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
