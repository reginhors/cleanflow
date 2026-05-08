// Stub — einde-van-dag-overzicht. Vullen we na backend-stap.
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function MyDay() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen p-6">
      <Link to="/" className="text-sm text-gom-green">← {t('common.back')}</Link>
      <h1 className="text-2xl font-bold mt-3">{t('plan.title')}</h1>
      <p className="text-slate-500 mt-2 text-sm">Komt na backend-stap.</p>
    </main>
  );
}
