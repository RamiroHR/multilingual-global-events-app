import { POST as signupPOST } from "@/app/api/auth/signup/route";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import dotenv from "dotenv";
import path from "path";

const testEnvPath = path.resolve(process.cwd(), ".env.test");
console.log("Test file loading env from:", testEnvPath);
const result = dotenv.config({ path: testEnvPath, override: true });

if (result.error) {
  console.error("Error loading .env.test in test file:", result.error);
} else {
  console.log("Successfully loaded .env.test in test file");
}

// Types for request Bodies
type SignupRequestBody = {
  email: string;
  username: string;
  password: string;
};

type LoginRequestBody = {
  email: string;
  password: string;
};

// Helper function to simulate requests
const createMockSignupRequest = (body: SignupRequestBody) =>
  ({ json: async () => body }) as unknown as NextRequest;

const createMockLoginRequest = (body: LoginRequestBody) =>
  ({ json: async () => body }) as unknown as NextRequest;

// Test suite
describe("POST /api/auth/login", () => {
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

  // Helper function to create a test user
  const signupTestUser = async () => {
    const mockUserData = {
      email: "login-test@example.com",
      username: "logintestuser",
      password: "password123",
    };
    const req = createMockSignupRequest(mockUserData);
    await signupPOST(req);
    return mockUserData;
  };

  // tests
  it("should login sucessfull with valid credentials", async () => {
    //signup a user
    const testUser = await signupTestUser();

    //attempt login
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };
    const req = createMockLoginRequest(loginData);
    const response = await loginPOST(req);
    const data = await response.json();

    //response assertions
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("token");
    expect(typeof data.token).toBe("string");
  });

  it("should return 400 for missing fields", async () => {
    //signup user
    const testUser = await signupTestUser();

    //incomplete login data cases
    const testCases = [
      { email: testUser.email },
      { password: testUser.password },
      {},
    ];

    //test logic
    for (const testCase of testCases) {
      const req = createMockLoginRequest(
        testCase as unknown as LoginRequestBody
      );

      const response = await loginPOST(req);
      const data = await response.json();

      // assertions
      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing fields");
    }
  });

  it("should return401 for invalid credentials", async () => {
    const testUser = await signupTestUser();

    // cases of invalid credentials
    const testCases = [
      { email: testUser.email, password: "invalidPassword123" },
      { email: "invalidEmail@example.com", password: testUser.password },
    ];

    // test logic
    for (const testCase of testCases) {
      const req = createMockLoginRequest(testCase);
      const response = await loginPOST(req);
      const data = await response.json();

      //assertions
      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid credentials");
    }
  });
});
