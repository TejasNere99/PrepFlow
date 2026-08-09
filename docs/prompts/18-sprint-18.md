# Sprint 18: Intelligent Study Planner

This sprint builds the personalized Study Planner on top of the Smart Learning Intelligence layer implemented in Sprint 17.

The goal is to transform PrepFlow from:

"Here is what you should study."

into:

"Here is what you should study today, in what order, and how much time you should spend on it."

The planner must be deterministic, explainable, scalable, and fully data-driven.

Do NOT introduce AI in this sprint.

The planner must reuse Sprint 17 intelligence and existing learning systems so that a future AI Coach can be layered on top without replacing the underlying planner architecture.

==================================================
PRODUCT GOAL
==================================================

Students should be able to provide their available study time and receive a personalized learning plan.

The planner should consider:

- Current learning progress
- Weak topics
- Smart recommendations
- Revision priorities
- Learning stages
- Pending resources
- Resource difficulty
- Estimated study time where available
- Existing RevisionSchedule
- Recently accessed content
- Current learning sequence

The system should generate:

Daily Study Plan

and

Weekly Study Plan

without requiring students to manually decide what to study.

==================================================
IMPORTANT ARCHITECTURAL PRINCIPLE
==================================================

The Study Planner must NOT duplicate the intelligence logic created in Sprint 17.

Use the existing:

- WeakTopicService
- RecommendationService
- RevisionPriorityService
- LearningInsightsService
- learningConstants.js

The planner should consume their outputs.

Architecture:

Student Data
      ↓
Learning Intelligence
      ↓
Priority / Recommendation Scores
      ↓
Study Planner
      ↓
Daily / Weekly Plan
      ↓
Student Dashboard

==================================================
USER EXPERIENCE
==================================================

Students should be able to configure:

- Available study time per day
- Preferred study days
- Optional preferred subjects
- Optional preferred study time

The planner should work even if the student provides minimal configuration.

Do NOT force students through a long setup form.

A student who simply selects:

"2 hours today"

should immediately receive a useful plan.

==================================================
STUDY PLAN GENERATION
==================================================

The planner should generate tasks based on priority.

Example:

Student availability:

2 hours

Planner output:

Today's Plan

1. Organic Chemistry
   40 minutes
   Weak Topic
   Priority: HIGH

2. Current Electricity Revision
   20 minutes
   Overdue Revision
   Priority: HIGH

3. Electrostatics Practice
   30 minutes
   Continue Current Stage

4. Electrostatics PYQs
   30 minutes
   Next Logical Stage

==================================================
TASK PRIORITY
==================================================

Create a deterministic scoring system.

Each candidate learning task should receive a normalized score from 0–100.

Possible factors:

- Weakness Score
- Recommendation Score
- Revision Priority Score
- Learning Stage Priority
- Pending Resources
- Staleness
- Existing progress
- Resource estimated duration

Do NOT hardcode individual subjects, chapters, or resources.

The scoring system must work for any future Sheet, Subject, Chapter, or Resource.

==================================================
LEARNING STAGE AWARENESS
==================================================

Use the existing learning stages:

LECTURE
NOTES
PRACTICE
EXERCISE
PYQS
CHALLENGE
REVISION

The planner should respect the logical learning sequence.

Example:

If a student has unfinished PRACTICE resources, the planner should generally prioritize those before recommending later stages.

However, overdue revisions and high-priority weak topics may override the normal sequence.

The override logic must be deterministic and documented.

==================================================
TIME ALLOCATION
==================================================

The planner must respect the student's available study time.

Example:

Available:

120 minutes

Generated tasks:

40 + 30 + 20 + 30 = 120 minutes

Never knowingly generate a plan exceeding the requested time.

If a task requires more time than the remaining availability:

- Split the task if possible
- Otherwise defer it to another session

Do not silently exceed the student's time limit.

==================================================
RESOURCE DURATION
==================================================

Use estimated duration when available through resource metadata.

If duration is unavailable:

Use a configurable fallback duration.

Do NOT hardcode durations directly inside components or controllers.

Place fallback values inside a centralized planner configuration/constants file.

==================================================
DAILY PLAN
==================================================

Create a Daily Plan generation service.

The service should:

1. Fetch the student's current learning state.
2. Fetch relevant Sprint 17 intelligence.
3. Build candidate learning tasks.
4. Score candidates.
5. Sort them by priority.
6. Allocate available study time.
7. Generate an ordered daily plan.

Each task should contain structured data.

Example:

{
  "taskId": "...",
  "resourceId": "...",
  "title": "Electrostatics Practice",
  "type": "PRACTICE",
  "reason": "Continue your current learning stage",
  "priority": "HIGH",
  "score": 91,
  "estimatedMinutes": 30,
  "completed": false,
  "resumeUrl": "/resources/..."
}

==================================================
WEEKLY PLAN
==================================================

Generate a weekly plan based on:

- Student availability
- Preferred study days
- Pending learning work
- Weak topics
- Revision schedules
- Current learning sequence

Example:

Monday
- Physics Practice
- Chemistry Revision

Tuesday
- Mathematics Lecture
- Physics PYQs

Wednesday
- Chemistry Practice
- Mathematics Revision

The weekly planner should distribute workload instead of placing everything on one day.

==================================================
PLAN PERSISTENCE
==================================================

Determine whether a generated plan should be persisted.

Use the following principle:

Generated recommendations should remain dynamic.

However, once a student explicitly accepts or starts a plan, the selected plan/tasks should become stable enough to track:

- Completed
- Skipped
- Rescheduled

Do NOT create unnecessary duplicated copies of resources.

If persistence is required, store references to existing resources rather than duplicating resource data.

==================================================
PLAN TASK STATUS
==================================================

Support:

- UPCOMING
- IN_PROGRESS
- COMPLETED
- SKIPPED
- RESCHEDULED

Statuses should be centralized constants.

==================================================
PLAN REGENERATION
==================================================

The planner must support regeneration.

Example:

Student originally has:

2 hours

Completes only:

60 minutes

The student should be able to regenerate the remaining plan.

The regenerated plan must respect:

- Completed tasks
- Remaining time
- Current progress
- New priorities

Do not recreate already completed work.

==================================================
BACKEND
==================================================

Create a dedicated planner domain.

Suggested files:

backend/src/services/studyPlannerService.js

backend/src/controllers/studyPlannerController.js

backend/src/routes/studyPlannerRoutes.js

If persistence requires a model, introduce the minimum necessary model only after analyzing whether existing Progress/Revision data can support the requirement.

Do NOT create a collection simply for convenience.

==================================================
API
==================================================

Design authenticated STUDENT-only APIs.

Possible endpoints:

GET /api/student/planner/today

GET /api/student/planner/week

POST /api/student/planner/generate

PATCH /api/student/planner/tasks/:taskId

POST /api/student/planner/regenerate

The exact API structure should be finalized during architecture review.

Do not blindly implement these endpoints if the existing project routing architecture suggests a better structure.

==================================================
FRONTEND
==================================================

Create reusable components.

Suggested components:

StudyPlanner.jsx

DailyPlanCard.jsx

WeeklyPlan.jsx

StudySessionCard.jsx

PlannerSettingsModal.jsx

PlanProgress.jsx

==================================================
STUDENT DASHBOARD
==================================================

Integrate the planner into StudentDashboard.

Recommended layout:

Learning Overview

↓

Continue Learning / Smart Recommendation

↓

Today's Study Plan

↓

Weak Topics / Revision Priorities

↓

Weekly Plan

The planner should NOT destroy or remove existing Sprint 17 widgets.

Integrate it into the existing dashboard hierarchy.

==================================================
PLANNER SETTINGS
==================================================

Allow students to configure:

- Daily study minutes
- Preferred study days
- Optional subject preference
- Optional preferred study time

All settings must be user-specific.

Do not hardcode a single global schedule.

==================================================
NOTIFICATIONS COMPATIBILITY
==================================================

Sprint 20 will introduce notifications.

Therefore planner tasks should expose enough information for future reminders:

- taskId
- resourceId
- scheduledDate
- estimatedMinutes
- status
- priority

Do NOT implement notification delivery in Sprint 18.

==================================================
GOAL ENGINE COMPATIBILITY
==================================================

Sprint 19 will introduce Goals.

Therefore the planner should expose structured completion data that can later be consumed by the Goal Engine.

Avoid tightly coupling planner logic to goals.

==================================================
FUTURE AI COMPATIBILITY
==================================================

Future AI Coach should be able to explain:

"Why was this task recommended?"

Therefore every generated task should contain a structured reason and scoring metadata.

Example:

{
  "reasonType": "WEAK_TOPIC",
  "reason": "Physics Electrostatics has a weakness score of 82",
  "score": 91
}

Do not generate AI explanations yet.

==================================================
PERFORMANCE
==================================================

- Avoid N+1 queries.
- Reuse Sprint 17 services.
- Prefer aggregation for large datasets.
- Avoid recalculating identical intelligence multiple times.
- Return lightweight DTOs.
- Do not fetch unnecessary resource fields.
- Keep controllers thin.
- Keep business logic inside services.

The architecture should remain viable for 10,000+ users and future 100,000+ users.

==================================================
SECURITY
==================================================

All planner APIs must:

- Require authentication.
- Require STUDENT role.
- Scope every query to the authenticated user.
- Never allow a student to modify another student's plan.
- Never trust user-provided userId.
- Validate resource references before persisting tasks.

==================================================
DESIGN
==================================================

Follow the existing PrepFlow design system.

The planner should feel:

- Premium
- Minimal
- Dark
- Calm
- Notion/Linear inspired
- Information dense but not cluttered

Do NOT introduce colorful gamification yet.

Use existing reusable UI primitives.

==================================================
IMPORTANT ARCHITECTURAL RULES
==================================================

❌ Do NOT introduce AI.

❌ Do NOT duplicate Sprint 17 intelligence algorithms.

❌ Do NOT hardcode subjects.

❌ Do NOT hardcode chapters.

❌ Do NOT hardcode resources.

❌ Do NOT duplicate resource documents.

❌ Do NOT break existing Progress, Revision, Search, Workspace, or Dashboard functionality.

❌ Do NOT create unnecessary collections.

✅ Everything must remain data-driven.

✅ Everything must remain reusable.

✅ Everything must be explainable.

✅ Everything must be extensible.

==================================================
VERIFICATION PLAN
==================================================

Test at least the following scenarios:

1. Student with no progress.

2. Student with partial progress.

3. Student with weak topics.

4. Student with overdue revisions.

5. Student with limited available time.

6. Student with more tasks than available time.

7. Student completing a planned task.

8. Student skipping a task.

9. Student regenerating the remaining plan.

10. Student changing daily availability.

11. Student with preferred study days.

12. Student with multiple subjects.

13. Student with no estimated resource duration.

14. Student attempting to access another student's plan.

15. Guest attempting to access planner APIs.

16. Verify existing Sprint 17 intelligence remains functional.

17. Verify existing Progress and Revision systems remain functional.

==================================================
EXPECTED IMPLEMENTATION WALKTHROUGH
==================================================

Before coding:

1. Analyze the existing PrepFlow architecture.
2. Inspect Sprint 17 intelligence services.
3. Inspect ResourceProgress.
4. Inspect RevisionSchedule.
5. Inspect Resource metadata.
6. Inspect existing student routing.
7. Determine whether a persistent planner model is actually necessary.
8. Identify all dependencies.
9. Explain the final architecture.
10. Provide the implementation plan.

Only after the architecture is approved should implementation begin.

After implementation provide:

- Architecture Summary
- Planner Algorithm
- Scoring Formula
- Time Allocation Strategy
- Persistence Decision
- API Endpoints
- Database Changes
- Files Created
- Files Modified
- Frontend Components
- Verification Results
- Known Limitations
- Future Extension Points