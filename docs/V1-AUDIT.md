# V1 Functional Audit — Initial Baseline

Source: `MKU-MKU/abhyastrial`.

## Confirmed V1 capabilities

### Student access
- Signup and login.
- 24-hour trial lifecycle.
- Session validation.
- Permanent/expired/pending access states.
- Progress save/get.

### Payments
- Payment submission.
- Transaction ID capture.
- Remarks.
- Screenshot reference.
- Admin review.
- Batch review.
- Grant access.
- Payment status lookup.

### Administration
- Admin login.
- Admin password change.
- Multiple admin accounts.
- Admin creation/deletion.
- User listing/update/deletion.
- Payment listing/deletion.
- Settings update, including batch updates.
- Statistics.
- Audit logs.

The V1 backend exposes these through a single Apps Script action router. The current source contains explicit actions for these areas and uses Google Sheets for Users, Payments, Settings, Logs, Admins and Progress. See the source audit snapshot in the repository history.

### Student study system
- Four-level content hierarchy: level → chapter → book/source → subtopic.
- Question-set references.
- Question normalization.
- Flashcard/practice behavior.
- Timed exam behavior.
- Daily Challenge.
- Psycho Mode.
- Bookmarks and tags.
- Flags.
- Wrong-answer review.
- Progress tracking.
- Streak tracking.
- Timetable and reminders.
- Offline question cache.
- PWA/service-worker behavior.
- Data import/export.
- Math rendering.

### Existing client persistence
V1 uses local storage for session/profile and several student aggregates, plus IndexedDB for question-set caching. The progress cloud sync mirrors selected local state to the backend.

## V1 technical debt to remove

1. Single Apps Script action router.
2. Google Sheets as primary transactional database.
3. Drive file IDs embedded in source data.
4. Large monolithic `app.js`.
5. Separate self-contained HTML application surfaces.
6. Authorization assumptions based on browser state.
7. Mixed domain, rendering and persistence concerns.
8. Weakly typed JSON contracts.
9. Manual cross-file version synchronization.
10. Feature coupling through shared global state.

## Security priorities

The V1 source contains seed administrative credentials and browser-side configuration for the Apps Script endpoint. These must not be copied into V2. V2 must use secret management, server-side authorization, proper password hashing, session rotation/revocation, rate limiting, input validation and least-privilege administration.

## Migration rule

Every V1 capability must map to one of:

- retained with improved implementation;
- merged into a better integrated V2 workflow;
- replaced by a safer equivalent;
- intentionally deprecated with documented reason.

No feature should disappear accidentally during migration.
