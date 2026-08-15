# Abhyas V2

Modern, scalable exam-preparation platform for Nepal Engineering and PSC/Loksewa candidates.

## Product goal

Abhyas V2 preserves the complete functional value of V1 while rebuilding the platform around a typed, modular, secure and testable architecture. V1 is the functional reference; V2 is not a line-by-line rewrite.

## V1 source of truth

The existing application is maintained in [`MKU-MKU/abhyastrial`](https://github.com/MKU-MKU/abhyastrial). It provides the functional baseline for authentication, trial/payment access, student study, quiz/exam modes, progress, review tools, timetable, offline/PWA behavior and administration.

## Target stack

- TypeScript
- Next.js + React
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Zod validation
- pnpm + Turborepo
- Vitest + Playwright
- GitHub Actions
- Offline-first PWA architecture

## Principles

1. Preserve every valuable V1 capability.
2. Re-integrate features instead of copying implementation details.
3. Keep UI independent from persistence and infrastructure.
4. Design mobile-first and desktop-excellent.
5. Make accessibility, security and performance architectural concerns.
6. Keep V1 untouched until V2 reaches verified parity.
7. Use typed contracts and automated tests at every important boundary.

## Monorepo target

```text
apps/
  web/                  Student application
  admin/                Administration application
  api/                  Backend/API boundary
packages/
  ui/                   Shared design system
  quiz-engine/          Quiz, exam and scoring domain
  auth/                 Authentication and authorization
  content/              Question/content domain
  progress/             Progress, streak and analytics domain
  payments/             Trial/payment/access domain
  database/             Drizzle schema and repositories
  validation/           Shared Zod contracts
  config/               Shared configuration
  offline/              Offline storage and synchronization

packages/tests/
docs/
```

## Delivery phases

- Phase 0: V1 functional, security and UX audit
- Phase 1: Architecture, design system and database foundation
- Phase 2: Authentication and access control
- Phase 3: Content and question platform
- Phase 4: Quiz/exam engine
- Phase 5: Student experience
- Phase 6: Progress, review, streak and timetable integration
- Phase 7: Payments and administration
- Phase 8: Offline/PWA and synchronization
- Phase 9: Migration, parity testing and production hardening

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/V1-AUDIT.md`](docs/V1-AUDIT.md), and [`docs/TRACEABILITY.md`](docs/TRACEABILITY.md).
