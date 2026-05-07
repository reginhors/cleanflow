// Eenvoudige i18n — geen library nodig voor 2 talen.
// Talen v1: NL + EN. AR/PL volgen na pilot.

import { createContext, useContext, useEffect, useState } from 'react';

export type Locale = 'nl' | 'en';

const dictionaries = {
  nl: {
    'app.title': 'GOM Smart Cleaning',
    'login.title': 'Inloggen',
    'login.subtitle': 'Vul je 6-cijferige PIN in',
    'login.employeeCode': 'Personeelsnummer',
    'login.pin': 'PIN',
    'login.submit': 'Inloggen',
    'login.error': 'Onjuist personeelsnummer of PIN',
    'plan.title': 'Mijn dag',
    'plan.empty': 'Geen taken vandaag',
    'plan.minutes': 'min',
    'plan.demand.low': 'Laag',
    'plan.demand.medium': 'Medium',
    'plan.demand.high': 'Hoog',
    'plan.status.pending': 'Te doen',
    'plan.status.in_progress': 'Bezig',
    'plan.status.paused': 'Gepauzeerd',
    'plan.status.done': 'Klaar',
    'plan.status.skipped': 'Overgeslagen',
    'plan.assistant': 'Vraag de assistent',
    'plan.whatWeMeasure': 'Wat meten we?',
    'plan.logout': 'Uitloggen',
    'room.start': 'START',
    'room.pause': 'Pauze',
    'room.resume': 'Hervat',
    'room.stop': 'Klaar',
    'room.timer': 'Timer',
    'room.preSatisfaction': 'Hoe trof je de ruimte aan?',
    'room.note': 'Opmerking (optioneel)',
    'room.notePlaceholder': 'Bijv.: WC 3 verstopt, graffiti, kapotte stoel…',
    'room.photo': 'Foto toevoegen',
    'room.confirm': 'Bevestigen',
    'room.expectedTime': 'Verwachte tijd',
    'room.demand': 'Vraag',
    'room.skip': 'Overslaan',
    'room.skipReason': 'Reden voor overslaan',
    'measure.title': 'Wat meten we?',
    'measure.body':
      'We meten hoe lang het schoonmaken van een ruimte duurt en welke meldingen er binnenkomen. Deze gegevens gebruiken we om het schoonmaakproces te verbeteren — niet om jou als individu te beoordelen. Individuele cijfers zijn voor leidinggevenden standaard niet zichtbaar. Je kunt op elk moment je eigen gegevens inzien of verwijdering aanvragen.',
    'measure.rights': 'Mijn gegevens / verwijdering aanvragen',
    'common.cancel': 'Annuleren',
    'common.back': 'Terug',
    'common.offline': 'Offline — wijzigingen worden later gesynchroniseerd',
    'common.synced': 'Alles gesynchroniseerd'
  },
  en: {
    'app.title': 'GOM Smart Cleaning',
    'login.title': 'Sign in',
    'login.subtitle': 'Enter your 6-digit PIN',
    'login.employeeCode': 'Employee number',
    'login.pin': 'PIN',
    'login.submit': 'Sign in',
    'login.error': 'Wrong employee number or PIN',
    'plan.title': 'My day',
    'plan.empty': 'No tasks today',
    'plan.minutes': 'min',
    'plan.demand.low': 'Low',
    'plan.demand.medium': 'Medium',
    'plan.demand.high': 'High',
    'plan.status.pending': 'To do',
    'plan.status.in_progress': 'In progress',
    'plan.status.paused': 'Paused',
    'plan.status.done': 'Done',
    'plan.status.skipped': 'Skipped',
    'plan.assistant': 'Ask the assistant',
    'plan.whatWeMeasure': 'What do we measure?',
    'plan.logout': 'Sign out',
    'room.start': 'START',
    'room.pause': 'Pause',
    'room.resume': 'Resume',
    'room.stop': 'Done',
    'room.timer': 'Timer',
    'room.preSatisfaction': 'How did you find the room?',
    'room.note': 'Note (optional)',
    'room.notePlaceholder': 'E.g.: toilet 3 blocked, graffiti, broken chair…',
    'room.photo': 'Add photo',
    'room.confirm': 'Confirm',
    'room.expectedTime': 'Expected time',
    'room.demand': 'Demand',
    'room.skip': 'Skip',
    'room.skipReason': 'Reason for skipping',
    'measure.title': 'What do we measure?',
    'measure.body':
      'We track how long cleaning a room takes and what issues are reported. We use this data to improve the cleaning process — not to evaluate you as an individual. Individual figures are not visible to managers by default. You can view your own data or request deletion at any time.',
    'measure.rights': 'My data / request deletion',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.offline': 'Offline — changes will sync later',
    'common.synced': 'All synced'
  }
} as const;

export type TranslationKey = keyof (typeof dictionaries)['nl'];

const I18nContext = createContext<{ locale: Locale; t: (k: TranslationKey) => string; setLocale: (l: Locale) => void }>({
  locale: 'nl',
  t: (k) => k,
  setLocale: () => {}
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem('locale') as Locale) || 'nl'
  );
  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: TranslationKey) => dictionaries[locale][key] ?? key;
  return <I18nContext.Provider value={{ locale, t, setLocale }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
