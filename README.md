# Smart Cleaning Operations

**Smart Cleaning Operations** is a responsible AI concept prototype for Facilicom/GOM that supports daily cleaning work through a mobile application for cleaning staff.

The app helps cleaners:
- view their daily cleaning plan,
- see room priorities,
- follow a suggested route order,
- register task progress,
- and understand what data is collected and why.

The project started as a broader exploration of how Facilicom could create value from operational data. During the research phase, the team found that suitable real-world operational data was not yet available for a responsible AI deployment. Therefore, the final project focuses on a realistic concept prototype that demonstrates both the future value of smart cleaning and the data foundation required before real implementation.

## Live prototype

- **Project website / live demo:** https://cleanflow-ai.netlify.app/
- **Repository:** https://github.com/reginhors/cleanflow

## Project goal

The goal of Smart Cleaning Operations is to show how Facilicom/GOM could move from fixed cleaning routines toward more demand-aware cleaning support, while keeping the system transparent, privacy-conscious and human-centered.

The concept is designed to:
- support cleaners rather than monitor them,
- provide explainable route suggestions instead of automated decisions,
- avoid unnecessary employee surveillance,
- and identify which data, governance and legal conditions are needed for a future pilot.

## Current project status

This repository contains a **working mobile PWA prototype** and supporting documentation for a future implementation.

### Implemented in the current prototype

- Mobile cleaner-facing Progressive Web App
- Mock login flow
- Daily task overview
- Room-level task details
- Demand labels and suggested route order
- English and Dutch interface
- “What do we measure?” transparency screen
- Offline-first local task handling
- Structured dummy data for demonstration

### Designed for future implementation

- Real backend services
- Real operational database integration
- Live demand-data feed
- Route-prioritization model using validated operational data
- Aggregated manager dashboard
- Production authorization, audit logging and data-retention mechanisms

## Why dummy data is used

No suitable real operational dataset was available during the project. For that reason, the prototype uses **structured dummy data** to demonstrate the intended workflow and AI logic.

This is an important project finding: responsible AI cannot start with optimization claims alone. Before real deployment, Facilicom/GOM would need:
- validated operational data,
- clear data ownership agreements,
- privacy and legal review,
- stakeholder acceptance,
- and a real-world pilot.

The prototype does **not** claim proven business impact yet. It is a concept demonstrator and implementation roadmap for a future pilot.

## Responsible AI and privacy-by-design

Smart Cleaning Operations is designed around the principle:

> **AI should support cleaners, not monitor them.**

Key safeguards in the concept:
- No GPS tracking
- No background location tracking
- No individual employee ranking by default
- Route suggestions are recommendations, not automated decisions
- Data use is explained in plain language inside the app
- Managers should receive aggregated insights by default
- Individual-level data requires additional legal, organizational and technical safeguards before any future use

More detail:
- [Ethics and GDPR notes](docs/ethics-gdpr.md)
- [Architecture notes](docs/architecture.md)
- [Open questions and pilot assumptions](docs/open-questions.md)

## Main features

### 1. Daily plan

Cleaners can view the tasks for the day in a simple mobile interface, including room name, expected duration and demand level.

### 2. Prioritized route order

The prototype shows a suggested cleaning order based on structured room and demand data. In a future implementation, this could be replaced by a validated route-prioritization model using real operational data.

### 3. Room task details

For each room, cleaners can open task details and register progress such as start, pause and completion.

### 4. Transparency screen

The “What do we measure?” screen explains:
- which data is collected,
- why it is collected,
- and that the data is intended to improve the process rather than evaluate cleaners as individuals.

### 5. Offline-first behavior

The mobile app is designed to remain usable when connectivity is limited. Tasks are first stored locally and can later be synchronized when a connection is available.

## Technology stack

### Current prototype

- React
- TypeScript
- Vite
- React Router
- Dexie / IndexedDB
- Tailwind CSS
- Netlify deployment

### Future architecture concept

- Backend API
- Operational database
- Demand-data integration
- Aggregated manager dashboard
- Explainable route-prioritization logic

## Repository structure

```text
.
├── mobile/                 # Mobile PWA prototype for cleaning staff
│   ├── src/
│   │   ├── api/            # Mock API and dummy data
│   │   ├── db/             # Local offline storage / outbox
│   │   ├── screens/        # App screens
│   │   └── App.tsx         # Main app routing
│   └── README.md           # Mobile-specific setup notes
├── backend/
│   └── db/schema.sql       # Future database schema concept
├── docs/
│   ├── architecture.md     # Future system architecture
│   ├── ethics-gdpr.md      # Privacy and responsible AI choices
│   └── open-questions.md   # Pilot assumptions and open decisions
├── LICENSE                 # Code license
└── README.md               # Main project index
```

## How to run locally

### Prerequisites

- Node.js installed
- npm installed

### Steps

```bash
git clone https://github.com/reginhors/cleanflow.git
cd cleanflow/mobile
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Demo login

The current prototype uses mock accounts for demonstration:

| Employee number | PIN    | Name   |
|-----------------|--------|--------|
| 1001            | 123456 | Fatima |
| 1002            | 654321 | Piotr  |
| 1003            | 111111 | Anouk  |

## Key files

- [`mobile/src/App.tsx`](mobile/src/App.tsx) — main app structure and routing
- [`mobile/src/screens/DayPlan.tsx`](mobile/src/screens/DayPlan.tsx) — daily plan and room-priority overview
- [`mobile/src/screens/WhatWeMeasure.tsx`](mobile/src/screens/WhatWeMeasure.tsx) — employee transparency screen
- [`docs/architecture.md`](docs/architecture.md) — future system architecture
- [`docs/ethics-gdpr.md`](docs/ethics-gdpr.md) — responsible AI and privacy design
- [`docs/open-questions.md`](docs/open-questions.md) — assumptions for a future pilot

## Project documentation

This README acts as the main project index.

Additional documentation:
- [Architecture](docs/architecture.md)
- [Ethics and GDPR](docs/ethics-gdpr.md)
- [Open questions / pilot assumptions](docs/open-questions.md)
- [Mobile app setup](mobile/README.md)

## Future work

A future pilot should:
1. collect and validate real operational data,
2. complete legal and privacy assessment,
3. test the app with cleaners and site managers,
4. develop and evaluate a real route-prioritization model,
5. add an aggregated manager dashboard,
6. and measure real-world impact such as route efficiency, workload balance, service quality and employee acceptance.

## Team

- **Durmus Kondu** — Team Lead, stakeholder engagement and field research
- **Kevin Doerrleben** — Business concept and value proposition
- **Reginho Sordam** — Product development, technical implementation and AI concept
- **Chavelly Reyke** — Stakeholder management, concept development and user experience

## Acknowledgments

We thank Fleur Mulder, Christiaan Weijschede, Linda Mertens and the Facilicom/GOM stakeholders who shared operational, business and privacy-related insights during the project.

## Licenses

- **Code:** MIT License — see [`LICENSE`](LICENSE)
- **Documentation, diagrams and other non-code materials:** CC BY 4.0 — see [`LICENSE-docs.md`](LICENSE-docs.md)

## GRAILS submission

- **Project title:** Smart Cleaning Operations
- **Team:** KRDC Data Team
- **Primary SDG:** SDG 12 — Responsible Consumption and Production
- **Additional SDGs:** SDG 9 — Industry, Innovation and Infrastructure; SDG 11 — Sustainable Cities and Communities
