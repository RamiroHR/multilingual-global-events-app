import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// locale-specific metadata for better SEO performance
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  try {
    const metadata = await import(`../../metadata/${params.locale}`);
    return metadata.default;
  } catch {
    // fallback to English if locale file not found
    const metadata = await import("../../metadata/en");
    return metadata.default;
  }
}

// locale-specific layout - provide language context to children
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <div className="absolute right-8 top-8">
        <LanguageSwitcher />
      </div>
      {children}
    </NextIntlClientProvider>
  );
}
