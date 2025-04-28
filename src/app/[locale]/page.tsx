import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button className="border rounded bg-gray-600 text-white px-4 py-2 hover:bg-gray-700">
        {t('cta')}
      </button>
      <img src="./astronaut.png" width={200}/>
      <Link href="/about" className="text-gray-500">
        {t('about')}
      </Link>
    </div>
  );
}