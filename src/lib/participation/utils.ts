import { prisma } from "../prisma";
import {
  GetUserParticipationInput,
  CancelParticipationInput,
  UpdateParticipationStatusInput,
  ParticipationStatus,
} from "./types";

export async function getUserParticipations({
  userId,
}: GetUserParticipationInput) {
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

export async function cancelParticipation({
  participationId,
  userId,
}: CancelParticipationInput) {
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
    throw new Error(
      `Cannot update participation that is ${participation.status.toLowerCase()}`
    );
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
