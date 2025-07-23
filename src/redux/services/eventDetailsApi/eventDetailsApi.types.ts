import { EventWithRelations } from "@/lib/types/";
import { ApplicationResponse } from "@/lib/types/routes";

export type EventDetailsQuery = {
  eventId: string;
};

export type EventDetailsEntity = EventWithRelations;

export type ApplyEventEntity = ApplicationResponse;
