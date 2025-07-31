import { EventWithRelations } from "@/lib/types";
import { MyEventsParams, MyEventsResponse } from "@/lib/types/routes";
import { EventFormValues } from "@/lib/types/components";

// get upcoming events query
export type UpcomingEventsQuery = {
  page: number;
  onlineOnly: boolean;
  country: string | null;
};

export type UpcomingEventsEntity = {
  events: EventWithRelations[];
  hasMore: boolean;
};

// get user events query
export type UserEventsQuery = MyEventsParams;
export type UserEventsEntity = MyEventsResponse;

// create event mutation
export type createEventQuery = Omit<EventFormValues, "date" | "endDate"> & {
  date: Date;
  endDate: Date;
};
export type createEventEntity = Event;
