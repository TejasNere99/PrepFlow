You are continuing development of the PrepFlow project.

Read the existing architecture before implementation.

This is Sprint 3 ONLY.

Do not implement anything outside Sprint 3.

====================================================

SPRINT

Sprint 3

Database Foundation

====================================================

OBJECTIVE

Design and implement the complete database layer for PrepFlow.

The architecture must support future Admin CMS functionality without requiring schema redesign.

Do NOT create frontend pages.

Do NOT create CRUD APIs.

Do NOT create controllers.

Do NOT create services.

Do NOT create business logic.

Only create the data layer.

====================================================

DATABASE

MongoDB

Mongoose

====================================================

DATA HIERARCHY

Sheet

↓

Subject

↓

Chapter

↓

Resource

====================================================

MODEL 1

Sheet

Fields

title

description

slug

status

order

metadata

tags

createdBy

updatedBy

timestamps

====================================================

MODEL 2

Subject

Fields

sheetId (Reference)

title

description

slug

icon

order

status

metadata

tags

timestamps

====================================================

MODEL 3

Chapter

Fields

subjectId (Reference)

title

description

slug

order

status

metadata

tags

timestamps

====================================================

MODEL 4

Resource

Fields

chapterId (Reference)

title

description

resourceType

url

storageUrl

thumbnail

status

order

metadata

tags

timestamps

====================================================

IMPORTANT

metadata must be a flexible object.

Do NOT hardcode metadata fields.

Example

metadata

{

estimatedHours

difficulty

teacher

language

...

}

Admin can add future metadata without changing schema.

====================================================

IMPORTANT

tags must be an array of strings.

Unlimited.

====================================================

IMPORTANT

resourceType must support future values.

Do NOT use enum.

Store as String.

====================================================

STATUS

Use enum

ACTIVE

DRAFT

HIDDEN

ARCHIVED

====================================================

SLUGS

Every model should have a slug.

Future routing will use slugs.

====================================================

INDEXES

Create useful indexes.

Examples

slug

title

references

====================================================

VALIDATION

Required fields

Trim strings

Lowercase where appropriate

Unique slugs

====================================================

CODE QUALITY

Keep models independent.

Do not create circular dependencies.

Do not create APIs.

Do not create routes.

Do not create controllers.

Do not create services.

====================================================

TESTING

Create one script that inserts

One Sheet

One Subject

One Chapter

One Resource

Verify references work correctly.

After testing remove temporary test data.

====================================================

OUTPUT

Production-quality Mongoose models.

Explain every schema design decision.

Stop after Sprint 3.

Do not begin Sprint 4.