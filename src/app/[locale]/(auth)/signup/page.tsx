"use client";

import { useTranslations } from "next-intl";
import AuthForm from "../AuthForm";
import { Link, useRouter } from "@/i18n/navigation";
import axios from "axios";

export default function SignupPage() {
  const t = useTranslations("SignupPage");
  const router = useRouter();

  const handleSignup = async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username?: string;
  }) => {
    try {
      await axios.post("/api/auth/signup", {
        email,
        password,
        username,
      });
      router.push("/login");
    } catch (error: unknown) {
      let message = "Signup Failed";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response?.data?.error;
      }
      throw new Error(message);
    }
  };

  return (
    <>
      <AuthForm type="signup" onSubmit={handleSignup} />
      <Link
        href="/login"
        className="mt-4 block text-center text-blue-500 hover:underline"
      >
        {t("cta")}
      </Link>
    </>
  );
}
