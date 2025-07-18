import authReducer, { login, logout } from "@/redux/features/authSlice";

describe("Auth Slice", () => {
  const initialState = {
    user: null,
    isLoggedIn: false,
  };

  it("should handle initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle login", () => {
    const user = {
      id: "123",
      email: "test@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
    };

    const actual = authReducer(initialState, login(user));
    expect(actual.user).toEqual(user);
    expect(actual.isLoggedIn).toBe(true);
  });

  it("should handle logout", () => {
    const loggedInState = {
      user: {
        id: "123",
        email: "test@example.com",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
      },
      isLoggedIn: true,
    };

    const actual = authReducer(loggedInState, logout());
    expect(actual.user).toBe(null);
    expect(actual.isLoggedIn).toBe(false);
  });
});
