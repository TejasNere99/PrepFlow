You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 8 ONLY.

Do not implement anything outside Sprint 8.

====================================================

SPRINT

Sprint 8

Resource Management CMS

====================================================

OBJECTIVE

Implement complete Resource Management inside a Chapter.

Every Resource must belong to exactly one Chapter.

Reuse the architecture, reusable UI components and patterns established in Sprint 5, Sprint 6 and Sprint 7.

Do not duplicate code.

====================================================

BEFORE IMPLEMENTATION

1. Inspect the existing Sheet, Subject and Chapter implementations.
2. Reuse common services, utilities and UI components.
3. Refactor only if it reduces duplication.
4. Do not modify existing functionality.

====================================================

BACKEND

Implement:

- Resource CRUD APIs
- Validation
- Service
- Controller
- Routes

====================================================

RESOURCE MODEL

Support existing model fields.

Important:

Do NOT restrict resourceType.

It must remain a dynamic string.

Examples:

Playlist
Notes
Formula Sheet
PYQs
Reference Book
Cheat Sheet
Revision Notes

Future resource types must work without code changes.

====================================================

RESOURCE URL

Support two modes.

Mode 1

External URL

Examples:

YouTube Playlist

Google Drive

Website

====================================================

Mode 2

Supabase Storage URL

The implementation should support storageUrl even if upload functionality is added in a future sprint.

Do not implement uploads yet.

====================================================

FEATURES

- Automatic display order
- Pagination
- Search
- Sort
- Soft delete
- Dynamic metadata
- Dynamic tags

====================================================

API

POST   /api/resources

GET    /api/resources

GET    /api/resources/:id

PUT    /api/resources/:id

DELETE /api/resources/:id

Support:

?page=
&limit=
&search=
&status=
&chapterId=
&resourceType=
&sort=

====================================================

BUSINESS RULES

Only ACTIVE Chapters can receive Resources.

Resources cannot be created inside ARCHIVED or HIDDEN Chapters.

Resource title uniqueness must be scoped per Chapter.

====================================================

FRONTEND

Replace the placeholder Resources page.

Implement:

Sheet selector

↓

Subject selector

↓

Chapter selector

↓

Resource Table

====================================================

TABLE

Columns

Display Order

Title

Resource Type

URL

Status

Tags

Actions

====================================================

CREATE / EDIT MODAL

Fields:

Sheet

Subject

Chapter

Title

Description

Resource Type

External URL

Storage URL

Display Order (optional)

Status

Tags

Dynamic Metadata

====================================================

CASCADING DROPDOWNS

Sheet

↓

Subject

↓

Chapter

Only ACTIVE entities should appear.

====================================================

VALIDATION

Required:

Sheet

Subject

Chapter

Title

Resource Type

At least one of:

External URL

OR

Storage URL

====================================================

UI

Reuse existing:

Table

Modal

Search Toolbar

Status Tabs

Confirmation Dialog

Loader

Empty State

Error State

Do not duplicate UI.

====================================================

RULES

Do not implement file uploads.

Do not integrate Supabase upload APIs.

Do not implement Student View.

Do not implement Progress Tracking.

====================================================

TESTING

Verify:

- Resource creation
- Resource update
- Resource archive
- Pagination
- Search
- Resource type filtering
- Cascading dropdowns
- Only ACTIVE hierarchy selectable
- Display order auto generation
- Dynamic metadata
- Dynamic tags
- External URL mode
- Storage URL mode
- Frontend build
- Backend
- Production build

====================================================

OUTPUT

Provide:

1. Files created
2. Files modified
3. Refactoring performed
4. Test results
5. Verification summary

Stop after Sprint 8.