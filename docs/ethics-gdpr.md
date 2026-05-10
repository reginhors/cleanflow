# Juridische en ethische aspecten

Dit document is bedoeld voor het HBO-verslag en een latere bespreking met privacy officer, FG en OR. Het is geen juridisch advies, maar legt vast welke keuzes in het concept privacy-by-design ondersteunen.

## Conclusie voor de MVP

De basisrichting klopt: de app zegt duidelijk dat data voor procesverbetering is, niet voor individuele beoordeling. Er zijn ook goede ontwerpkeuzes: geen GPS-tracking, geen automatische sancties, korte bewaartermijn op individueel niveau, en het uitgangspunt dat managers alleen aggregaten zien.

Er waren wel twee punten die verduidelijking nodig hadden:

1. Het managementdashboard toonde in de concept-preview individuele prestatiegegevens. Dat botst met het uitgangspunt "geen individuele ranglijsten". De preview is daarom aangepast: prestaties worden als teamgemiddelde/afgeschermd concept getoond.
2. De documentatie noemde waarborgen die nog niet technisch bestaan, zoals API-guards en anonimiseringjobs. Die blijven belangrijk, maar moeten duidelijk als "vereist voor productie" worden beschreven.

## Relevante kaders

| Thema | Betekenis voor deze app | Ontwerpkeuze |
|---|---|---|
| AVG-beginselen | Persoonsgegevens moeten rechtmatig, transparant, doelgebonden en minimaal worden verwerkt. | Alleen gegevens tonen die nodig zijn voor planning, uitvoering en procesverbetering. |
| Transparantie | Medewerkers moeten begrijpen welke data wordt vastgelegd en waarom. | "Wat meten we?"-scherm in de mobiele app. |
| Dataminimalisatie | Geen onnodige locatie-, gedrags- of prestatiegegevens. | Geen GPS, geen background tracking, geen individuele ranglijsten. |
| Bewaarbeperking | Individuele herleidbaarheid moet niet langer blijven dan nodig. | Concept: 90 dagen op individueel niveau, daarna anonimiseren of loskoppelen van `user_id`. |
| Rechten van betrokkenen | Medewerkers moeten inzage en verwijdering/correctie kunnen aanvragen. | Knop "Mijn gegevens inzien of verwijderen"; in productie een echte aanvraagflow. |
| DPIA | Bij monitoring van werknemers en systematische analyse is een DPIA waarschijnlijk nodig voor productie. | DPIA uitvoeren voor pilot/productie, inclusief belangenafweging en risico-reductie. |
| OR-instemming | Bij gebruik van personeelsgegevens en monitoring/volgsystemen heeft de OR een instemmingsrol. | Individuele inzichten standaard uit; alleen met OR-instemming, doelregistratie en audit-log. |

## Wat de app wel mag tonen in het concept

- Teamvoortgang: aantal ruimtes klaar, open meldingen, totale teamstatus.
- Ruimte- en vleugelinformatie: demand-score, prioriteit en schoonmaakstatus.
- Geaggregeerde procesprestaties: gemiddelde doorlooptijd, normafwijking, trend op teamniveau.
- Meldingen per ruimte, zolang die niet standaard aan individuele medewerkers worden gekoppeld.
- AI-routeadvies als uitlegbare suggestie, niet als automatische beoordeling.

## Wat de app niet moet tonen zonder extra besluitvorming

- Ranglijsten met "beste" of "snelste" medewerkers.
- Individuele tijden, pauzes, afwijkingen of trends per medewerker.
- Huidige kamer/starttijd per medewerker voor managers, tenzij strikt noodzakelijk voor operationele veiligheid en apart onderbouwd.
- Automatische conclusies over functioneren, inzetbaarheid of productiviteit.
- GPS, background tracking of privételefoon-monitoring.

## Productie-eisen

Voor een echte pilot/productiegang moeten deze punten nog expliciet geregeld worden:

1. DPIA uitvoeren en opnemen in het dossier.
2. Verwerkingsregister invullen: doelen, categorieën data, bewaartermijnen, ontvangers en beveiliging.
3. OR/medezeggenschap betrekken voordat monitoring of individuele inzichten worden gebruikt.
4. Autorisatie afdwingen in de backend, niet alleen in de UI.
5. Audit-log schrijven voor elke inzage in individuele medewerkerdata.
6. Anonimisering of loskoppeling na de afgesproken bewaartermijn technisch afdwingen.
7. Inzage-, correctie- en verwijderverzoeken echt afhandelen.
8. AI-assistent beperken tot schoonmaakadvies en gevaarlijke chemische combinaties blokkeren.

## Beslisregel voor nieuwe features

Voor elke nieuwe feature die werknemerdata toont:

1. Kan dit op team- of ruimteniveau?
2. Is de groep groot genoeg om herleidbaarheid te voorkomen, bijvoorbeeld minimum N=3?
3. Is individuele weergave noodzakelijk voor een concreet operationeel doel?
4. Is OR-instemming of andere medezeggenschap geregeld?
5. Wordt inzage gelogd met doel, kijker en tijdstip?

Alleen als 3, 4 en 5 overtuigend ja zijn, mag individuele data zichtbaar worden. Anders blijft het geaggregeerd.
