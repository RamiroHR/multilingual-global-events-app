"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/reduxHooks";
import { login, logout } from "@/redux/features/authSlice";

export default function ReduxAuthTest() {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(
      login({
        id: "100",
        email: "user101@example.com",
        username: "user100",
        firstName: "Test",
        lastName: "User100",
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col gap-2 rounded border p-1">
      <h1>Redux Toolkit Test</h1>
      <p>Logged In? : {isLoggedIn ? "Yes" : "No"}</p>
      <p>User: {user ? user.email : "no user"}</p>
      <button onClick={handleLogin} className="rounded border p-1">
        LogIn
      </button>
      <button onClick={handleLogout} className="rounded border p-1">
        LogOut
      </button>
    </div>
  );
}
