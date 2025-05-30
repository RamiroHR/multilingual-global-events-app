import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import {
  Id,
  ApplicationWithRelations,
  ApplicationWithParticipants,
  ApplicationWithInfo,
  ParticipationReviewStatus,
} from "@/lib/types";

// Apply to an event as a participant -  manage concurrency with atomic transactions
export async function applyToEvent(eventId: Id, userId: Id): Promise<ApplicationWithRelations> {
  try {
    // start a transaction - multi steps logic
    const result = await prisma.$transaction(async (tx) => {
      // 1- fetch event with participants
      const event = await tx.event.findUnique({
        where: { id: Number(eventId) },
        include: {
          participants: {
            where: {
              status: {
                in: ["PENDING", "ACCEPTED"], // a seat is saved for these
              },
            },
          },
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // 2- check if there is an existing application
      const existingApplication = await tx.eventParticipant.findFirst({
        where: {
          eventId: Number(eventId),
          userId: Number(userId),
          status: {
            in: ["PENDING", "ACCEPTED", "REJECTED"],
          },
        },
      });

      if (existingApplication) {
        throw new Error("You already have applied to this event");
      }

      //3- check the event current capacity
      if (event.participants.length >= event.maxCapacity) {
        throw new Error("Event has reached its maximum capacity");
      }

      //4- verify is there is cancelled application that can be updated
      const cancelledApplication = await tx.eventParticipant.findFirst({
        where: {
          eventId: Number(eventId),
          userId: Number(userId),
          status: "CANCELLED",
        },
      });

      //5- if there is a cancelled application, update it
      if (cancelledApplication) {
        const application = await tx.eventParticipant.update({
          where: {
            id: cancelledApplication.id,
            version: cancelledApplication.version,
          },
          data: {
            status: "PENDING",
            version: cancelledApplication.version + 1,
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

      //6- if there is no previous application, create a new one
      const application = await tx.eventParticipant.create({
        data: {
          eventId: Number(eventId),
          userId: Number(userId),
          status: "PENDING",
          version: 1,
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
    });

    return result;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("The event was modified by another user. Please refresh and try again.");
    }
    throw error;
  }
}

// Get an application by id
export async function getApplicationById(applicationId: Id): Promise<ApplicationWithRelations> {
  const participation = await prisma.eventParticipant.findUnique({
    where: { id: Number(applicationId) },
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

  if (!participation) {
    throw new Error("Participation not found.");
  }

  return participation;
}

// Get all participations of a specific user
export async function getUserParticipations(userId: Id): Promise<ApplicationWithParticipants[]> {
  const userParticipations = await prisma.eventParticipant.findMany({
    where: { userId: Number(userId) },
    include: {
      event: {
        include: {
          creator: true,
          participants: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!userParticipations) {
    throw new Error("User's participations not found.");
  }

  return userParticipations;
}

// Get all applications of a specific event (creator rights)
export async function getEventApplications(
  eventId: Id,
  creatorId: Id
): Promise<ApplicationWithInfo[]> {
  // Check if the event exists and belongs to the user
  const existingEvent = await prisma.event.findUnique({
    where: { id: Number(eventId) },
  });

  // handle issues
  if (!existingEvent) {
    throw new Error("Event not found");
  }
  if (existingEvent.creatorId !== Number(creatorId)) {
    throw new Error("User not authorized to see applications of this event");
  }

  // get all application the event received (with status)
  const eventApplications = await prisma.eventParticipant.findMany({
    where: { eventId: Number(eventId) },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          maxCapacity: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return eventApplications;
}

// Cancel a participation to an event (as a participant)
export async function cancelParticipation(
  participationId: Id,
  userId: Id
): Promise<ApplicationWithRelations> {
  try {
    // start a transaction for read and update consistency
    return await prisma.$transaction(async (tx) => {
      // Check if participation exists and belongs to the user
      const participation = await tx.eventParticipant.findUnique({
        where: { id: Number(participationId) },
        include: {
          event: true,
        },
      });

      if (!participation) {
        throw new Error("Participation not found");
      }

      if (participation.userId !== Number(userId)) {
        throw new Error("Not authorized to cancel this participation");
      }

      // Update the participation status to CANCELLED
      const updatedParticipation = await tx.eventParticipant.update({
        where: {
          id: Number(participationId),
          version: participation.version, // target correct version
        },
        data: {
          status: "CANCELLED",
          version: participation.version + 1, // update version
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

      return updatedParticipation;
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("The event was modified by another user. Please refresh and try again.");
    }
    throw error;
  }
}

// Review an application as the event creator
export async function updateParticipationStatus(
  participationId: Id,
  eventCreatorId: Id,
  newStatus: ParticipationReviewStatus
): Promise<ApplicationWithRelations> {
  try {
    // use transaction for read and update consistency:
    return await prisma.$transaction(async (tx) => {
      // 1- Check if participation exists
      const participation = await tx.eventParticipant.findUnique({
        where: { id: Number(participationId) },
        include: {
          event: true,
        },
      });

      if (!participation) {
        throw new Error("Participation not found");
      }

      // Verify the user is the event creator
      if (participation.event.creatorId !== Number(eventCreatorId)) {
        throw new Error("Not authorized to update this participation status");
      }

      // Verify the participation is in a valid state for update
      if (participation.status !== "PENDING") {
        throw new Error(
          `Cannot update participation that is ${participation.status.toLowerCase()}`
        );
      }

      // 2- Update the participation status
      const updatedParticipation = await tx.eventParticipant.update({
        where: {
          id: Number(participationId),
          version: participation.version,
        },
        data: {
          status: newStatus,
          version: participation.version + 1,
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

      return updatedParticipation;
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Error("The event was modified by another user. Please refresh and try again.");
    }
    throw error;
  }
}
