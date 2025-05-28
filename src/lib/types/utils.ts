import { Id, Event } from "./database";

// Base type for creating an event
type CreateEventBase = Pick<
  Event,
  "title" | "description" | "date" | "endDate" | "location" | "isOnline" | "maxCapacity" | "webinar"
>;

// Input type for creating an event
export type CreateEventInput = CreateEventBase & {
  creatorId: Id; // Override number with string for API utility function
};

// Input type for updating an event (Partial --> fields are optional)
export type UpdateEventInput = Partial<CreateEventBase> & {
  isCancelled?: boolean;
};
