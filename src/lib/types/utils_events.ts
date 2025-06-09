import { Id, Event, UserInfo } from "./database";

// Base type for creating an event
export type CreateEventBase = Pick<
  Event,
  | "title"
  | "description"
  | "date"
  | "endDate"
  | "city"
  | "country"
  | "location"
  | "isOnline"
  | "maxCapacity"
  | "webinar"
>;

// Input type for creating an event
export type CreateEventInput = CreateEventBase & {
  creatorId: Id; // Override number with string for API utility function
};

// Input type for updating an event (Partial --> fields are optional)
export type UpdateEventInput = Partial<CreateEventBase> & {
  isCancelled?: boolean;
  version: number;
};

// Type for the participant info typically selected
export type ParticipantWithUser = {
  id: number;
  status: string;
  user: UserInfo;
};

// Type for the event with included relations
export type EventWithRelations = Event & {
  creator: UserInfo;
  participants: ParticipantWithUser[];
};

export type Countries = string[];
