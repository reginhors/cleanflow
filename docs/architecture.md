# Architectuur — GOM Smart Cleaning Operations

## Principes
1. **Offline-first op de vloer.** De mobiele app moet bruikbaar blijven in technische ruimtes zonder wifi. Lokale write-ahead log (IndexedDB) → sync zodra connectie terug is. Conflict-resolutie: server-wint op tijdsegmenten, client-wint op vrije tekst/foto's.
2. **Privacy by design.** Individuele medewerker-data is *standaard* onzichtbaar voor managers. Aggregatie is de default; individu is een uitzondering die expliciet aangezet moet worden, met audit-log en banner.
3. **Doelbinding hard ingebakken.** Elke endpoint dat individuele data teruggeeft, controleert een `individual_insights_enabled` feature flag + rol + audit-write. Niet als config op de UI maar als guard in de API.
4. **Twee data-werelden.** Operationele data (taken, timers, meldingen) is realtime en kort-bewaard. Sensor/demand-data is tijdreeks en statistisch. Niet vermengen in één tabel.

## Lagen

### Mobiele app (PWA)
- React + Vite, service worker (Workbox) voor app-shell + API-cache.
- IndexedDB (via Dexie) voor outbox van timer-events en meldingen.
- Geen GPS, geen background tracking. Alleen voorgrond-timer.
- i18n: NL/EN/AR/PL — strings in JSON, RTL-support voor AR.

### Dashboard
- React + Tailwind + shadcn/ui.
- Plattegrond als SVG met `data-room-id` hooks → live kleurstatus via WebSocket.
- Geen individuele timing-tabel zichtbaar tenzij toggle "individuele inzichten" actief is (zie ethiek).

### Backend
- Node.js 20 + Express + Socket.IO.
- PostgreSQL 16 + TimescaleDB-extensie voor `sensor_readings` hypertable.
- Drizzle ORM (typesafe, lichtgewicht migrations) of Prisma — TBD.
- LLM-proxy: één endpoint `/api/assistant/ask`, server-side system prompt, geen directe sleutel in client.

### AI
- **Route-optimalisatie:** geen LLM. Gewogen graaf van ruimtes (afstand × demand-score × tijd-sinds-laatste-clean), nearest-neighbour + 2-opt verbetering. Snel, voorspelbaar, uitlegbaar.
- **Q&A chatbot:** Claude met system prompt die (a) scope = schoonmaak, (b) safety = nooit gevaarlijke chemische combinaties, (c) format = stap-voor-stap met max 5 stappen.
- **Bezettingsadvies:** regels (`occupancy < X AND co2 < Y AND no_complaints` → suggest skip). Niet auto-skippen — alleen suggesteren.
- **Geaggregeerde trends:** SQL aggregaties → korte LLM-samenvatting in NL. Nooit individu.

## Realtime
WebSocket-channels:
- `room:{id}` — status (idle/cleaning/done) en huidige medewerker (alleen zichtbaar voor rollen die individu mogen zien)
- `building:{id}:complaints` — nieuwe meldingen
- `building:{id}:demand` — score-updates uit Insights-feed

## Auth
- **Managers/planners:** Microsoft Entra ID (OIDC).
- **Schoonmaker op telefoon:** 6-cijferige PIN of QR-badge → korte JWT (8 uur). Geen wachtwoord.
- Rollen: `cleaner`, `planner`, `customer_manager`, `facility_manager_client`, `admin`.
