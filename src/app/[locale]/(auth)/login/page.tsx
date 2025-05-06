"use client";

import { useTranslations } from "next-intl";
import AuthForm from "../AuthForm";
import { Link, useRouter } from "@/i18n/navigation";
import axios from "axios";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Login Failed";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      }
      throw new Error(message);
    }
  };

  return (
    <>
      <AuthForm type="login" onSubmit={handleLogin} />
      <Link
        href="/signup"
        className="mt-4 block text-center text-blue-500 hover:underline"
      >
        {t("cta")}
      </Link>
    </>
  );
}
