"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import ROUTES from "@/lib/routes/routes";
import { AuthResponse, ErrorResponse } from "@/lib/types/routes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, login } = useAuthStore();

  // memoized function - recreate only when user or login change
  const restoreUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      try {
        const response = await axiosInstance.get<AuthResponse>(ROUTES.VERIFY);
        // Update login state with user data from response
        login({
          id: response.data.user.id,
          email: response.data.user.email,
          username: response.data.user.username,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
        });
      } catch (error: unknown) {
        // Handle API errors
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            console.error("API Error:", axiosError.response.data.message);
          } else {
            console.error("Network Error:", axiosError.message);
          }
        } else {
          console.error("Unexpected Error:", error);
        }
        // clear invalid token
        localStorage.removeItem("token");
      }
    }
  }, [user, login]);

  useEffect(() => {
    restoreUserData();
  }, [restoreUserData]);

  return <>{children}</>;
}
