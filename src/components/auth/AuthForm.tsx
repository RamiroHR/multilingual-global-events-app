"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { loginSchema, signupSchema } from "@/lib/validations/schemas";
import { AuthFormProps, AuthFormData } from "@/lib/types/components";
import { ErrorMessage as CustomErrorMessage } from "@/components/common/ErrorMessage";
import { Loader2 } from "lucide-react";

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const tLogin = useTranslations("LoginPage");
  const tSignup = useTranslations("SignupPage");
  const t = type === "login" ? tLogin : tSignup;

  // validation schema and intial values
  const validationSchema = type === "login" ? loginSchema : signupSchema;
  const initialValues: AuthFormData = {
    email: "",
    password: "",
    ...(type === "signup" && {
      username: "",
      firstName: "",
      lastName: "",
    }),
  };

  const handleSubmit = useCallback(
    async (values: AuthFormData, { setSubmitting, setStatus }: FormikHelpers<AuthFormData>) => {
      try {
        await onSubmit(values);
        setStatus({ sucess: t("success-message") });
      } catch (error) {
        if (error instanceof Error) {
          setStatus({ error: error.message });
        } else {
          setStatus({ error: t("error-message") });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, t]
  );

  const fieldStyle =
    "w-full rounded border bg-blue-100 p-2 text-gray-500" +
    " focus:outline-none focus:ring-2 focus:ring-blue-400";

  const errorStyle = "text-sm text-red-500 mt-1 break-words whitespace-pre-wrap max-w-full";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form className="flex flex-col gap-4">
          <h2 className="text-center text-xl font-semibold">{t("title")}</h2>

          {/* Fomr fiels exclusive of Signup */}
          {type === "signup" && (
            <>
              <div>
                <Field
                  type="text"
                  name="firstName"
                  placeholder={t("firstName")}
                  className={fieldStyle}
                />
                <ErrorMessage name="firstName" component="div" className={errorStyle} />
              </div>
              <div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder={t("lastName")}
                  className={fieldStyle}
                />
                <ErrorMessage name="lastName" component="div" className={errorStyle} />
              </div>
              <div>
                <Field
                  type="text"
                  name="username"
                  placeholder={t("username")}
                  className={fieldStyle}
                />
                <ErrorMessage name="username" component="div" className={errorStyle} />
              </div>
            </>
          )}

          {/* Form field common to Signup et Login */}
          <div>
            <Field type="email" name="email" placeholder={t("email")} className={fieldStyle} />
            <ErrorMessage name="email" component="div" className={errorStyle} />
          </div>

          <div>
            <Field
              type="password"
              name="password"
              placeholder={t("password")}
              className={fieldStyle}
            />
            <ErrorMessage name="password" component="div" className={errorStyle} />
          </div>

          {status?.error && <CustomErrorMessage error={status.error} />}

          {status?.success && <div className="text-sm text-green-500">{status.success}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 p-2 font-semibold text-gray-100 hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>{t("submitting")}</span>
              </div>
            ) : (
              t("button")
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}
