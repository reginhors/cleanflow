# Open Questions and Pilot Assumptions

## Purpose of this document

This document lists the main assumptions that would need to be validated before Smart Cleaning Operations could move from a concept prototype to a real pilot within Facilicom/GOM.

The current prototype is intentionally limited and uses dummy data.  
A future pilot should confirm the following product, data, legal and operational decisions.

## Assumptions to validate before a pilot

### 1. User authentication

The prototype uses a simple mock login for demonstration.  
A future pilot must confirm the most suitable authentication method for cleaners, such as:
- employee PIN,
- QR badge,
- or another organization-approved method.

### 2. Language support

The prototype currently supports Dutch and English.  
A future pilot should confirm which languages are required for the actual user group.

### 3. Pilot scope

The pilot should define:
- one or more test locations,
- the number of cleaners involved,
- the number of rooms included,
- the duration of the pilot,
- and the success criteria.

### 4. Real operational data

The current prototype uses dummy data.  
A pilot must determine which real data sources are available, reliable and legally usable, such as:
- room metadata,
- room usage signals,
- task completion data,
- service requests,
- or occupancy-related information.

### 5. Route-prioritization logic

The prototype demonstrates the idea of route prioritization.  
A future pilot should confirm:
- which inputs are truly available,
- which method is most suitable,
- how recommendations are explained,
- and how recommendations are evaluated with users.

### 6. Manager dashboard

The current project focuses on the cleaner-facing app.  
A future manager dashboard should be designed only after confirming:
- what aggregated insights are useful,
- what should remain hidden by default,
- and how to prevent individual employee ranking.

### 7. Data retention and deletion

A pilot must define:
- how long each data type is retained,
- when data is deleted or reviewed,
- and whether employee-linked data can be reduced or aggregated over time.

### 8. Legal and privacy ownership

Before any real deployment, Facilicom/GOM should confirm:
- who owns the privacy assessment,
- who approves data collection,
- whether client permission is required,
- and which internal stakeholders must be involved.

### 9. Employee participation and trust

A pilot should include cleaners and site managers early to validate:
- usability,
- clarity,
- perceived fairness,
- and whether the system is experienced as helpful rather than controlling.

## Out of scope for the current prototype

The current prototype does not include:
- a production backend,
- real sensor integration,
- a live manager dashboard,
- payroll or HR integrations,
- native iOS or Android apps,
- automatic cleaning decisions,
- or proven business-impact measurements.

## Recommended next-step decisions

Before moving to implementation, the project team recommends deciding:

1. which real data sources are allowed and useful;
2. which pilot location and user group should be selected;
3. which legal and privacy checks must be completed;
4. how employee feedback will be collected;
5. how success will be measured;
6. and which product features belong in the first real pilot versus later phases.

## Summary

Smart Cleaning Operations is ready as a concept prototype, but a responsible pilot requires validated data, governance, legal clarity and employee trust before optimization claims can be made.
