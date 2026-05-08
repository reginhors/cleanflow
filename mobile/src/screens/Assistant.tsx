// Stub — wordt aangesloten in de AI-stap (LLM-keuze nog open).
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function Assistant() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen p-6">
      <Link to="/" className="text-sm text-gom-green">← {t('common.back')}</Link>
      <h1 className="text-2xl font-bold mt-3">{t('plan.assistant')}</h1>
      <p className="text-slate-500 mt-2 text-sm">
        Komt in de AI-stap. LLM-keuze (Claude vs Azure OpenAI) nog open.
      </p>
    </main>
  );
}
