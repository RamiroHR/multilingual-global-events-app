import { prisma } from "../prisma";
import {
  GetSingleApplicationInput,
  GetUserParticipationInput,
  CancelParticipationInput,
  UpdateParticipationStatusInput,
  ParticipationStatus,
} from "./types";

// Apply to an event as a participant
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

  // check if user have an active application
  const existingApplication = await prisma.eventParticipant.findFirst({
    where: {
      eventId: Number(eventId),
      userId: Number(userId),
      status: {
        in: ["PENDING", "ACCEPTED"],
      },
    },
  });

  if (existingApplication) {
    throw new Error("You have already applied to this event");
  }

  // check if user has a cancelled application
  const cancelledApplication = await prisma.eventParticipant.findFirst({
    where: {
      eventId: Number(eventId),
      userId: Number(userId),
      status: "CANCELLED",
    },
  });

  //check if event has reached its maximum capacity
  if (event.participants.length >= event.maxCapacity) {
    throw new Error("Event has reached is maximum capacity");
  }

  // If there's a cancelled application, update it to PENDING
  if (cancelledApplication) {
    const application = await prisma.eventParticipant.update({
      where: { id: cancelledApplication.id },
      data: {
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

  // Create the application if no previous appication for this event and user exists
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

// Get an application by id
export async function getApplicationById({ applicationId }: GetSingleApplicationInput) {
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
export async function getUserParticipations({ userId }: GetUserParticipationInput) {
  const userParticipations = await prisma.eventParticipant.findMany({
    where: { userId: userId },
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

  return userParticipations;
}

// Get all application of a specific event (creator rights)
export async function getEventApplications({
  eventId,
  creatorId,
}: {
  eventId: string;
  creatorId: string;
}) {
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
  });

  return eventApplications;
}

// Cancel a participation to an event (as a participant)
export async function cancelParticipation({ participationId, userId }: CancelParticipationInput) {
  // Check if participation exists and belongs to the user
  const participation = await prisma.eventParticipant.findUnique({
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
  const updatedParticipation = await prisma.eventParticipant.update({
    where: { id: Number(participationId) },
    data: {
      status: "CANCELLED" as ParticipationStatus,
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
}

//review an application as the event creator
export async function updateParticipationStatus({
  participationId,
  eventCreatorId,
  newStatus,
}: UpdateParticipationStatusInput) {
  // Check if participation exists
  const participation = await prisma.eventParticipant.findUnique({
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
    throw new Error(`Cannot update participation that is ${participation.status.toLowerCase()}`);
  }

  // Update the participation status
  const updatedParticipation = await prisma.eventParticipant.update({
    where: { id: Number(participationId) },
    data: {
      status: newStatus as ParticipationStatus,
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
}
