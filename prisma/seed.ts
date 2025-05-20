// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { mockUsers } from "../src/mocks/users";
import { mockEvents } from "../src/mocks/events";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.eventParticipant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users with same passwords
  const hashedPassword = await bcrypt.hash("Password123", 10);

  const createdUsers = await Promise.all(
    mockUsers.map(async (user) => {
      return prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          password: {
            create: {
              password: hashedPassword,
            },
          },
        },
      });
    })
  );

  // Create events
  const createdEvents = await Promise.all(
    mockEvents.map(async (event) => {
      const { creator, participants, ...eventData } = event;
      const createdCreator = createdUsers.find(
        (u) => u.email === creator.email
      );

      if (!createdCreator) {
        throw new Error(`Creator with email ${creator.email} not found`);
      }

      return prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          isOnline: eventData.isOnline,
          maxCapacity: eventData.maxCapacity,
          creatorId: createdCreator.id,
          webinar: eventData.webinar,
        },
      });
    })
  );

  // Create event participants
  await Promise.all(
    mockEvents.flatMap((event, index) =>
      event.participants.map(async (participant) => {
        const createdParticipant = createdUsers.find(
          (u) => u.email === participant.user.email
        );

        if (!createdParticipant) {
          throw new Error(
            `Participant with email ${participant.user.email} not found`
          );
        }

        return prisma.eventParticipant.create({
          data: {
            eventId: createdEvents[index].id, // Use the newly created event's ID
            userId: createdParticipant.id,
            status: participant.status,
          },
        });
      })
    )
  );

  console.log("Database has been seeded!");
}

main()
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
