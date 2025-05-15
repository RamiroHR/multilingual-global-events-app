import { Event, User } from "@prisma/client";
import { mockUsers } from "@/mocks/users.template";

// Helper functions
export const getMockEventById = (id: number) => {
  return mockEvents.find((event) => event.id === id);
};

export const getAllMockEvents = () => {
  return mockEvents;
};

export const getMockEventsByCreator = (creatorId: number) => {
  return mockEvents.filter((event) => event.creatorId === creatorId);
};

export const getMockEventsByParticipant = (userId: number) => {
  return mockEvents.filter((event) =>
    event.participants.some((participant) => participant.user.id === userId)
  );
};

// Helper functions for filtering
export const getMockEventsByType = (isOnline: boolean) => {
  return mockEvents.filter((event) => event.isOnline === isOnline);
};

export const getMockEventsByDateRange = (startDate: Date, endDate: Date) => {
  return mockEvents.filter(
    (event) => event.date >= startDate && event.date <= endDate
  );
};

export const getMockEventsByCapacity = (
  minCapacity: number,
  maxCapacity: number
) => {
  return mockEvents.filter(
    (event) =>
      event.maxCapacity >= minCapacity && event.maxCapacity <= maxCapacity
  );
};

// Mock events : example with 1 example event, but can add more event objects
export const mockEvents: (Event & {
  creator: User;
  participants: {
    id: number;
    status: string;
    user: User;
  }[];
})[] = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year! Learn about the latest trends in AI, Web3, and Cloud Computing.",
    date: new Date("2024-06-15T09:00:00Z"),
    location: "Convention Center, San Francisco",
    isOnline: false,
    maxCapacity: 500,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    creatorId: 1,
    creator: mockUsers[0],
    participants: [
      { id: 1, status: "ACCEPTED", user: mockUsers[1] },
      { id: 2, status: "PENDING", user: mockUsers[2] },
    ],
  },
];
