'use client'

import React from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { FaCheck } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { useState } from 'react';


export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const { locales, defaultLocale } = routing;
  const currentLocale = params.locale || defaultLocale;
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(pathname, { locale: newLocale });
  }

  return(
    <div className="relative inline-block">
      <button
      type="button"
      className="p-2 rounded text-gray-200 flex items-center"
      onClick={() => setOpen((prev) => !prev)}
      >
        <IoLanguage size={30}/>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 bg-white border rounded shadow z=10">
          {locales.map(locale =>(
            <li
              key={locale}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => {
                setOpen(false);
                router.push(pathname, { locale });
              }}
            >
              <span className="w-4 mr-2 flex justify-center">
                {locale === currentLocale ? (
                  <FaCheck className="text-blue-500"/>
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