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
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    username: "janesmith",
  },
];
