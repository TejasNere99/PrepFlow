You are continuing development of the PrepFlow project.

Read and follow the existing project architecture.

This is Sprint 2 ONLY.

Do not implement anything outside Sprint 2.

====================================================

SPRINT

Sprint 2

Authentication Foundation

====================================================

OBJECTIVE

Build a production-quality authentication module for administrators.

The architecture must be scalable enough to support future student authentication without major changes.

====================================================

TECH STACK

Node.js

Express

MongoDB

Mongoose

JWT

bcrypt

====================================================

MODULES

Create a dedicated auth module.

Suggested structure:

auth/

controller

service

routes

validation

middleware

====================================================

USER MODEL

Create a User model.

Fields:

name

email

password

role

isActive

createdAt

updatedAt

Roles:

ADMIN

STUDENT

Only ADMIN will be used in Sprint 2.

====================================================

PASSWORD

Passwords must never be stored in plain text.

Use bcrypt.

Hash before saving.

====================================================

JWT

Generate JWT after successful login.

JWT payload should include:

User ID

Email

Role

Expiration:

7 days

JWT secret comes from environment variables.

====================================================

API ENDPOINTS

POST

/api/auth/login

GET

/api/auth/me

POST

/api/auth/logout

====================================================

LOGIN

Accept:

email

password

Return:

JWT

User Information

Do not return password.

====================================================

ME API

Return current authenticated user.

====================================================

LOGOUT

Keep logout simple.

No refresh token implementation.

====================================================

AUTH MIDDLEWARE

Create middleware that:

Verifies JWT

Loads current user

Rejects invalid tokens

====================================================

ROLE MIDDLEWARE

Create reusable middleware.

Example:

authorize("ADMIN")

Future roles should be supported.

====================================================

VALIDATION

Validate:

Email

Password

Missing fields

Invalid credentials

====================================================

ERROR HANDLING

Return consistent API responses.

Never expose stack traces.

====================================================

SECURITY

Hash passwords.

Never return passwords.

Protect JWT secret.

Validate every request.

====================================================

TEST DATA

Create ONE seed script only.

Purpose:

Create default administrator.

Email:

admin@prepflow.com

Password:

Admin123

Role:

ADMIN

Do not create student accounts.

====================================================

CODE QUALITY

Controllers should remain thin.

Business logic belongs inside services.

Routes should only register endpoints.

Never place business logic inside routes.

Never duplicate logic.

====================================================

DO NOT

Implement frontend login page.

Implement CMS.

Implement CRUD.

Implement refresh tokens.

Implement email verification.

Implement OAuth.

====================================================

TESTING

Verify:

Successful Login

Wrong Password

Wrong Email

Unauthorized Access

JWT Verification

Role Verification

GET /me

Logout

====================================================

OUTPUT

Provide production-quality implementation.

Keep architecture modular.

Do not modify Sprint 1 architecture.

Stop after Sprint 2.