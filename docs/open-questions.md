# Openstaande punten / aannames

Punten die ik in de MVP gemaakt heb maar die je met Facilicom-stakeholders moet valideren.

## Aangenomen — graag bevestigen
1. **PIN-login voor cleaners** (6 cijfers) als primair, QR-badge als optioneel later. Alternatief: alleen QR-badge, geen PIN.
2. **Talen v1:** NL + EN volledig, AR + PL alleen voor de cleaner-app strings (niet dashboard). Akkoord?
3. **Pilot-omvang:** alleen Kralingse Zoom, 4 vleugels, ~3 cleaners, ~20 ruimtes. Geen multi-tenant in MVP.
4. **Sensor-feed mock** in MVP — Insights-koppeling als latere integratie via een ingest-endpoint. Akkoord?
5. **Auth voor managers:** Entra ID OIDC. Als Facilicom-tenant niet beschikbaar is voor pilot, fallback op lokale email+password met TOTP?
6. **Foto-upload:** opslag in Azure Blob (Facilicom-omgeving). Wie regelt het storage account?
7. **Bewaartermijn 90 dagen** op individu-niveau — daarna user_id → NULL. Klopt deze termijn met het privacy-statement van Facilicom?
8. **LLM:** Anthropic Claude (sonnet-4-6 actueel; 4-7 zoals genoemd in brief bestaat nog niet — gebruiken we 4-6 of liever Azure OpenAI gezien Microsoft-stack?).

## Ontwerpkeuzes ter discussie
9. **Plattegrond:** voor de MVP genereer ik een schematische SVG (vleugels A–D met blokjes). Echte CAD/BIM-import is een latere stap. OK?
10. **"Overslaan"-suggesties:** alleen tonen aan planner, niet automatisch uitvoeren. Wil de klant ook auto-skip met daily-cap?
11. **Klachten-routing:** waar gaat een melding heen? (a) alleen GOM-planner, (b) ook FM-klant, (c) afhankelijk van categorie. Default in MVP = a + categorie 'damage' óók naar FM-klant.
12. **Team-aggregatie minimum-N:** geaggregeerde getallen worden pas getoond bij ≥ 3 personen om herleidbaarheid te voorkomen. Akkoord?

## Out-of-scope MVP (graag bevestigen dat dit later mag)
- Voorraadbeheer middelen / materialen
- Salaris-/uren-koppeling
- Native iOS/Android-app (PWA volstaat)
- BIM-koppeling
- Klanten-portal (alleen FM-rol bij klant ziet dashboard, geen aparte klanten-UI)
