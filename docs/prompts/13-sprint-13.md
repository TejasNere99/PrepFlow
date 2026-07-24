You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 13 ONLY.

====================================================

SPRINT

Sprint 13

Student Insights & Motivation

====================================================

OBJECTIVE

Transform PrepFlow from a progress tracker into a motivating learning platform.

Students should receive meaningful insights about their learning journey.

Do not modify the existing CMS.

Do not modify authentication.

Do not change progress architecture.

====================================================

BACKEND

Reuse ResourceProgress.

Create summary endpoints where required.

Provide:

- Overall Progress
- Daily Activity
- Weekly Activity
- Subject Progress
- Chapter Completion
- Remaining Resources

Return all calculations from the backend.

Frontend must only render data.

====================================================

FRONTEND

Enhance Student Dashboard.

====================================================

SECTION 1

Learning Overview

Display:

Overall Progress

Completed Resources

Remaining Resources

Total Resources

====================================================

SECTION 2

Learning Insights

Examples:

You completed 8 resources this week.

Physics is your strongest subject.

Only 5 resources left to complete Mathematics.

====================================================

SECTION 3

Daily Streak

Display:

Current Streak

Longest Streak

Last Study Date

If no activity:

Display encouragement message.

====================================================

SECTION 4

Weekly Activity

Show:

Mon

Tue

Wed

Thu

Fri

Sat

Sun

Resources completed each day.

Use a lightweight bar chart.

====================================================

SECTION 5

Achievement Cards

Examples:

First Resource Completed

10 Resources Completed

50% Sheet Complete

100 Resources Completed

Design achievement system for future expansion.

====================================================

SECTION 6

Motivation Cards

Examples:

You're only 3 resources away from finishing Physics.

Finish this chapter to reach 75%.

Great consistency this week!

Generate these dynamically.

====================================================

UI

Create reusable:

StatCard

AchievementCard

InsightCard

WeeklyActivityChart

StreakCard

====================================================

RULES

Do not change existing progress APIs.

Extend them if required.

Do not modify authentication.

Do not modify Admin CMS.

====================================================

TESTING

Verify:

Dashboard renders correctly.

Statistics are correct.

Achievements unlock.

Streak updates.

Charts update.

Responsive layouts.

====================================================

OUTPUT

Provide:

Files created

Files modified

Insight engine summary

Achievement logic

Testing summary

Stop after Sprint 13.