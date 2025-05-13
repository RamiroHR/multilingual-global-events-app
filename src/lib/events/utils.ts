import { prisma } from "../prisma";
import { CreateEventInput, UpdateEventInput } from "./types";

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

export async function updateEvent(
  eventId: string,
  data: UpdateEventInput,
  creatorId: string
) {
  // Check if the event exists and belongs to the user
  const existingEvent = await prisma.event.findUnique({
    where: { id: Number(eventId) },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  if (existingEvent.creatorId !== Number(creatorId)) {
    throw new Error("User not authorized to update this event");
  }

  // Update event information
  const updatedEvent = await prisma.event.update({
    where: { id: Number(eventId) },
    data: {
      ...data,
    },
  });

  return updatedEvent;
}
