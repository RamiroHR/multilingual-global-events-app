"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthStore } from "@/store/authStore";
import ROUTES from "@/lib/routes/routes";
import { AuthFormData } from "@/lib/types/components";
import { ErrorResponse, AuthResponse } from "@/lib/types/routes";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = useCallback(
    async (data: AuthFormData) => {
      try {
        const res = await axiosInstance.post<AuthResponse>(ROUTES.LOGIN, {
          email: data.email,
          password: data.password,
        });

        // change login app state
        login({
          id: res.data.user.id,
          email: res.data.user.email,
          username: res.data.user.username,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
        });

        // store jwt token in local storage & redirect user
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } catch (error: unknown) {
        // hadle api error
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            // standarized error response - pass the string message only
            throw new Error(axiosError.response.data.message);
          }
        }
        // or fallback error message (pure string) if not from the api
        throw new Error(t("error-message"));
      }
    },
    [login, router, t]
  );

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} />
      <Link href="/signup" className="mt-4 block text-center text-blue-500 hover:underline">
        {t("cta")}
      </Link>
    </>
  );
}
