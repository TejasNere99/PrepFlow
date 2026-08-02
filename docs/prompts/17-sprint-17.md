# Sprint 17: Smart Learning Intelligence

This sprint transforms PrepFlow from a resource platform into an intelligent learning companion. The focus is to analyze student learning behavior and provide personalized guidance instead of simply tracking progress.

## User Review Required

> [!IMPORTANT]
> This sprint must **reuse the existing architecture**. Do NOT introduce unnecessary database collections or duplicate business logic.
>
> The following systems already exist and should be reused:
> - ResourceProgress
> - RevisionSchedule
> - UserResourcePreference (Bookmarks/Favorites)
> - Notes
> - Collections
> - Student Dashboard
> - Personal Workspace
>
> The intelligence layer should be generated dynamically using backend services and lightweight DTOs.

## Proposed Architecture

### 1. Weak Topic Engine
Create a reusable backend service that detects weak chapters based on:

- Completion percentage
- Pending resources
- Overdue revisions
- Days since last activity

Every weak topic should return:

- Priority (High / Medium / Low)
- Completion %
- Pending Resources
- Last Activity

---

### 2. Smart Recommendation Engine

Generate personalized recommendations such as:

- Continue unfinished chapter
- Start the next chapter according to the Sheet Structure
- Finish pending Practice/PYQs
- Revise overdue chapters

Recommendations must follow the learning flow instead of random resource ordering.

---

### 3. Revision Priority Engine

Prioritize scheduled revisions using:

- Due date
- Days overdue
- Completion history
- Recent activity

Return:

- Priority
- Due Date
- Resource
- Chapter

---

### 4. Learning Insights Engine

Generate positive, actionable insights such as:

- "You completed more Mathematics than Physics this week."
- "Organic Chemistry hasn't been studied in 9 days."
- "Only 3 resources remain to finish Algebra."
- "Your study consistency improved this week."

The backend generates structured insight objects.
The frontend only renders them.

---

### 5. Learning Timeline

Create a chronological activity feed.

Include:

- Resource Viewed
- Resource Completed
- Note Created
- Bookmark Added
- Favorite Added
- Revision Completed
- Collection Created

Newest first.

---

# Backend

## NEW Services

- `WeakTopicService`
- `RecommendationService`
- `RevisionPriorityService`
- `LearningInsightsService`
- `TimelineService`

## NEW Controllers

- `learningController.js`
- `timelineController.js`

## NEW Routes

- `GET /api/student/weak-topics`
- `GET /api/student/recommendations`
- `GET /api/student/revision-priorities`
- `GET /api/student/learning-insights`
- `GET /api/student/timeline`

All routes must:

- Require authentication
- Be accessible only to STUDENT users
- Return lightweight DTOs

---

# Frontend

## NEW Components

### `WeakTopicsCard.jsx`

Displays:

- Chapter
- Subject
- Completion %
- Priority Badge
- Resume Button

---

### `RecommendationsCard.jsx`

Displays:

- Recommendation
- Reason
- Resume Button

---

### `RevisionPriorityCard.jsx`

Displays:

- Revision Resource
- Due Date
- Priority

---

### `LearningTimeline.jsx`

Displays chronological student activity.

---

### `InsightsPanel.jsx`

Displays structured insights from the backend.

---

# MODIFY

### `StudentDashboard.jsx`

Redesign the dashboard while preserving existing widgets.

Recommended layout:

## Section 1

Learning Overview

(Existing Progress Cards)

---

## Section 2

Smart Recommendations

---

## Section 3

Weak Topics

---

## Section 4

Revision Priorities

---

## Section 5

Learning Insights

---

## Section 6

Learning Timeline

---

# Performance Requirements

- Reuse existing services whenever possible.
- Prefer MongoDB aggregation pipelines for calculations.
- Avoid duplicate database queries.
- Controllers must remain thin.
- Keep all business logic inside services.
- Follow the existing project architecture and design system.

---

# Constraints

❌ Do NOT modify:

- Authentication
- Admin CMS
- Resource Management
- Student Workspace
- Search
- Progress Tracking
- Existing APIs unless required for compatibility

Only extend the platform with intelligent learning capabilities.

---

# Verification Plan

## Manual Testing

- Login as a Student.
- Verify Recommendations are generated correctly.
- Verify Weak Topics are calculated accurately.
- Verify Revision Priorities update correctly.
- Verify Learning Timeline displays recent actions.
- Verify Insights change according to student activity.
- Verify Guests cannot access these endpoints.
- Verify no regressions in existing dashboard functionality.

---

# Expected Deliverables

After implementation provide:

1. Architecture Summary
2. Intelligence Algorithms Used
3. Files Created
4. Files Modified
5. Services Added
6. APIs Added
7. Components Added
8. Testing Summary

Do not begin coding immediately.

First analyze the current PrepFlow architecture, explain how each intelligence engine will work, identify any dependency issues, and produce a detailed implementation plan. Only after the architecture is finalized should implementation begin.