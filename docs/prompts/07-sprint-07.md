You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 7 ONLY.

Do not implement anything outside Sprint 7.

====================================================

SPRINT

Sprint 7

Chapter Management CMS

====================================================

OBJECTIVE

Implement complete Chapter Management inside a Subject.

Every Chapter must belong to exactly one Subject.

Reuse the architecture, services, UI patterns and reusable components created in Sprint 5 and Sprint 6.

Do not duplicate code.

====================================================

BEFORE IMPLEMENTATION

1. Inspect the existing Sheet and Subject implementations.
2. Reuse common logic wherever possible.
3. Refactor only if it reduces duplication.
4. Do not change existing functionality.

====================================================

BACKEND

Implement:

- Chapter CRUD APIs
- Validation
- Service
- Controller
- Routes

Features:

- Automatic unique slug generation (scoped per Subject)
- Pagination
- Search
- Sort by display order
- Soft delete (status = ARCHIVED)

Every Chapter must reference exactly one Subject.

====================================================

API

POST   /api/chapters
GET    /api/chapters
GET    /api/chapters/:id
PUT    /api/chapters/:id
DELETE /api/chapters/:id

Support:

?page=
&limit=
&search=
&status=
&subjectId=
&sort=

====================================================

BUSINESS RULES

- Only ACTIVE Subjects can receive new Chapters.
- Chapters cannot be created inside ARCHIVED Subjects.
- Slug uniqueness must be scoped per Subject.
- Same chapter name is allowed under different Subjects.

Example:

Physics
 ├── Current Electricity
 ├── Current Electricity-2

Chemistry
 ├── Current Electricity

====================================================

FRONTEND

Replace the placeholder Chapters page.

Features:

- Sheet selector
- Subject selector (filtered by selected Sheet)
- Chapter table
- Search
- Status tabs
- Pagination
- Create Chapter
- Edit Chapter
- Archive Chapter

====================================================

UI

Reuse:

- Table
- Modal
- Confirmation Dialog
- Search Toolbar
- Status Tabs

Do not duplicate UI components.

====================================================

VALIDATION

Required:

- Sheet
- Subject
- Chapter Title

Metadata remains dynamic.

Tags remain dynamic.

====================================================

FUTURE EXTENSION

Inside archiveChapter(), leave a clear TODO indicating that once Resource Management is implemented, a Chapter containing Resources must not be archived.

Do not implement this logic yet.

====================================================

RULES

Do not modify Sheet functionality.

Do not modify Subject functionality except reusable refactoring.

Do not implement Resource Management.

Do not implement Student UI.

Do not implement File Uploads.

====================================================

TESTING

Verify:

- Chapter creation
- Chapter update
- Chapter archive
- Pagination
- Search
- Status filtering
- Subject filtering
- Sheet filtering
- Slug uniqueness per Subject
- Only ACTIVE Subjects appear in selector
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

Stop after Sprint 7.