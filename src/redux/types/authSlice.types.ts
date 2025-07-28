import { User, Event } from "@/lib/types/database";

export type ReduxUser = Omit<User, "id" | "createdAt" | "updatedAt"> & { id: string };
export type ReduxEvent = Omit<Event, "id"> & { id: string };
