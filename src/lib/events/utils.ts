import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { CreateEventInput, UpdateEventInput } from "./types";

export async function createEvent(data: CreateEventInput) {
  const newEvent = prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      location: data.location,
      isOnline: data.isOnline,
      maxCapacity: data.maxCapacity,
      creatorId: data.creatorId,
      webinar: data.webinar || "",
    } as unknown as Prisma.EventCreateInput,
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

export async function getUserEvents(userId: string) {
  const events = await prisma.event.findMany({
    where: {
      creatorId: Number(userId),
      isCancelled: false,
    } as Prisma.EventWhereInput,
    orderBy: {
      date: "asc",
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return events;
}

export async function getUpcomingEvents(limit: number = 12) {
  const currentDate = new Date();

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: currentDate,
      },
    },
    orderBy: {
      date: "asc",
    },
    take: limit,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return events;
}

export async function getEvent(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: Number(eventId) },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
}

export async function cancelEvent(eventId: string, creatorId: string) {
  // Check if the event exists and belongs to the user
  const existingEvent = await prisma.event.findUnique({
    where: { id: Number(eventId) },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  if (existingEvent.creatorId !== Number(creatorId)) {
    throw new Error("Not authorized to cancel this event");
  }

  const event = await prisma.event.update({
    where: { id: Number(eventId) },
    data: { isCancelled: true } as Prisma.EventUpdateInput,
  });

  return event;
}
