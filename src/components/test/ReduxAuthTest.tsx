"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { login, logout } from "@/redux/features/authSlice";

export default function ReduxAuthTest() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(
      login({
        id: "100",
        email: "user100@example.com",
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
      <h1>Test Redux-Toolkit authStore </h1>
      <p>User is Logged In? : {isLoggedIn ? "Yes" : "No"}</p>
      <p>User Name : {user ? user.email : "no user"}</p>
      <button onClick={handleLogin} className="rounded border p-1">
        LogIn
      </button>
      <button onClick={handleLogout} className="rounded border p-1">
        LogOut
      </button>
    </div>
  );
}
