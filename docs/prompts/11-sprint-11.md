You are continuing development of the PrepFlow project.

Read the Master Prompt and all previous Sprint implementations before making changes.

This is Sprint 11 ONLY.

====================================================

SPRINT

Sprint 11

Student Authentication & User Accounts

====================================================

OBJECTIVE

Introduce authentication for students while preserving the existing Admin CMS.

Students should be able to create an account, sign in, sign out, and access their personal dashboard.

Do NOT implement progress tracking yet.

====================================================

ARCHITECTURE

Reuse the existing authentication infrastructure wherever possible.

Avoid duplicating authentication logic.

Keep Admin and Student roles separated.

====================================================

BACKEND

Implement:

- Student registration
- Student login
- Student logout
- Get current authenticated student

Use JWT authentication.

Create a User role system if not already present.

Roles:

- ADMIN
- STUDENT

Only STUDENT accounts should access student dashboard features.

====================================================

FRONTEND

Create pages:

/login

/signup

/profile (optional placeholder)

/dashboard (student home)

The public learning pages should remain accessible without login.

====================================================

NAVIGATION

Anonymous user:

/

↓

Browse Sheets

↓

Open Resources

Logged-in student:

↓

Dashboard

↓

Continue Learning (placeholder)

====================================================

UI

Create reusable authentication components.

Maintain consistency with existing design system.

====================================================

RULES

Do not modify Admin CMS functionality.

Do not change existing CRUD APIs.

Do not implement progress tracking.

Do not implement analytics.

====================================================

TESTING

Verify:

Student registration

Student login

JWT persistence

Logout

Protected student routes

Admin authentication still works

====================================================

OUTPUT

Provide:

Files created

Files modified

Authentication flow summary

Testing summary

Stop after Sprint 11.