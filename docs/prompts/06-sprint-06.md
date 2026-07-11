You are continuing development of the PrepFlow project.

Read the Master Prompt and the implementations from Sprint 1–5 before making any changes.

This is Sprint 6 ONLY.

Do not implement anything outside Sprint 6.

====================================================

SPRINT

Sprint 6

Subject Management CMS

====================================================

OBJECTIVE

Implement complete Subject Management inside a Sheet.

Every Subject must belong to exactly one Sheet.

This sprint should reuse the architecture created in Sprint 5 instead of duplicating it.

====================================================

IMPORTANT

Before writing new code:

1. Inspect the existing Sheet Management implementation.
2. Identify reusable patterns.
3. Extract reusable components/services/helpers only if it reduces duplication.
4. Do NOT change existing functionality.

====================================================

BACKEND

Implement:

- Subject CRUD APIs
- Validation
- Service
- Controller
- Routes

Features:

- Automatic unique slug generation
- Pagination
- Search
- Sort by display order
- Soft delete (status = ARCHIVED)

Every Subject must reference one Sheet.

====================================================

API

POST   /api/subjects
GET    /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id

Support query parameters:

?page=
&limit=
&search=
&status=
&sheetId=
&sort=

====================================================

SECURITY

Reuse the existing authentication middleware.

Only ADMIN users can access Subject APIs.

====================================================

FRONTEND

Replace the placeholder Subjects page.

The page should include:

- Sheet selector
- Subject table
- Search
- Status tabs
- Pagination
- Create Subject
- Edit Subject
- Archive Subject

States:

- Loading
- Empty
- Error

====================================================

UI

Reuse Sprint 4 design system.

Reuse Sprint 5 table, modal and confirmation dialog components wherever possible.

Do NOT duplicate UI.

====================================================

VALIDATION

Title required.

Sheet required.

Slug generated automatically.

Status validated.

Metadata remains dynamic.

Tags remain dynamic.

====================================================

RULES

Do not modify Sheet functionality except reusable refactoring.

Do not implement Chapters.

Do not implement Resources.

Do not implement Student UI.

Do not implement file uploads.

====================================================

TESTING

Verify:

- Subject creation
- Subject update
- Subject archive
- Pagination
- Search
- Status filtering
- Sheet filtering
- Duplicate title slug generation
- Only ADMIN access

Run:

- Backend
- Frontend
- Production build

====================================================

OUTPUT

Provide:

1. Files created
2. Files modified
3. Refactoring performed
4. Test results
5. Verification summary

Stop after Sprint 6.