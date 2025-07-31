import {
  signupSchema,
  createEventSchema,
  updateEventSchema,
  updateParticipationStatusSchema,
} from "@/lib/validations/schemas";

// Test data creation function
const createValidSignupData = (overrides = {}) => ({
  email: "test@example.com",
  username: "testuser",
  password: "ValidPassword123!",
  firstName: "John",
  lastName: "Doe",
  ...overrides,
});

const createValidEventData = (overrides = {}) => ({
  title: "Test Event",
  description: "This is a test event description that meets the minimum length requirement.",
  date: "2026-01-01",
  endDate: "2026-01-02",
  maxCapacity: 10,
  isOnline: false,
  city: "New York",
  country: "US",
  location: "Central Park",
  webinar: null,
  ...overrides,
});

describe("Signup Schema", () => {
  it("should validate correct signup data", () => {
    const data = createValidSignupData();

    expect(() => signupSchema.validateSync(data)).not.toThrow();
  });

  it("should reject invalid email", () => {
    const data = createValidSignupData({ email: "invalid-email" });

    expect(() => signupSchema.validateSync(data)).toThrow("Invalid email format");
  });

  it("should reject short username", () => {
    const data = createValidSignupData({ username: "ab" });

    expect(() => signupSchema.validateSync(data)).toThrow("Username must be at least 3 characters");
  });
});

describe("Create Event Schema", () => {
  it("should validate correct online event data", () => {
    const data = createValidEventData({
      isOnline: true,
      city: null,
      country: null,
      location: null,
      webinar: "https://zoom.us/123",
    });

    expect(() => createEventSchema.validateSync(data)).not.toThrow();
  });

  it("should validate correct in-person event data", () => {
    const data = createValidEventData({
      isOnline: false,
      city: "New York",
      country: "US",
      location: "Central Park",
      webinar: null,
    });

    expect(() => createEventSchema.validateSync(data)).not.toThrow();
  });

  it("should require city for in-person events", () => {
    const data = createValidEventData({
      isOnline: false,
      city: null, // Missing city
    });

    expect(() => createEventSchema.validateSync(data)).toThrow("City is required");
  });

  it("should require webinar for online events", () => {
    const data = createValidEventData({
      isOnline: true,
      webinar: null, // Missing webinar
    });

    expect(() => createEventSchema.validateSync(data)).toThrow(
      "Webinar link is required for online events"
    );
  });

  it("should reject end date before start date", () => {
    const data = createValidEventData({
      date: "2024-01-02",
      endDate: "2024-01-01", // End date before start date
    });

    expect(() => createEventSchema.validateSync(data)).toThrow("End date must be after start date");
  });
});

describe("Update Event Schema", () => {
  it("should validate correct update data with version", () => {
    const data = {
      ...createValidEventData(),
      version: 1,
    };

    expect(() => updateEventSchema.validateSync(data)).not.toThrow();
  });

  it("should require version field", () => {
    const data = createValidEventData(); // Missing version

    expect(() => updateEventSchema.validateSync(data)).toThrow("Version is required");
  });
});

describe("Update Participation Status Schema", () => {
  it("should validate ACCEPTED status", () => {
    const data = { status: "ACCEPTED" };

    expect(() => updateParticipationStatusSchema.validateSync(data)).not.toThrow();
  });

  it("should validate REJECTED status", () => {
    const data = { status: "REJECTED" };

    expect(() => updateParticipationStatusSchema.validateSync(data)).not.toThrow();
  });

  it("should reject invalid status", () => {
    const data = { status: "PENDING" };

    expect(() => updateParticipationStatusSchema.validateSync(data)).toThrow(
      "Status must be either ACCEPTED or REJECTED"
    );
  });
});
