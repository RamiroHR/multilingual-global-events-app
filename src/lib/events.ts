import { prisma } from "./prisma";

export interface CreateEventInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxCapacity: number;
  creatorId: number;
}

export async function createEvent(data: CreateEventInput) {
  const newEvent = prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      maxCapacity: data.maxCapacity,
      creatorId: data.creatorId,
    },
  });
  return newEvent;
}
