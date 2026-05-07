# GOM Smart Cleaning Operations — MVP

Operationele laag bovenop GOM Smart Cleaning Insights (Pulse+). Twee apps, gedeelde backend.

- `/mobile` — PWA voor schoonmaakmedewerker (persona Fatima), offline-first
- `/dashboard` — web-dashboard voor planner / klantmanager / facility manager
- `/backend` — Node.js + Express API, PostgreSQL, WebSocket voor live-updates
- `/shared` — gedeelde TypeScript types, validatieschema's, constanten
- `/docs` — architectuur, ethiek & AVG, openstaande punten

Pilot: Hogeschool Rotterdam, locatie Kralingse Zoom (vleugels A/B/C/D).

## Architectuurschets

```
 ┌─────────────────────┐         ┌──────────────────────┐
 │ Mobiele PWA         │         │ Web Dashboard        │
 │ (React + SW + IDB)  │         │ (React + Tailwind)   │
 └────────┬────────────┘         └──────────┬───────────┘
          │ REST + WS                        │ REST + WS (SSE)
          ▼                                  ▼
 ┌─────────────────────────────────────────────────────┐
 │ Backend API  (Node.js + Express + Socket.IO)        │
 │  • Auth (Entra ID OIDC, PIN/QR fallback voor vloer) │
 │  • Rol-gebaseerd toegangsmodel (RBAC)               │
 │  • Route-optimalisatie (graph + TSP-heuristiek)     │
 │  • Cleaning Demand Score ingest (mock → Insights)   │
 │  • LLM-proxy (Claude) met domain-system-prompt      │
 │  • Audit log (wie ziet welke individuele data)      │
 └────────┬───────────────────────────┬────────────────┘
          ▼                           ▼
 ┌──────────────────┐       ┌────────────────────────┐
 │ PostgreSQL       │       │ Anthropic Claude API   │
 │ (+ TimescaleDB   │       │ (sonnet, system-prompt │
 │  voor sensor TS) │       │  beperkt tot domein)   │
 └──────────────────┘       └────────────────────────┘
```

Insights-platform levert sensor- en demand-data aan via een aparte ingest-tabel; voor de MVP mocken we die feed met realistische seed-data.

## Setup (in te vullen na stap 2)

Komt na akkoord op het schema.
