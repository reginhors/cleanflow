// Transparantie-scherm — AVG art. 13/14.
// Eenvoudige taal, in de twee actieve talen (NL/EN). Geen jargon.

import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function WhatWeMeasure() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <Link to="/" className="text-sm text-gom-green">← {t('common.back')}</Link>
      <h1 className="text-2xl font-bold mt-3 mb-4">{t('measure.title')}</h1>
      <p className="text-slate-700 leading-relaxed">{t('measure.body')}</p>

      <button
        type="button"
        className="mt-8 w-full rounded-xl border border-slate-300 py-4 font-medium"
        onClick={() => alert('Stub: opent /api/me/data-export (komt in backend-stap)')}
      >
        {t('measure.rights')}
      </button>
    </main>
  );
}
