import { POST } from "@/app/api/auth/signup/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.test" });

// helper function to simulate the request body to send to the endpoint
type SignupRequestBody = {
  email: string;
  username: string;
  password: string;
};

const createMockRequest = (body: SignupRequestBody) =>
  ({ json: async () => body }) as unknown as NextRequest;

// test suite
describe("POST /api/auth/signup", () => {
  // Initial & Final Cleanup
  beforeEach(async () => {
    await prisma.password.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.password.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  // tests
  it("should create a new user with valid data", async () => {
    const mockUserData = {
      email: "test@example.com",
      username: "testuser",
      password: "pasword123",
    };

    // test logic
    const req = createMockRequest(mockUserData);
    const response = await POST(req);
    const data = await response.json();

    // response assertions
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data.email).toBe(mockUserData.email);
    expect(data.username).toBe(mockUserData.username);
    expect(data).not.toHaveProperty("password");

    // database verification
    const createdUser = await findUserByEmail(mockUserData.email);
    expect(createdUser).toBeTruthy();
    expect(createdUser?.email).toBe(mockUserData.email);
    expect(createdUser?.username).toBe(mockUserData.username);
  });

  it("should return 400 for missing fields", async () => {
    // mosck data
    const testCases = [
      { email: "test@example.com", username: "testuser" },
      { email: "test@example.com", password: "password123" },
      { username: "testuser", password: "password123" },
      {}, // missing all fields
    ];

    // test logic
    for (const testCase of testCases) {
      const req = createMockRequest(testCase);
      const response = await POST(req);
      const data = await response.json();

      // response assertions
      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing fields");
    }
  });

  it("should return 409 for existing email", async () => {
    // mock data
    const mockUserData = {
      email: "test@example.com",
      username: "testuser",
      password: "pasword123",
    };

    // test logic
    const req1 = createMockRequest(mockUserData);
    await POST(req1);

    const req2 = createMockRequest({
      ...mockUserData,
      username: "differentUser",
    });
    const response = await POST(req2);
    const data = await response.json();

    // response assertions
    expect(response.status).toBe(409);
    expect(data.error).toBe("Email already in use");
  });

  it("should hash the password before storing", async () => {
    // mock data
    const mockUserData = {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    };

    // test logic
    const req = createMockRequest(mockUserData);
    await POST(req);

    // DB verifications
    const createdUser = await findUserByEmail(mockUserData.email);
    expect(createdUser?.password?.password).not.toBe(mockUserData.email);
    expect(createdUser?.password?.password).toMatch(/^\$2[aby]\$\d+\$/); // matches the bcrypt format hash
  });
});
