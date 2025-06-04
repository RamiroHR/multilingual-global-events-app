import { Event } from "./database";
import { CreateEventBase, UpdateEventInput, EventWithRelations, Countries } from "./utils_events";
import {
  ApplicationWithRelations,
  ApplicationWithInfo,
  Application,
  ParticipationReviewStatus,
} from "./utils_applications";

// Auth request types
export type SignupRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyRequest = {
  token: string;
};

// Auth response types
export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

// Define the params type
export type MyEventsParams = {
  timeFilter?: "all" | "future" | "past";
  orderBy?: "asc" | "desc";
};

// Request body types for routes
export type CreateEventRequest = CreateEventBase;
export type UpdateEventRequest = UpdateEventInput;
export type ReviewApplicationRequest = {
  status: ParticipationReviewStatus;
};

// Response types for routes
export type EventResponse = Event;
export type EventsResponse = {
  events: EventWithRelations[];
  hasMore: boolean;
};
export type MyEventsResponse = EventWithRelations[];
export type ApplicationResponse = ApplicationWithRelations;
export type ApplicationsResponse = Application[];
export type EventApplicationsResponse = ApplicationWithInfo[];

// Error response type
export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};

// type for the get all countries endpoint
export type AllCountriesResponse = Countries;
