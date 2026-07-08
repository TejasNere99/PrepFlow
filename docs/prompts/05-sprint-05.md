Continue the PrepFlow project.

Sprint 5 only.

Read the existing architecture before making changes.

Objective:
Implement complete Sheet Management (Admin CMS for Sheets only).

Requirements:

Backend:
- CRUD APIs for Sheet.
- Service layer.
- Controller layer.
- Routes.
- Validation.
- Soft delete using status = ARCHIVED.
- Search by title.
- Sort by order.

Frontend:
- Replace placeholder Sheets page.
- Display sheets in a clean table.
- Create Sheet modal.
- Edit Sheet modal.
- Archive confirmation dialog.
- Loading state.
- Empty state.
- Error state.

Security:
- Protect all APIs with existing auth middleware.
- Only ADMIN role can access.

Do not implement Subjects, Chapters, Resources or any Sprint 6 functionality.

After implementation:
1. Run frontend build.
2. Run backend.
3. Test all APIs.
4. Verify create, update, archive and list operations.
5. Provide a summary of modified files and test results.