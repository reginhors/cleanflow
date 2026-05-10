# Ethics, Privacy and GDPR Considerations

## Status note

This document describes the ethical and privacy considerations behind the Smart Cleaning Operations concept.  
It is **not legal advice**. A real pilot or production deployment would require formal review by Facilicom/GOM, including privacy, legal and employee-representation stakeholders where applicable.

## Core principle

> **AI should support cleaners, not monitor them.**

Smart Cleaning Operations is designed as a decision-support tool for cleaning staff.  
The concept aims to improve cleaning operations without turning the app into an employee-surveillance system.

## Main ethical design choices

### 1. No GPS tracking

The concept does not use GPS or background location tracking.  
This reduces unnecessary monitoring and keeps the focus on cleaning tasks rather than employee movement.

### 2. No individual ranking by default

Managers should receive aggregated process insights by default, not leaderboards or individual performance rankings.  
The purpose of the system is operational improvement, not individual scoring.

### 3. Explainable recommendations

Route suggestions should be shown as understandable recommendations with reasons, such as:
- room demand,
- service request,
- or time since last cleaning.

The system should not make hidden or automatic decisions that users cannot understand.

### 4. Human-in-the-loop

Cleaners and supervisors remain responsible for final decisions.  
AI suggestions should support human judgment, not replace it.

### 5. Data minimization

Only data that is necessary for planning, execution and process improvement should be collected.  
The concept avoids unnecessary personal, behavioral or location data.

## Relevant privacy principles

| Principle | Meaning for this project | Design implication |
|---|---|---|
| Lawfulness, fairness and transparency | People should understand what data is collected and why. | The app includes a “What do we measure?” screen in plain language. |
| Purpose limitation | Data should be collected for specific purposes only. | Data is intended for cleaning operations and process improvement, not unrelated employee evaluation. |
| Data minimization | Only necessary data should be collected. | No GPS tracking, no background tracking, no unnecessary personal data. |
| Storage limitation | Data should not be kept longer than necessary. | Future deployment requires defined retention periods and deletion or review rules. |
| Accuracy and reliability | Data used for decisions should be sufficiently reliable. | Real deployment requires validated operational data before optimization claims are made. |
| Security and confidentiality | Personal data requires appropriate safeguards. | Future systems need role-based access, audit logging and technical security controls. |

## What the concept may show

The concept may appropriately show:
- daily tasks,
- room priorities,
- room status,
- service requests,
- team-level progress,
- and aggregated process insights.

## What the concept should not show by default

The concept should not show:
- individual employee rankings,
- “fastest cleaner” or “best cleaner” leaderboards,
- individual pause patterns,
- automatic judgments about productivity,
- GPS movement traces,
- or background monitoring data.

## Employee transparency in the prototype

The mobile app includes a transparency screen that explains:
- what data is measured,
- why it is measured,
- that the goal is process improvement,
- and that individual figures are not visible to managers by default.

This makes responsible AI visible in the product itself rather than only in documentation.

## Risks and mitigations

| Risk | Why it matters | Mitigation in the concept |
|---|---|---|
| Employee surveillance | Staff could feel monitored rather than supported. | No GPS, no background tracking, no individual ranking by default. |
| Unclear data ownership | Building or client data may not automatically be available for reuse. | Future pilot requires legal review and confirmation of permitted data use. |
| Poor data quality | Incomplete data could create unfair or unreliable recommendations. | Current prototype uses dummy data only; real deployment requires validated data. |
| Over-reliance on AI | Users may assume recommendations are always correct. | AI remains advisory, explainable and human-reviewed. |
| Function creep | Data collected for operations could later be reused for other purposes. | Purpose limitation and governance must be defined before deployment. |

## Requirements before a real pilot

Before a real pilot or production deployment, Facilicom/GOM should:

1. confirm which data may legally be collected and used;
2. define clear purposes for data processing;
3. perform the required privacy and legal assessment;
4. involve relevant employee-representation stakeholders where required;
5. define retention periods and deletion rules;
6. implement role-based access control and audit logging;
7. validate data quality and model behavior;
8. test usability, trust and practical workflow fit with cleaners and managers.

## Decision rule for future features

For every future feature that uses employee-related data, ask:

1. Is the data necessary for the cleaning purpose?
2. Can the goal be achieved with aggregated or room-level data instead?
3. Is the feature understandable to affected employees?
4. Has the legal and organizational basis been confirmed?
5. Does the feature preserve human oversight?

If the answer is unclear, the feature should not be deployed until it has been reviewed.

## Current conclusion

The current prototype is ethically stronger because it:
- avoids unnecessary employee monitoring,
- makes data use transparent,
- keeps humans in control,
- and clearly separates concept demonstration from real deployment claims.

The main unresolved issue is not technical complexity alone, but whether Facilicom/GOM can establish the right data, governance and trust conditions for a responsible pilot.
