"use client";
import React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";

type AuthFormProps = {
  type: "login" | "signup";
  onSubmit: (data: {
    email: string;
    password: string;
    username?: string;
  }) => Promise<void>;
};

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // set locale messages to use
  const tLogin = useTranslations("LoginPage");
  const tSignup = useTranslations("SignupPage");
  const t = type === "login" ? tLogin : tSignup;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (type === "login") await onSubmit({ email, password });
      if (type === "signup") await onSubmit({ email, password, username });
      setSuccess(t("success-message"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t("error-message"));
      } else {
        setError(t("error-message"));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
      <input
        type="email"
        placeholder={t("email")}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      {type === "signup" && (
        <input
          type="username"
          placeholder={t("username")}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      )}
      <input
        type="password"
        placeholder={t("password")}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="rounded bg-blue-500 p-2 font-semibold text-gray-100 hover:bg-blue-600"
      >
        {t("button")}
      </button>
      {error && <p className="text-center text-red-500">{error}</p>}
      {success && <p className="text-center text-green-500">{success}</p>}
    </form>
  );
}
