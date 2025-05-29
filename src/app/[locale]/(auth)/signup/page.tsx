"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import AuthForm from "@/components/auth/AuthForm";
import { Link, useRouter } from "@/i18n/navigation";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import ROUTES from "@/lib/routes/routes";
import { AuthFormData } from "@/lib/types/components";
import { AuthResponse, ErrorResponse } from "@/lib/types/routes";

export default function SignupPage() {
  const t = useTranslations("SignupPage");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSignup = useCallback(
    async (data: AuthFormData) => {
      try {
        await axiosInstance.post(ROUTES.SIGNUP, {
          email: data.email,
          password: data.password,
          username: data.username,
        });

        // automatically login new user
        const res = await axiosInstance.post<AuthResponse>(ROUTES.LOGIN, {
          email: data.email,
          password: data.password,
        });

        // update login app state - get info from the api response structure
        login({
          id: res.data.user.id,
          email: res.data.user.email,
          username: res.data.user.username,
        });

        // store jwt token in local storage & redirect
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      } catch (error: unknown) {
        // handle api error
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
    [t, router, login]
  );

  return (
    <>
      <AuthForm type="signup" onSubmit={handleSignup} />
      <Link href="/login" className="mt-4 block text-center text-blue-500 hover:underline">
        {t("cta")}
      </Link>
    </>
  );
}
