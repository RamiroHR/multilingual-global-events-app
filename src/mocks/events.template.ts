import { Event, User } from "@prisma/client";
import { mockUsers } from "@/mocks/users";

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
  return mockEvents.filter((event) => event.date >= startDate && event.date <= endDate);
};

// Mock events
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
    title: "Eiffel Tower Sunset Tour",
    description:
      "Experience the magic of Paris from the iconic Eiffel Tower during golden hour. Includes skip-the-line access and a guided tour of the tower's history.",
    date: new Date("2025-06-15T18:00:00Z"),
    endDate: new Date("2025-06-15T22:00:00Z"),
    location: "Eiffel Tower, Paris",
    isOnline: false,
    webinar: "",
    maxCapacity: 20,
    isCancelled: false,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    creatorId: 1,
    version: 1,
    creator: mockUsers[0],
    participants: [
      { id: 1, status: "ACCEPTED", user: mockUsers[1] },
      { id: 2, status: "PENDING", user: mockUsers[2] },
    ],
  },
  {
    id: 2,
    title: "Virtual French Cooking Class",
    description:
      "Learn to make authentic French cuisine from a Parisian chef. We'll prepare Coq au Vin and Crème Brûlée together in this interactive online class.",
    date: new Date("2025-05-20T14:00:00Z"),
    endDate: new Date("2025-05-20T15:00:00Z"),
    location: "",
    isOnline: true,
    webinar: "https://meet.google.com/french-cooking-class",
    maxCapacity: 15,
    isCancelled: false,
    createdAt: new Date("2024-01-15T00:00:00Z"),
    updatedAt: new Date("2024-01-15T00:00:00Z"),
    version: 1,
    creatorId: 2,
    creator: mockUsers[1],
    participants: [{ id: 3, status: "ACCEPTED", user: mockUsers[0] }],
  },
];
