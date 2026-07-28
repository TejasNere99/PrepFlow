You are continuing development of the PrepFlow project.

Read the Master Prompt and understand the complete project architecture before making any changes.

This is Sprint 15 ONLY.

Do NOT modify previous sprint implementations unless absolutely necessary.

==================================================

SPRINT 15

Personal Learning Workspace

Theme:

"Every student should have their own personalized study space."

==================================================

OBJECTIVE

PrepFlow should evolve from a shared learning platform into a personalized preparation operating system.

Students should be able to organize, annotate, bookmark, and plan their own preparation without affecting global content.

All personal data must belong exclusively to the authenticated student.

Admin CMS should remain completely independent.

==================================================

FEATURE 1

Bookmarks

Students should be able to bookmark any resource.

Supported resource types:

• Playlist
• Notes
• Formula Sheet
• PYQs
• Any future resource type

Dashboard should display:

• Recently Bookmarked Resources

Students can:

• Add Bookmark
• Remove Bookmark

Bookmarks must remain synchronized across devices.

==================================================

FEATURE 2

Personal Notes

Each resource should provide a personal notes section.

Students can:

• Create Notes
• Edit Notes
• Delete Notes

Notes are completely private.

Only the owner can access them.

Support:

• Multi-line text
• Auto-save
• Last Updated timestamp

==================================================

FEATURE 3

Favorites

Favorites are different from bookmarks.

Bookmarks are temporary.

Favorites represent important long-term study resources.

Dashboard should contain:

Favorite Resources

Students can:

• Add Favorite
• Remove Favorite

==================================================

FEATURE 4

Study Collections

Students should be able to create custom collections.

Examples:

Placement Preparation

Weak Topics

Revision

Interview Prep

Collections should support:

• Create
• Rename
• Delete

Resources can belong to multiple collections.

==================================================

FEATURE 5

Revision Planner

Students can schedule resources for revision.

Supported options:

• Tomorrow

• This Week

• Next Week

• Custom Date

Dashboard should display:

Upcoming Revision

Resources should automatically disappear after completion.

==================================================

FEATURE 6

Unified Resource Actions

Every resource should expose one reusable action component.

Supported actions:

⭐ Bookmark

❤️ Favorite

📝 Personal Note

📂 Add To Collection

📅 Schedule Revision

The component must remain reusable for future actions.

==================================================

BACKEND

Create reusable services.

BookmarkService

FavoriteService

NotesService

CollectionService

RevisionPlannerService

Keep controllers thin.

Business logic belongs only inside services.

==================================================

DATABASE

Create dedicated collections.

Bookmark

Favorite

Note

Collection

CollectionItem

RevisionSchedule

Requirements:

• Proper indexes

• userId ownership

• createdAt

• updatedAt

• Soft delete where appropriate

==================================================

API DESIGN

Create authenticated APIs.

Examples:

GET /api/student/bookmarks

POST /api/student/bookmarks

DELETE /api/student/bookmarks/:id

--------------------------------------------

GET /api/student/favorites

POST /api/student/favorites

DELETE /api/student/favorites/:id

--------------------------------------------

GET /api/student/notes/:resourceId

PUT /api/student/notes/:resourceId

--------------------------------------------

GET /api/student/collections

POST /api/student/collections

PATCH /api/student/collections/:id

DELETE /api/student/collections/:id

--------------------------------------------

POST /api/student/revision

GET /api/student/revision

Only expose fields required by the frontend.

==================================================

FRONTEND

Create reusable components.

ResourceActions

BookmarkButton

FavoriteButton

NotesEditor

CollectionModal

RevisionPlannerModal

BookmarksCard

FavoritesCard

CollectionsCard

UpcomingRevisionCard

Everything should be reusable.

==================================================

SECURITY

Every query must be scoped using the authenticated user.

A student must NEVER be able to:

• View another student's bookmarks

• View another student's notes

• View another student's collections

• View another student's revision schedule

Validate ownership on every request.

Return proper authorization errors.

==================================================

PERFORMANCE

Use indexes on:

• userId

• resourceId

• collectionId

Avoid N+1 queries.

Support future scaling to millions of personal records.

==================================================

RULES

Do NOT modify:

• Authentication

• Admin CMS

• Progress System

• Search Architecture

Everything must remain:

• Modular

• Reusable

• Scalable

• Data Driven

• Future Ready

• Production Grade

==================================================

BEFORE IMPLEMENTATION

Explain:

1. Personal Workspace Architecture

2. Database Relationships

3. Ownership Model

4. Security Strategy

5. API Design

6. Reusable Component Strategy

Only after the architecture is approved, begin implementation.

==================================================

TESTING

Verify:

✓ Bookmark CRUD

✓ Favorite CRUD

✓ Notes CRUD

✓ Collections CRUD

✓ Revision Planner

✓ Dashboard Widgets

✓ User Isolation

✓ Responsive UI

✓ No regressions

==================================================

OUTPUT

After implementation provide:

1. Architecture Summary

2. Files Created

3. Files Modified

4. Database Models

5. API Summary

6. Security Summary

7. Testing Summary

Stop after completing Sprint 15.