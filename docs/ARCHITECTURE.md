# Abhyas V2 Architecture Blueprint

## 1. Architecture objective

Build a production-grade platform that retains V1 functional coverage while removing the coupling created by static pages, a large client-side application, Google Apps Script request routing, Google Sheets persistence and Google Drive file IDs.

## 2. Logical architecture

```text
Student Web ───────┐
                   ├── Application/API ── Domain Services ── Repositories ── PostgreSQL
Admin Web ─────────┘          │                   │
                              │                   ├── Auth
                              │                   ├── Content
                              │                   ├── Quiz
                              │                   ├── Progress
                              │                   ├── Payments
                              │                   └── Administration
                              │
                              └── Object Storage / Content CDN

Offline client ── Local database ── Sync queue ── API
```

## 3. Monorepo boundaries

### apps/web
Student-facing application. It consumes domain/API contracts and shared UI components. It must not directly access database drivers, payment provider secrets or administrative repositories.

### apps/admin
Operational dashboard for user management, payment review, content administration, settings, audit events and analytics.

### apps/api
Server boundary. Handles authentication, authorization, validation, rate limiting, orchestration and HTTP/API contracts.

### packages/database
Drizzle schema, migrations and repository implementations. Domain services must depend on repository interfaces rather than raw SQL from UI code.

### packages/quiz-engine
Pure domain logic for question normalization, selection, modes, timing, scoring, answer evaluation, result calculation and exam snapshots. It should be independently testable without a browser or database.

### packages/content
Canonical content model replacing the V1 hard-coded Drive map. Content must have stable IDs and metadata; storage locations are infrastructure details.

### packages/progress
Attempts, mastery, accuracy, streaks, review state, bookmarks, wrong answers and study sessions.

### packages/payments
Trial, payment submission, verification, access entitlements and lifecycle state transitions.

### packages/offline
Indexed local persistence, cache policy, sync queue, retry and conflict handling.

### packages/ui
Shared accessible design system. Components should be domain-neutral where possible, with specialized question/exam components built on the primitives.

## 4. Core domain model

```text
User
 ├── Profile
 ├── Sessions
 ├── Entitlements
 ├── Attempts
 ├── StudySessions
 ├── Bookmarks
 ├── ReviewItems
 ├── TimetableEntries
 └── SyncEvents

Content
 ├── Level
 ├── Subject/Chapter
 ├── Source/Book
 ├── QuestionSet
 └── Question

Assessment
 ├── PracticeSession
 ├── ExamSession
 ├── Answer
 └── Result

Commerce
 ├── Trial
 ├── Payment
 └── AccessReview

Administration
 ├── Admin
 ├── Role/Permission
 ├── Setting
 └── AuditEvent
```

## 5. Data principles

- PostgreSQL is the system of record.
- Google Sheets is not the primary database.
- Question content has stable application IDs.
- Storage provider IDs never become domain identifiers.
- JSON blobs are used only where a versioned aggregate is genuinely appropriate.
- All schema changes use migrations.
- User progress is append/event aware where useful, with materialized summaries for fast dashboards.

## 6. Authentication and authorization

Use server-managed sessions and explicit role/permission checks. Never trust local storage for authorization. Client state is a convenience cache only. Sensitive operations require server authorization and validation.

Roles should be permission-driven rather than hard-coded to one administrator account.

## 7. API principles

- Typed request/response contracts.
- Zod validation at external boundaries.
- Consistent error envelope.
- Idempotency for payment and sync operations where applicable.
- Pagination for administrative collections.
- Rate limiting for authentication and sensitive endpoints.
- Audit events for privileged mutations.

## 8. Offline-first model

```text
ONLINE
  ↓
Fetch canonical content
  ↓
Local persistent store
  ↓
Study / answer / bookmark offline
  ↓
Append sync operations
  ↓
Reconnect
  ↓
Retry + deduplicate + reconcile
  ↓
Server acknowledgement
```

The offline layer must never silently overwrite newer server state. Sync operations need stable IDs and timestamps/version information sufficient for deterministic reconciliation.

## 9. UI architecture

Navigation is organized around student intent:

- Home: what should I do next?
- Study: browse the curriculum.
- Practice: start targeted practice.
- Exams: timed assessments.
- Review: bookmarks, wrong answers and weak areas.
- Progress: performance and mastery.
- Profile/Settings: account and preferences.

The exam surface deliberately minimizes distractions; the study surface can expose explanations and learning context.

## 10. Design system

Centralize typography, spacing, radii, elevation, color tokens, motion, breakpoints and accessibility rules. All major components must support keyboard focus, responsive layout, reduced motion and appropriate contrast.

## 11. Testing strategy

- Unit tests for pure domain logic.
- Integration tests for repositories/services.
- Contract tests for API boundaries.
- E2E tests for critical student and admin flows.
- Migration tests for V1 data conversion.
- Offline/sync tests under simulated connectivity changes.

## 12. Non-goals

V2 will not preserve V1 implementation constraints merely for compatibility. Google Apps Script, Google Sheets, Drive file IDs, giant page scripts and local-storage authorization are implementation details, not product requirements.
