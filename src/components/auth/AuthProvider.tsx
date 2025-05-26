"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import ROUTES from "@/lib/routes/routes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, login } = useAuthStore();

  useEffect(() => {
    const restoreUserData = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const response = await axiosInstance.get(ROUTES.VERIFY);
          if (response.data) {
            login({
              id: response.data.userId,
              email: response.data.email,
              username: response.data.username,
            });
          }
        } catch (error) {
          console.error("Error restoring user data:", error);
          localStorage.removeItem("token");
        }
      }
    };

    restoreUserData();
  }, [user, login]);

  return <>{children}</>;
}
