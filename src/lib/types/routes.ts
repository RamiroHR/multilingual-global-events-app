import { Event } from "./database";
import { CreateEventBase, UpdateEventInput, EventWithRelations } from "./utils_events";
import {
  ApplicationWithRelations,
  ApplicationWithInfo,
  ApplicationWithParticipants,
  ParticipationReviewStatus,
} from "./utils_applications";

// Auth request types
export type SignupRequest = {
  username: string;
  email: string;
  password: string;
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
  };
};

// Request body types for routes
export type CreateEventRequest = CreateEventBase;
export type UpdateEventRequest = UpdateEventInput;
export type ReviewApplicationRequest = {
  status: ParticipationReviewStatus;
};

// Response types for routes
export type EventResponse = Event;
export type EventsResponse = EventWithRelations[];
export type ApplicationResponse = ApplicationWithRelations;
export type ApplicationsResponse = ApplicationWithParticipants[];
export type EventApplicationsResponse = ApplicationWithInfo[];

// Error response type
export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};
