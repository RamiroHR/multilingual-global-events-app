export type ParticipationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface GetUserParticipationInput {
  userId: number;
}

export interface Participation {
  id: number;
  eventId: number;
  userId: number;
  status: ParticipationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CancelParticipationInput {
  participationId: string;
  userId: string;
}

export interface UpdateParticipationStatusInput {
  participationId: string;
  eventCreatorId: string;
  newStatus: "APPROVED" | "REJECTED";
}
