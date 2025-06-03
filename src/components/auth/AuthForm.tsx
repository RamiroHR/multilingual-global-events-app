"use client";
import React from "react";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { AuthFormProps, AuthFormData } from "@/lib/types/components";

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState("");

  // set locale messages to use
  const tLogin = useTranslations("LoginPage");
  const tSignup = useTranslations("SignupPage");
  const t = type === "login" ? tLogin : tSignup;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      try {
        const formData: AuthFormData = {
          email,
          password,
          ...(type === "signup" && { username }),
          firstName,
          lastName,
        };

        await onSubmit(formData);
        setSuccess(t("success-message"));
      } catch (err: unknown) {
        // handle any error thrown by the onSubmit handler
        if (err instanceof Error) {
          // use the generic error form the api
          setError(err.message);
        } else {
          // fallback to generic error message
          setError(t("error-message"));
        }
      }
    },
    [email, password, username, firstName, lastName, type, onSubmit, t]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
      {type === "signup" && (
        <>
          <input
            type="firstName"
            placeholder={t("firstName")}
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="lastName"
            placeholder={t("lastName")}
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="username"
            placeholder={t("username")}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </>
      )}
      <input
        type="email"
        placeholder={t("email")}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="rounded border bg-blue-100 p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
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
      {error && (
        <p className="text-center text-red-500" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-center text-green-500" role="status">
          {success}
        </p>
      )}
    </form>
  );
}
