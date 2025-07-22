import { EventWithRelations } from "@/lib/types";

export type UpcomingEventsQuery = {
  page: number;
  onlineOnly: boolean;
  country: string | null;
};

export type UpcomingEventsEntity = {
  events: EventWithRelations[];
  hasMore: boolean;
};
