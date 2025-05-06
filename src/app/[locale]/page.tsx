import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// Define locale-specific Home Page
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="block text-3xl text-blue-600 font-bold italic">
        {t('title')}
      </h1>
      <p className="block text-m text-gray-300 italic">
        {t('subtitle')}
      </p>
      <Image
        className="mt-4 w-full max-w-[200px] h-auto"
        src="/astronaut.png"
        width={200}
        height={200}
        alt="astronaut"
        sizes="(max-width: 100px) 100vw, 200px"
      />
      <Link href="/login" className="text-gray-500">
        <button className="bg-sky-800/50 border border-sky-900 rounded text-white px-4 py-2 hover:bg-sky-700/50">
          {t('cta')}
        </button>
      </Link>
    </div>
  );
}