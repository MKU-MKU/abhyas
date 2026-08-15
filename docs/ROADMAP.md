# Abhyas V2 Implementation Roadmap

## Gate 0 — Audit

- Complete V1 source inventory.
- Extract all API actions.
- Extract all data shapes.
- Map every user journey.
- Record security findings.
- Complete V1→V2 traceability.

**Exit:** every known V1 capability has an owner and migration strategy.

## Gate 1 — Foundation

- Initialize pnpm/Turborepo.
- Create TypeScript configuration.
- Create Next.js web/admin shells.
- Create API boundary.
- Add shared UI package.
- Add linting/formatting.
- Add testing.
- Add CI.

**Exit:** clean build, lint, typecheck and test pipeline.

## Gate 2 — Data + Auth

- Implement PostgreSQL schema.
- Add migrations.
- Add repository layer.
- Implement secure sessions.
- Implement RBAC.
- Add validation/error contracts.

**Exit:** authenticated student/admin flows work without V1 infrastructure.

## Gate 3 — Content

- Implement canonical content model.
- Build question ingestion pipeline.
- Validate V1 question data.
- Preserve question/source metadata.
- Build content discovery UI.

**Exit:** representative V1 content can be imported and browsed.

## Gate 4 — Quiz Engine

- Practice mode.
- Flashcards.
- Timed exam.
- Daily Challenge.
- Psycho Mode.
- Scoring.
- Result snapshots.

**Exit:** all major V1 quiz modes have automated parity tests.

## Gate 5 — Learning System

- Progress.
- Accuracy.
- Mastery.
- Streaks.
- Bookmarks.
- Wrong-answer review.
- Flags.
- Timetable.
- Recommendations.

**Exit:** these features operate as one coherent learning loop.

## Gate 6 — Commerce + Admin

- Trial.
- Payment submission.
- Review queue.
- Entitlements.
- User management.
- Settings.
- Audit logs.
- Analytics.

**Exit:** critical operational workflows are secure and tested.

## Gate 7 — Offline

- Local content database.
- Offline question execution.
- Local answer/event queue.
- Sync protocol.
- Retry/idempotency.
- Conflict reconciliation.
- PWA install/update behavior.

**Exit:** core study workflow survives network loss and reconnects safely.

## Gate 8 — Migration + Launch

- Full V1 data migration rehearsal.
- Automated parity suite.
- Accessibility audit.
- Performance profiling.
- Security review.
- Production deployment.
- Rollback procedure.

**Exit:** V2 can replace V1 without losing validated functionality.
