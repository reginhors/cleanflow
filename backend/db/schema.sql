-- GOM Smart Cleaning Operations — database schema (PostgreSQL 16 + TimescaleDB)
-- Comments markeren waar AVG/WOR-waarborgen zitten (zie /docs/ethics-gdpr.md).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- =========================================================================
-- ORGANISATIE & LOCATIES
-- =========================================================================

CREATE TABLE buildings (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,                  -- "HR Kralingse Zoom"
    client_name  TEXT NOT NULL,                  -- "Hogeschool Rotterdam"
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wings (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id  UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    code         TEXT NOT NULL,                  -- "A", "B", "C", "D"
    name         TEXT NOT NULL,
    UNIQUE (building_id, code)
);

CREATE TABLE rooms (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wing_id         UUID NOT NULL REFERENCES wings(id) ON DELETE CASCADE,
    code            TEXT NOT NULL,               -- "A.1.04"
    name            TEXT NOT NULL,
    room_type       TEXT NOT NULL CHECK (room_type IN
                      ('office','classroom','toilet','corridor','kitchen','meeting','technical','other')),
    floor           INT  NOT NULL DEFAULT 0,
    standard_minutes INT NOT NULL DEFAULT 10,    -- gemiddelde verwachte schoonmaaktijd
    map_x           NUMERIC,                     -- positie op SVG-plattegrond
    map_y           NUMERIC,
    UNIQUE (wing_id, code)
);

-- Adjacency-graaf voor route-optimalisatie (bidirectioneel; insert beide kanten)
CREATE TABLE room_edges (
    from_room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    to_room_id   UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    walk_seconds INT  NOT NULL,
    PRIMARY KEY (from_room_id, to_room_id)
);

-- =========================================================================
-- GEBRUIKERS & ROLLEN
-- =========================================================================
-- AVG art. 5 (doelbinding): personeelsdata wordt verzameld voor procesoptimalisatie,
-- niet voor individuele beoordeling. Zie ethics-gdpr.md.

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entra_oid       TEXT UNIQUE,                 -- Microsoft Entra ID (managers)
    employee_code   TEXT UNIQUE,                 -- voor PIN/QR login (cleaners)
    pin_hash        TEXT,                        -- bcrypt; alleen voor cleaners
    display_name    TEXT NOT NULL,
    locale          TEXT NOT NULL DEFAULT 'nl',  -- nl | en | ar | pl
    role            TEXT NOT NULL CHECK (role IN
                      ('cleaner','planner','customer_manager','facility_manager_client','admin')),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Recht op inzage/verwijdering (AVG art. 15/17): markering voor verwijderverzoek
    deletion_requested_at TIMESTAMPTZ
);

-- =========================================================================
-- DEMAND SCORE (vanuit Insights-platform / sensoren)
-- =========================================================================

CREATE TABLE sensor_readings (
    room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    ts          TIMESTAMPTZ NOT NULL,
    occupancy   INT,            -- aantal personen
    co2_ppm     INT,
    PRIMARY KEY (room_id, ts)
);
SELECT create_hypertable('sensor_readings', 'ts', if_not_exists => TRUE);

CREATE TABLE demand_scores (
    room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    for_date    DATE NOT NULL,
    score       NUMERIC(4,2) NOT NULL,           -- 0.00 - 1.00
    band        TEXT NOT NULL CHECK (band IN ('low','medium','high')),
    reason      TEXT,                            -- AI-uitleg, bv. "co2 piek tussen 10-12u"
    suggest_skip BOOLEAN NOT NULL DEFAULT FALSE, -- bezettingsregel-suggestie
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_id, for_date)
);

-- =========================================================================
-- PLANNING & TAKEN
-- =========================================================================

CREATE TABLE shifts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id),
    work_date    DATE NOT NULL,
    starts_at    TIMESTAMPTZ NOT NULL,
    ends_at      TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, work_date)
);

CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id        UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    room_id         UUID NOT NULL REFERENCES rooms(id),
    sequence        INT  NOT NULL,                       -- door route-optimizer gezet
    expected_minutes INT NOT NULL,
    demand_band     TEXT CHECK (demand_band IN ('low','medium','high')),
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN
                      ('pending','in_progress','paused','done','skipped')),
    pre_satisfaction SMALLINT CHECK (pre_satisfaction BETWEEN 1 AND 5), -- aangetroffen toestand
    note            TEXT,
    photo_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (shift_id, sequence)
);

-- Tijdsegmenten (start/pauze/stop) — append-only, geen update
-- Dataminimalisatie (AVG art. 5 lid 1 sub c): individu-niveau records worden
-- na 90 dagen geanonimiseerd (user_id → NULL) via dagelijkse job.
CREATE TABLE task_time_segments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id     UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id),       -- NULL na anonimisering
    started_at  TIMESTAMPTZ NOT NULL,
    ended_at    TIMESTAMPTZ,                     -- NULL = nog bezig
    kind        TEXT NOT NULL CHECK (kind IN ('work','pause'))
);

-- =========================================================================
-- MELDINGEN
-- =========================================================================

CREATE TABLE issues (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id       UUID NOT NULL REFERENCES rooms(id),
    reported_by   UUID REFERENCES users(id),     -- NULL na anonimisering
    task_id       UUID REFERENCES tasks(id),
    category      TEXT NOT NULL CHECK (category IN
                    ('damage','complaint','supply','safety','other')),
    description   TEXT NOT NULL,
    photo_url     TEXT,
    status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','resolved')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at   TIMESTAMPTZ
);

-- =========================================================================
-- AI ASSISTENT — gespreks-log (alleen voor debugging/quality, niet voor beoordeling)
-- =========================================================================

CREATE TABLE assistant_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    role        TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- WAARBORG: individuele inzichten — feature flag + audit
-- =========================================================================
-- WOR art. 27 lid 1 sub l: een personeelsvolgsysteem vereist OR-instemming.
-- Individuele inzichten zijn standaard UIT. Aanzetten = expliciete handeling
-- met OR-akkoord-notitie. Elke kijk wordt gelogd.

CREATE TABLE individual_insights_setting (
    building_id          UUID PRIMARY KEY REFERENCES buildings(id),
    enabled              BOOLEAN NOT NULL DEFAULT FALSE,
    or_consent_reference TEXT,                   -- bv. "OR-besluit 2026-04-12"
    enabled_by           UUID REFERENCES users(id),
    enabled_at           TIMESTAMPTZ,
    employee_notice_sent BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE individual_view_audit (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewer_user_id UUID NOT NULL REFERENCES users(id),
    subject_user_id UUID NOT NULL REFERENCES users(id),
    purpose        TEXT NOT NULL,                -- door manager in te vullen
    viewed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- INDEXEN
-- =========================================================================
CREATE INDEX ON tasks (shift_id, sequence);
CREATE INDEX ON tasks (room_id, created_at DESC);
CREATE INDEX ON issues (room_id, status);
CREATE INDEX ON task_time_segments (task_id);
CREATE INDEX ON demand_scores (for_date);
