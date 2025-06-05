import { User } from "@prisma/client";

// Helper functions
export const getMockUserById = (id: number) => {
  return mockUsers.find((user) => user.id == id);
};

// Mock users example
export const mockUsers: User[] = [
  {
    id: 1,
    email: "john.doe@example.com",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-02-01T00:00:00Z"),
  } as User,
  {
    id: 2,
    email: "jane.smith@example.com",
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    createdAt: new Date("2025-04-01T00:00:00Z"),
    updatedAt: new Date("2024-04-02T00:00:00Z"),
  } as User,
];
