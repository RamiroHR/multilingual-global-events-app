import { EventWithRelations } from "@/lib/types/utils_events";
import { Application } from "@/lib/types/utils_applications";

// // types for custom hook: useEvents

// type of event to fetch
export type EventFetchType = "upcoming" | "created" | "joined";

// Base options that all fetch types can use
export interface BaseEventOptions {
  onError?: (error: string) => void;
}

// Options for each fetch type
export interface UpcomingEventsOptions extends BaseEventOptions {
  onlineOnly?: boolean;
  country?: string | null;
  page?: number;
}

export interface CreatedEventsOptions extends BaseEventOptions {
  timeFilter?: "all" | "future" | "past";
  orderBy?: "asc" | "desc";
}

// Union type of all possible options
export type EventOptions =
  | {
      type: "upcoming";
      options?: UpcomingEventsOptions;
    }
  | {
      type: "created";
      options?: CreatedEventsOptions;
    }
  | {
      type: "joined";
      options?: BaseEventOptions;
    };

// Return type that includes all possible data types
export type EventData = EventWithRelations[] | Application[];

export interface UseEventsReturn {
  data: EventData;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  hasMore?: boolean; //only for upcoming events
}
