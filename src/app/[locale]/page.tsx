import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

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
      <img className="mt-4" src="./astronaut.png" width={200}/>
      <Link href="/login" className="text-gray-500">
        <button className="bg-sky-800/50 border border-sky-900 rounded text-white px-4 py-2 hover:bg-sky-700/50">
          {t('cta')}
        </button>
      </Link>
    </div>
  );
}