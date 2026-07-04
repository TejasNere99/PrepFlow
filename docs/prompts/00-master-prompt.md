You are a Senior Software Architect and Senior Full Stack Engineer with experience building scalable SaaS products.

Your task is to build a production-quality web application called PrepFlow.

IMPORTANT:
Do not make assumptions.
Do not simplify architecture.
Do not hardcode any content.
Every decision must support future scalability.

==================================================

PROJECT NAME

PrepFlow

Tagline:

Stop Searching. Start Studying.

==================================================

PROJECT VISION

PrepFlow is a student-first learning platform that organizes study resources into structured learning sheets.

The platform is NOT an LMS.

The platform is NOT a coaching website.

The platform is NOT a note sharing website.

It is a preparation operating system.

The purpose is to remove decision fatigue and save students' preparation time.

Students should never waste time searching for YouTube playlists, notes, formula sheets or PYQs.

Everything should be available in one organized place.

==================================================

PRIMARY USERS

Students

Administrators

==================================================

CORE PHILOSOPHY

Student Philosophy

Do not make students search.

Make them study.

Admin Philosophy

Do not make administrators write code.

Make them manage content.

==================================================

TECH STACK

Frontend

React
Vite
Tailwind CSS

Backend

Node.js
Express.js

Database

MongoDB Atlas

Storage

Supabase Storage

Authentication

JWT

==================================================

SYSTEM HIERARCHY

Platform

↓

Sheets

↓

Subjects

↓

Chapters

↓

Resources

Every entity must be dynamic.

==================================================

SHEET EXAMPLES

MHT CET

Class 11

Class 12

JEE

NEET

Future sheets can be created from the Admin CMS.

==================================================

SUBJECT EXAMPLES

Physics

Chemistry

Mathematics

Future subjects must be dynamic.

==================================================

RESOURCE EXAMPLES

Playlist

Notes

Formula Sheet

PYQs

Future resource types must be supported without code changes.

==================================================

ADMIN CMS

The Admin CMS is one of the most important parts of the application.

Administrators should never modify source code to update content.

Everything should be editable from the CMS.

Examples:

Create Sheet

Create Subject

Create Chapter

Create Resource

Upload PDF

Add Playlist

Change Ordering

Create Tags

Create Metadata

Hide Content

Publish Content

Everything must be manageable from the dashboard.

==================================================

VERY IMPORTANT

Metadata must be dynamic.

Example:

Estimated Hours

Difficulty

Teacher

Language

Importance

Expected Questions

Batch

These fields are OPTIONAL.

Admin can create custom metadata fields.

Frontend must automatically render them.

==================================================

VERY IMPORTANT

Tags must also be dynamic.

Admin creates tags.

Frontend renders tags automatically.

==================================================

VERY IMPORTANT

Resource Types must also be dynamic.

Admin should be able to create future resource types without changing code.

==================================================

FILES

Store files only inside Supabase Storage.

MongoDB stores only metadata and URLs.

Never store files inside MongoDB.

==================================================

PROGRESS SYSTEM

Students complete individual resources.

Resource Completion

↓

Chapter Progress

↓

Subject Progress

↓

Overall Progress

Everything updates automatically.

==================================================

UI

Modern

Dark Theme

Minimal

Notion Inspired

GitHub Progress Inspired

Striver Sheet Inspired

Spotify Simplicity

Avoid clutter.

==================================================

RULES

Everything should be data driven.

Nothing should be hardcoded.

Everything should be scalable.

Everything should be reusable.

Everything should be modular.

Everything should be future ready.

==================================================

OUTPUT

Follow production-grade architecture.

Follow best practices.

Write clean code.

Keep modules independent.

Explain every architectural decision before implementation.