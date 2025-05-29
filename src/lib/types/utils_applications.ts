import {
  User,
  Event,
  EventParticipant,
  UserInfo,
  EventInfo,
  ParticipationStatus,
} from "./database";
import { ParticipantWithUser, EventWithRelations } from "./utils_events";

// Type for the application with included relations
export type ApplicationWithRelations = EventParticipant & {
  event: Event;
  user: UserInfo;
};

// Type for Application including event information
export type EventPeople = {
  creator: User;
  participants: ParticipantWithUser[];
};

export type ApplicationWithParticipants = EventParticipant & {
  event: EventPeople;
};

// type for Application with minimal info about user aplying and event
export type ApplicationWithInfo = EventParticipant & {
  user: UserInfo;
  event: EventInfo;
};

// type for possible application status review response by creator
export type ParticipationReviewStatus = "ACCEPTED" | "REJECTED";

// Type for the application in the joining page
export type Application = {
  id: number;
  status: ParticipationStatus;
  event: EventWithRelations;
};
