// prisma auto-generated types based on the prisma schemas
import { User, Event, EventParticipant } from "@prisma/client";

// re-export the prisma types - for centralization only
export type { User, Event, EventParticipant };

// common ID type - convert to number only when interacting with prisma
export type Id = string;

// Type for the user info usually selected from database
export type UserInfo = {
  id: number;
  username: string;
  email: string;
};

// Type for the event info usually selected from database
export type EventInfo = {
  id: number;
  title: string;
  maxCapacity: number;
};

// type for participation status in database
export type ParticipationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
