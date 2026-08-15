# V1 → V2 Traceability

This matrix is the control document for functional parity. It will be expanded during the deep source audit.

| V1 capability | V2 domain | V2 treatment | Verification |
|---|---|---|---|
| Signup/login | Auth | Re-engineer | Auth E2E |
| Trial access | Payments/Entitlements | Re-engineer | Access lifecycle tests |
| Payment submission | Payments | Re-engineer | Payment workflow E2E |
| Payment review | Administration/Payments | Re-engineer | Admin E2E |
| User management | Administration | Re-engineer | Admin E2E |
| Settings | Administration | Re-engineer | Service tests |
| Audit logs | Administration | Re-engineer | Audit integration tests |
| Level 5/7/GK/old questions | Content | Preserve + normalize | Content migration tests |
| Chapter/book/subtopic hierarchy | Content | Preserve + improve navigation | Content E2E |
| Question normalization | Content | Typed schema | Unit/contract tests |
| Flashcard practice | Quiz Engine | Re-integrate | Quiz unit/E2E |
| Timed exams | Quiz Engine | Re-integrate | Exam E2E |
| Daily Challenge | Quiz Engine | Improve | Challenge tests |
| Psycho Mode | Quiz Engine | Preserve + improve | Quiz E2E |
| Bookmarks/tags | Review | Integrate | Review tests |
| Flags | Review | Integrate | Review tests |
| Wrong-answer bank | Review | Integrate with weak areas | Review E2E |
| Progress | Progress | Re-engineer | Progress tests |
| Streaks | Progress | Integrate | Streak tests |
| Timetable | Planning | Re-engineer | Planning E2E |
| Offline cache | Offline | Re-engineer | Offline integration tests |
| PWA | Web/Offline | Modernize | Install/offline E2E |
| Import/export | User Data | Re-engineer + validate | Data migration tests |
| Cloud sync | Offline/Progress | Re-engineer | Sync conflict tests |
| Math rendering | Content/UI | Preserve | Rendering tests |

## Completion rule

A row is not complete until implementation, automated verification and migration handling exist.
