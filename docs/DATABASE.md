# Abhyas V2 Database Blueprint

The schema is intentionally domain-oriented. Physical table names can change during implementation, but these invariants should remain stable.

## Identity and access

```text
users
profiles
sessions
roles
permissions
role_permissions
user_roles
entitlements
```

A user identity is separate from access entitlement. Trial, paid access and administrative permission must not be encoded as one overloaded status field.

## Content

```text
levels
subjects
chapters
sources
topics
question_sets
questions
question_options
question_tags
```

A question has a stable ID independent of the source file or storage provider. Question content should support versioning so corrections do not invalidate historical attempts.

## Assessment

```text
practice_sessions
exam_sessions
assessment_questions
answers
results
```

An assessment records the question snapshot/version used at the time. Historical results therefore remain reproducible after content corrections.

## Learning

```text
study_sessions
progress_summaries
mastery_records
streaks
bookmarks
review_items
flags
```

Review state is separate from question content. A wrong answer becomes a review item rather than modifying the canonical question.

## Commerce

```text
trials
payments
payment_reviews
access_events
```

Payment lifecycle and entitlement lifecycle are separate. An administrator approving a payment creates an explicit entitlement/access event.

## Administration

```text
admin_actions
settings
audit_events
```

Privileged changes produce audit events containing actor, action, target, timestamp and relevant metadata.

## Offline synchronization

```text
sync_operations
sync_cursors
```

Each client operation receives a stable operation ID. Server processing is idempotent. The server remains authoritative for protected account state.

## Important constraints

1. Primary keys are application-generated UUIDs where appropriate.
2. Foreign keys enforce relational integrity.
3. Unique constraints protect identity and transaction identifiers.
4. Timestamps are stored consistently in UTC.
5. Soft deletion is used only where audit/history requires it.
6. Secrets are never stored in ordinary content tables.
7. Payment screenshots are object-storage references, not database blobs.
8. Progress queries require indexes designed around the dashboard access pattern.
9. Exam results remain immutable after submission except through controlled administrative correction.
10. Schema migrations are versioned and tested.
