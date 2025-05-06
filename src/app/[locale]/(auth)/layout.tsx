import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("AuthLayout");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center from-slate-100 to-blue-200">
      <header className="mb-5">
        <h1 className="text-center">
          <Link href="/">
            <span className="block text-3xl font-bold italic text-blue-600">
              {t("app-name")}
            </span>
          </Link>
          <span className="text-m block italic text-gray-300">
            {t("teasing")}
          </span>
        </h1>
      </header>
      <main className="rounded-lg bg-gray-700 p-8 shadow-lg">{children}</main>
    </div>
  );
}
