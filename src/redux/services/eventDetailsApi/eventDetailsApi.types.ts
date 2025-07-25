import { EventWithRelations } from "@/lib/types/";
import { ApplicationResponse } from "@/lib/types/routes";
import { Event, EventFormValues } from "@/lib/types/";

// Shared type
export type EventDetailsQuery = {
  eventId: string;
};

// Get Event details
export type EventDetailsEntity = EventWithRelations;

// Apply to event
export type ApplyEventEntity = ApplicationResponse;

// edit event
export type EventEntity = Event;
export type UpdateEventDetailsQuery = {
  eventId: string;
  updatedData: EventFormValues;
};

// cancel event
export type CancelEventQuery = {
  eventId: string;
  version: number;
};
