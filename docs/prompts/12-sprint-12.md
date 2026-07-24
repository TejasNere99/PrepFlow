You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 12 ONLY.

====================================================

SPRINT

Sprint 12

Learning Progress Tracking

====================================================

OBJECTIVE

Allow authenticated students to track their learning progress.

Students should be able to mark resources as completed and resume their learning journey.

Do not implement analytics in this sprint.

====================================================

ARCHITECTURE

Create a dedicated progress module.

Do NOT store progress inside User or Resource documents.

Create a separate UserProgress model.

====================================================

DATABASE

Create:

UserProgress

Fields:

userId

resourceId

completed (boolean)

completedAt

lastAccessedAt

timestamps

One document per:

User + Resource

====================================================

BACKEND

Create endpoints:

GET /api/progress

GET /api/progress/:sheetId

POST /api/progress/resource/:resourceId

PATCH /api/progress/resource/:resourceId

Behavior:

If progress exists:

update

Else:

create

====================================================

FRONTEND

Student Dashboard

Replace placeholder.

Show:

Continue Learning

Recent Activity

Overall Progress

Completed Resources

====================================================

RESOURCE CARD

If logged in:

Show checkbox/button

Mark Complete

Completed resources should display visual indication.

====================================================

PROGRESS

Calculate:

Chapter %

Subject %

Sheet %

Display progress bars.

====================================================

CONTINUE LEARNING

Student dashboard should automatically display:

Last opened Sheet

Last opened Chapter

Last opened Resource

Resume button

====================================================

UI

Reuse existing design system.

Create reusable:

ProgressBar

ProgressCard

ContinueLearningCard

====================================================

RULES

Guests can browse normally.

Only authenticated students have progress.

Admin behavior unchanged.

====================================================

TESTING

Verify:

Progress creation

Progress update

Continue Learning

Dashboard updates

Progress bars

Guest behavior

====================================================

OUTPUT

Provide:

Files created

Files modified

Progress architecture summary

Testing summary

Stop after Sprint 12.