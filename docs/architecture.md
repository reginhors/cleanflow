# Smart Cleaning Operations — Target Architecture

## Status note

This document describes the **target architecture for a future pilot or production version** of Smart Cleaning Operations.  
The current delivered prototype focuses on the **mobile PWA for cleaners**, uses **structured dummy data** and relies on a **mock API** rather than a live production backend.

## Architecture principles

1. **Mobile-first and practical for the work floor**  
   The cleaner-facing app should be simple, fast and usable during daily cleaning work.

2. **Offline-first where possible**  
   The mobile app should remain usable when connectivity is limited. Local task events can be stored temporarily and synchronized once a connection is available again.

3. **Privacy by design**  
   The system should support cleaners rather than monitor them. Individual employee data should not be visible to managers by default; aggregated insights should be the standard.

4. **Human-in-the-loop decision support**  
   AI should provide understandable recommendations, not automatic decisions. Cleaners and supervisors remain responsible for final operational choices.

5. **Separation of data purposes**  
   Operational task data and future demand or sensor data should be handled clearly and only used for defined purposes.

## Current prototype

The current MVP includes:

- A mobile Progressive Web App for cleaning staff
- Mock login for demonstration purposes
- Daily task overview
- Room-level task details
- Suggested route order based on dummy data
- Demand labels
- A transparency screen explaining what data is measured
- Local offline-first task handling
- Dutch and English interface support

## Future target architecture

### 1. Mobile cleaner app

The mobile app is the main user interface for cleaning staff.

Planned responsibilities:
- Show the daily cleaning plan
- Display room priorities and task details
- Present explainable route suggestions
- Register task progress
- Explain data use in clear language
- Continue working when connectivity is temporarily limited

### 2. Backend services

A future backend would support:
- Authentication and authorization
- Task and schedule management
- Route-prioritization logic
- Synchronization of offline task events
- Audit logging for sensitive access
- Integration with future demand-data sources

### 3. Operational database

A future operational database could store:
- Rooms and room metadata
- Cleaning tasks
- Task status events
- Demand levels
- Cleaning schedules
- Service requests or issue reports

The database design should distinguish between:
- operational workflow data,
- future demand or occupancy data,
- and any data that could be linked to employees.

### 4. Demand-data integration

In a future pilot, demand data could come from sources such as:
- room usage signals,
- occupancy-related information,
- service requests,
- or other building-management data.

Only data that is necessary, legally permitted and useful for the cleaning purpose should be collected.

### 5. Aggregated manager dashboard

A future dashboard could provide managers with:
- room status,
- team-level progress,
- demand trends,
- service requests,
- and aggregated process insights.

The dashboard should **not** show individual employee ranking by default.  
Any future individual-level view would require separate legal, organizational and technical review.

## AI concept

### Route prioritization

The proposed AI use case is **explainable route prioritization**.

A future model or rule-based system could consider:
- room demand,
- time since last cleaning,
- room type,
- service requests,
- and practical route order.

The output should remain:
- understandable,
- reviewable,
- and advisory rather than automatic.

### Explainability

Each recommendation should be accompanied by a human-readable reason, for example:
- “high room usage,”
- “urgent service request,”
- or “long time since last cleaning.”

### No black-box dependence in the MVP

The current prototype demonstrates the concept with structured dummy data.  
It does not claim that a production-grade AI model has already been trained or validated.

## Privacy and security design

The target architecture should include:
- no GPS tracking,
- no background employee monitoring,
- aggregated manager insights by default,
- role-based access control,
- audit logging for sensitive data access,
- data minimization,
- and defined retention periods.

These requirements are elaborated in [`ethics-gdpr.md`](ethics-gdpr.md).

## High-level data flow

1. Future demand data or sensor signals are received.
2. Backend services combine these signals with room and task data.
3. The system generates explainable route recommendations.
4. Cleaners receive recommendations in the mobile app.
5. Managers receive only aggregated operational insights by default.

## What is implemented now vs. later

| Area | Current prototype | Future pilot / production |
|---|---|---|
| Mobile app | Implemented | Expanded and tested with real users |
| Dummy task data | Implemented | Replaced or supplemented with validated real data |
| Route suggestions | Demonstrated conceptually | Evaluated with real operational data |
| Backend services | Mocked | Real backend required |
| Operational database | Schema concept only | Live database required |
| Manager dashboard | Concept only | Future implementation |
| Legal/privacy safeguards | Designed | Formally validated and implemented |

## Related documents

- [Ethics and GDPR](ethics-gdpr.md)
- [Open questions and pilot assumptions](open-questions.md)
