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

export async function getUserEvents(userId: string) {
  const events = await prisma.event.findMany({
    where: {
      creatorId: Number(userId),
    },
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

export async function applyToEvent(eventId: string, userId: string) {
  // check if event exists
  const event = await prisma.event.findUnique({
    where: { id: Number(eventId) },
    include: {
      participants: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // check if user is already participant
  const existingApplication = await prisma.eventParticipant.findUnique({
    where: {
      eventId_userId: {
        eventId: Number(eventId),
        userId: Number(userId),
      },
    },
  });

  if (existingApplication) {
    throw new Error("You have already applied to this event");
  }

  //check if event has reached its maximum capacity
  if (event.participants.length >= event.maxCapacity) {
    throw new Error("Event has reached is maximum capacity");
  }

  // Create the application
  const application = await prisma.eventParticipant.create({
    data: {
      eventId: Number(eventId),
      userId: Number(userId),
      status: "PENDING",
    },
    include: {
      event: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return application;
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
