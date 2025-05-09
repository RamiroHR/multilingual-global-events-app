import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

// Define locale-specific Home Page
export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="block text-3xl font-bold italic text-blue-600">
        {t("title")}
      </h1>
      <p className="text-m block italic text-gray-300">{t("subtitle")}</p>
      <Image
        className="mt-4 h-auto w-full max-w-[200px]"
        src="/astronaut.png"
        width={200}
        height={200}
        alt="astronaut"
        sizes="(max-width: 100px) 100vw, 200px"
      />
      <Link href="/login" className="text-gray-500">
        <button className="rounded border border-sky-900 bg-sky-800/50 px-4 py-2 text-white hover:bg-sky-700/50">
          {t("cta")}
        </button>
      </Link>
    </div>
  );
}
