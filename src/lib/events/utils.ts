import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  CreateEventInput,
  UpdateEventInput,
  Event,
  Id,
  EventWithRelations,
  Countries,
} from "@/lib/types";

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const newEvent = prisma.event.create({
    data: {
      ...data,
      creatorId: Number(data.creatorId), // convert string Id to number for Prisma
    },
  });
  return newEvent;
}

export async function updateEvent(
  eventId: Id,
  data: UpdateEventInput,
  creatorId: Id
): Promise<Event> {
  try {
    // use transaction for read and update consistency.
    return await prisma.$transaction(async (tx) => {
      // Check if the event exists and belongs to the user
      const existingEvent = await tx.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!existingEvent) {
        throw new Error("Event not found");
      }

      if (existingEvent.creatorId !== Number(creatorId)) {
        throw new Error("User not authorized to update this event");
      }

      // Update event information
      const updatedEvent = await tx.event.update({
        where: {
          id: Number(eventId),
          version: existingEvent.version, // attempt to access the same version from where the event was fetched
        },
        data: {
          ...data,
          version: existingEvent.version + 1, // Increment version with update
        },
      });

      return updatedEvent;
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("The event was modified by another user. Please refresh and try again.");
    }
    throw error; // other errors
  }
}

export async function getEventsByCreator(
  userId: Id,
  options?: {
    timeFilter?: "all" | "future" | "past"; // More explicit option
    orderBy?: "asc" | "desc";
  }
): Promise<EventWithRelations[]> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      creatorId: Number(userId),
      isCancelled: false,
      // TimeFilter. If 'all' or undefined, no date filter is applied
      ...(options?.timeFilter === "future" && {
        date: {
          gt: now,
        },
      }),
      ...(options?.timeFilter === "past" && {
        date: {
          lt: now,
        },
      }),
    }, // as Prisma.EventWhereInput,
    orderBy: {
      date: options?.orderBy || "asc",
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

export async function getUpcomingEvents(
  page: number = 1,
  limit: number = 9,
  filters?: {
    onlineOnly?: boolean;
    country?: string;
  }
): Promise<{ events: EventWithRelations[]; hasMore: boolean }> {
  const currentDate = new Date();
  const skip = (page - 1) * limit;

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: currentDate,
      },
      ...(filters?.onlineOnly && { isOnline: true }),
      ...(filters?.country && { country: filters.country }),
    },
    orderBy: {
      date: "asc",
    },
    skip: skip,
    take: limit + 1, //one extra to verify if there are more
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

  if (!events) {
    throw new Error("Upcoming events not found.");
  }

  // verify if there are more in DB, but prepare to retunr only up to 'limit'
  const hasMore = events.length > limit;
  const paginatedEvents = hasMore ? events.slice(0, limit) : events;

  return { events: paginatedEvents, hasMore: hasMore };
}

export async function getEvent(eventId: Id): Promise<EventWithRelations> {
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
        select: {
          id: true,
          status: true,
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

export async function cancelEvent(eventId: Id, creatorId: Id): Promise<Event> {
  try {
    // use transacion for read and update data consistency
    return await prisma.$transaction(async (tx) => {
      // Check if the event exists and belongs to the user
      const existingEvent = await tx.event.findUnique({
        where: { id: Number(eventId) },
      });

      if (!existingEvent) {
        throw new Error("Event not found");
      }

      if (existingEvent.creatorId !== Number(creatorId)) {
        throw new Error("Not authorized to cancel this event");
      }

      const event = await tx.event.update({
        where: {
          id: Number(eventId),
          version: existingEvent.version, // verify it is the same version
        },
        data: {
          isCancelled: true,
          version: existingEvent.version + 1, // update version
        } as Prisma.EventUpdateInput,
      });

      return event;
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("The event was modified by another user. Please refresh and try again.");
    }
    throw error; // for other errors that may occur
  }
}

// to get all avavilable countries from the database
export async function getAllCountries(): Promise<Countries> {
  const countries = await prisma.event.findMany({
    select: {
      country: true,
    },
    where: {
      country: {
        not: "", // exclude empty string - online events
      },
    },
    distinct: ["country"],
  });

  return countries.map((c) => c.country).sort();
}
