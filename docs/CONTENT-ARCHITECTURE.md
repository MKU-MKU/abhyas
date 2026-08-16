# Abhyas V2 content architecture

## Goal

Preserve the V1 chapter/subtopic/question organization while removing the frontend's dependency on Google Drive, spreadsheets, or a specific storage provider.

## Canonical domain

```text
Subject
  └── Chapter
       └── Subtopic
            └── Question
                 ├── options
                 ├── answer
                 ├── explanation
                 ├── difficulty
                 ├── marks
                 └── source
```

## Storage boundary

The web application talks to a content repository. The repository may initially use migrated/static data and later use the Abhyas API and PostgreSQL.

```text
Next.js UI
   ↓
Content repository interface
   ↓
Content adapter
   ├── V1 migration source
   ├── static seed (Phase 1)
   └── API/PostgreSQL (later)
```

The UI must never depend directly on Google Drive IDs.

## V1 migration rule

The existing V1 taxonomy is treated as source data. Chapter names, codes, subtopics and question collections are migrated into the V2 domain without requiring the V2 UI to understand the old storage mechanism.

## Phase 1 scope

The repository currently contains a typed domain model and representative Civil Engineering chapter taxonomy. This is the stable contract for importing the complete V1 content in the next content-migration phase.
