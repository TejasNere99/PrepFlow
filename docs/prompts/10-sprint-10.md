You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 10 ONLY.

Do not implement anything outside Sprint 10.

====================================================

SPRINT

Sprint 10

Student Learning Experience Foundation

====================================================

OBJECTIVE

Implement the first version of the Student Experience.

The Admin CMS is already complete.

Students must now be able to browse learning content.

This sprint is READ ONLY.

Students cannot modify any data.

====================================================

BEFORE IMPLEMENTATION

Inspect the existing CMS architecture.

Reuse the existing APIs.

Do NOT duplicate business logic.

Do NOT create separate student models.

====================================================

BACKEND

Do NOT create new CRUD.

Create only read-only endpoints if absolutely required.

Reuse existing services whenever possible.

Only ACTIVE entities should be returned.

Archived, Hidden and Draft content must never appear to students.

====================================================

STUDENT HIERARCHY

Student opens

Sheet

↓

Subject Tabs

↓

Chapter Accordion

↓

Resource Cards

====================================================

FRONTEND

Create a new Student area.

Suggested routes:

/

Sheets

/sheets/:sheetSlug

====================================================

HOME PAGE

Display all ACTIVE Sheets.

Each card should show:

Title

Description

Tags

Estimated Hours (if available)

Subject Count

====================================================

SHEET PAGE

When a student opens a Sheet:

Top section:

Title

Description

Tags

Estimated Hours

----------------------------------------------------

Below:

Subject Tabs

Example

Mathematics

Physics

Chemistry

----------------------------------------------------

When a Subject is selected

Display Chapters

Use accordion UI.

Each Chapter expands independently.

----------------------------------------------------

Inside Chapter

Display Resource Cards.

====================================================

RESOURCE CARD

Show:

Title

Resource Type

Description

Tags

Preview button

Open Resource button

====================================================

RESOURCE OPENING

External URL

↓

Open new tab

Storage URL

↓

Open new tab

No upload implementation.

====================================================

UI

Reuse existing design system.

Create reusable:

SheetCard

ChapterAccordion

ResourceCard

StudentHeader

====================================================

SEARCH

Add local search inside a Sheet.

Student can search:

Chapter title

Resource title

====================================================

RULES

No authentication.

No progress tracking.

No completion state.

No editing.

No CMS controls.

No delete buttons.

Read-only experience only.

====================================================

TESTING

Verify:

Home page

Sheet listing

Sheet details

Subject tabs

Accordion

Resource cards

Preview

Search

Responsive layouts

====================================================

OUTPUT

Provide:

Files created

Files modified

Verification summary

Stop after Sprint 10.