# GOM Cleaning — Mobile (PWA)

React + Vite + Tailwind v4 + Dexie. Offline-first.

## Run lokaal

```bash
cd mobile
npm install
npm run dev
```

Open http://localhost:5173

## Deploy naar Netlify

De repo bevat een `netlify.toml` in de root. Netlify kan daardoor direct vanuit de root deployen:

- Build command: `npm run build`
- Base directory: `mobile`
- Publish directory: `mobile/dist`

De redirect-regel stuurt alle routes terug naar `index.html`, zodat refreshes op client-side routes blijven werken.

### Test-logins (mock)

| Personeelsnummer | PIN    | Naam   |
|------------------|--------|--------|
| 1001             | 123456 | Fatima |
| 1002             | 654321 | Piotr  |
| 1003             | 111111 | Anouk  |

## Schermen (stap 2)

- `/login` — PIN-pad, 6 cijfers
- `/` — Dagplanning, route-volgorde, demand-pill (groen/geel/rood)
- `/room/:taskId` — Start/Pauze/Stop timer + afsluitformulier (sterren, opmerking, foto)
- `/measure` — "Wat meten we?" (AVG art. 13/14)
- `/assistant` — stub
- `/myday` — stub

## Offline gedrag

Alle taakacties (start/pauze/stop/note/photo) gaan eerst naar Dexie:
- `tasks` — gecachete planning, lokale status
- `outbox` — events die later naar de backend gepusht worden

Sync-worker komt in backend-stap.
