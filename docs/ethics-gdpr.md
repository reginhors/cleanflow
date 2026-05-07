# Ethiek & AVG — waar zitten de waarborgen?

Dit document is bewust kort en koppelt elke verplichting aan de plek in de codebase. Bedoeld voor HBO-verslag en latere OR-bespreking.

| Verplichting | Waar geborgd | Bestand |
|---|---|---|
| **Doelbinding** (AVG art. 5) — data is voor procesoptimalisatie, niet voor individu-beoordeling | Banner in mobiele app + comment in schema bij `users` | `mobile/src/screens/WhatWeMeasure.tsx`, `backend/db/schema.sql` |
| **Personeelsvolgsysteem-grondslag** (WOR art. 27 lid 1 sub l) — OR-instemming verplicht voor individu-zicht | Tabel `individual_insights_setting` met OR-akkoord-veld; API-guard op alle endpoints die individu-data teruggeven | `backend/db/schema.sql`, `backend/src/middleware/individualGuard.ts` (komt) |
| **Audit-log** wie keek naar wie | Tabel `individual_view_audit`; iedere lookup schrijft een rij | `backend/db/schema.sql` |
| **Dataminimalisatie** (AVG art. 5 lid 1 sub c) | Cron-job die na 90 dagen `user_id → NULL` zet op `task_time_segments` en `issues.reported_by` | `backend/src/jobs/anonymize.ts` (komt) |
| **Recht op inzage** (AVG art. 15) | Endpoint `/api/me/data-export` — JSON met alle eigen records | `backend/src/routes/me.ts` (komt) |
| **Recht op verwijdering** (AVG art. 17) | Knop in app → zet `users.deletion_requested_at`; admin-flow voor uitvoering | idem |
| **Transparantie** (AVG art. 13/14) | "Wat meten we?"-scherm in mobiele app, in 4 talen | `mobile/src/screens/WhatWeMeasure.tsx` |
| **Geen individuele ranglijsten** | Dashboard rendert alleen team-aggregaten; minimum-N=3 voor weergave | `dashboard/src/components/TeamInsights.tsx` (komt) |
| **Geen GPS / locatietracking** | Geen `navigator.geolocation`-gebruik in mobile-codebase; ESLint-regel die het verbiedt | `mobile/.eslintrc.js` (komt) |
| **AI-veiligheidsfilter** (chatbot) | System prompt + post-filter op chemische combinaties (chloor+ammoniak/zuur, e.d.) | `backend/src/llm/systemPrompt.ts` (komt) |

## Beslisregel voor nieuwe features
Voor élke nieuwe feature die werknemer-data toont, beantwoord eerst:
1. Kan dit geaggregeerd?
2. Is N ≥ 3?
3. Is er een legitiem doel dat aggregaat niet dekt?
4. Is OR-instemming geregeld?

Pas als 1+2 nee én 3+4 ja, mag individu-data getoond worden — en altijd met audit-write.
