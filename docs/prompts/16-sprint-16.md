You are continuing development of the PrepFlow project.

Read the Master Prompt and understand the complete project architecture before making any changes.

This is Sprint 16 ONLY.

Do NOT modify previous sprint implementations unless absolutely necessary.

==================================================

SPRINT 16

Admin Superpowers & Content Management

Theme:

"Manage thousands of educational resources efficiently."

==================================================

OBJECTIVE

Transform the Admin CMS into a professional content management system capable of handling thousands of educational resources with speed, consistency, and scalability.

This sprint focuses entirely on admin productivity.

Student experience must remain unchanged.

==================================================

FEATURE 1

Drag & Drop Ordering

Allow administrators to reorder:

• Sheets
• Subjects
• Chapters
• Resources

Requirements:

• Smooth drag & drop
• Optimistic UI updates
• Persist ordering in database
• Automatic numbering
• Minimal API calls

Ordering must remain stable after refresh.

==================================================

FEATURE 2

Clone System

Allow administrators to duplicate:

• Entire Sheet
• Subject
• Chapter

Examples:

MHT CET 2026

↓

Clone

↓

MHT CET 2027

Rules:

• Duplicate metadata

• Duplicate relationships

• Generate new IDs

• Do not duplicate analytics or student progress

==================================================

FEATURE 3

Bulk Actions

Support selecting multiple resources.

Bulk operations:

• Delete

• Archive

• Publish

• Unpublish

• Move Chapter

• Move Subject

• Update Tags

Bulk operations must provide success/error summaries.

==================================================

FEATURE 4

CSV Import

Allow administrators to upload CSV files.

Support importing:

• Subjects

• Chapters

• Resources

Requirements:

• Preview before import

• Row validation

• Duplicate detection

• Error reporting

• Import summary

Reject invalid rows without crashing.

==================================================

FEATURE 5

Advanced Search & Filters

Support filtering by:

• Subject

• Chapter

• Resource Type

• Status

• Difficulty

• Tags

Filters should work together with search.

==================================================

FEATURE 6

Admin Analytics Dashboard

Create a dashboard displaying:

• Total Sheets

• Total Subjects

• Total Chapters

• Total Resources

• Published

• Draft

• Archived

• Most Used Tags

• Recently Created Resources

Analytics should be lightweight and fast.

==================================================

FEATURE 7

Activity Log

Track important admin actions.

Examples:

Created Resource

Edited Resource

Deleted Resource

Created Chapter

Published Sheet

Bulk Import

Bulk Delete

Every log should include:

Admin

Timestamp

Action

Entity

Entity Name

==================================================

BACKEND

Create reusable services.

OrderingService

CloneService

BulkActionService

CSVImportService

AnalyticsService

ActivityLogService

Controllers should remain thin.

Business logic belongs only inside services.

==================================================

DATABASE

Create:

ActivityLog

Fields:

adminId

action

entityType

entityId

entityName

metadata

createdAt

--------------------------------------------------

Add displayOrder field to:

Sheet

Subject

Chapter

Resource

Use indexes where appropriate.

==================================================

API DESIGN

Create admin-only endpoints.

PATCH /api/admin/reorder

POST /api/admin/clone

POST /api/admin/bulk-actions

POST /api/admin/import

GET /api/admin/analytics

GET /api/admin/activity

Only expose required frontend fields.

==================================================

FRONTEND

Create reusable components.

DragDropList

BulkActionToolbar

CSVImportModal

CloneDialog

AnalyticsCard

ActivityTimeline

AdvancedFilterPanel

ReusableTableToolbar

All components should be modular and reusable.

==================================================

USER EXPERIENCE

The CMS should feel like a modern SaaS dashboard.

Support:

• Multi-select

• Confirmation dialogs

• Loading states

• Success notifications

• Error notifications

• Empty states

• Keyboard shortcuts where reasonable

==================================================

SECURITY

Admin only.

Validate:

• Entity existence

• Input

• Permissions

• CSV structure

• File size

Never trust frontend validation.

==================================================

PERFORMANCE

Use:

• MongoDB bulkWrite()

• Aggregation pipelines

• Transactions where appropriate

• Pagination

Avoid N+1 queries.

Optimize for thousands of resources.

==================================================

DESIGN

Follow the PrepFlow Design System.

Reuse existing UI primitives.

Do NOT introduce inconsistent styling.

Maintain:

• Card consistency

• Typography hierarchy

• Neutral dark theme

• Lucide icons

• Responsive layout

==================================================

DO NOT MODIFY

Authentication

Student Portal

Progress Tracking

Search System

Insights

Achievements

Workspace

Design System

Unless required for compatibility.

==================================================

BEFORE IMPLEMENTATION

Explain:

1. Admin CMS Architecture

2. Database Changes

3. Ordering Strategy

4. Clone Strategy

5. Bulk Operation Strategy

6. CSV Validation Strategy

7. Analytics Strategy

8. Activity Log Architecture

Only after architecture approval begin implementation.

==================================================

TESTING

Verify:

✓ Drag & Drop Ordering

✓ Clone Operations

✓ Bulk Actions

✓ CSV Import

✓ Search & Filters

✓ Analytics Dashboard

✓ Activity Logs

✓ Responsive Design

✓ No regressions

==================================================

OUTPUT

After implementation provide:

1. Architecture Summary

2. Files Created

3. Files Modified

4. Database Changes

5. Services Added

6. APIs Added

7. Components Added

8. Testing Summary

Stop after completing Sprint 16.