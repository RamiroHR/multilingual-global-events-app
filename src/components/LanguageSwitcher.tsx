"use client";

import React from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { useState } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const { locales, defaultLocale } = routing;
  const currentLocale = params.locale || defaultLocale;
  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="flex items-center rounded p-2 text-gray-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        <IoLanguage size={30} />
      </button>

      {open && (
        <ul className="z=10 absolute right-0 mt-2 rounded border bg-gray-100 shadow">
          {locales.map((locale) => (
            <li
              key={locale}
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-blue-100"
              onClick={() => {
                setOpen(false);
                router.push(pathname, { locale });
              }}
            >
              <span className="mr-2 flex w-4 justify-center">
                {locale === currentLocale ? (
                  <FaCheck className="text-blue-500" />
                ) : (
                  <span />
                )}
              </span>
              <span className="text-gray-400">{locale.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
