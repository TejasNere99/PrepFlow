You are continuing the PrepFlow project.

Read the Master Prompt and all Sprint implementations before making changes.

This is Sprint 9 ONLY.

====================================================

SPRINT

Sprint 9

CMS Polish & Architecture Refactoring

====================================================

OBJECTIVE

Improve code quality, maintainability, performance, accessibility and UX without changing business functionality.

This sprint is NOT for adding new CMS entities or Student View.

====================================================

REFACTORING

Inspect the implementations from Sprint 5–8.

Identify duplicated code.

Extract reusable components, hooks and utilities where appropriate.

Do not change application behavior.

====================================================

CREATE OR IMPROVE

Reusable DataTable

Reusable CRUD Modal

Reusable Confirmation Dialog

Reusable Search Toolbar

Reusable Status Tabs

Reusable Empty State

Reusable Error State

Reusable Loading Skeleton

====================================================

HOOKS

Create reusable hooks where duplication exists.

Examples:

useCrud

usePagination

useSearch

useFilters

useModal

====================================================

PERFORMANCE

Debounce search inputs.

Memoize expensive renders.

Lazy-load admin pages where appropriate.

Avoid unnecessary re-renders.

====================================================

UX

Improve:

- Sticky table headers
- Consistent spacing
- Keyboard accessibility
- ESC closes modal
- Focus trap
- Better mobile layouts
- Consistent toasts

Fix any remaining modal scrolling issues globally.

====================================================

ACCESSIBILITY

Add appropriate ARIA attributes.

Ensure all forms are keyboard accessible.

====================================================

RULES

Do not change database schema.

Do not change APIs.

Do not change business logic.

Do not implement Student View.

Do not implement Progress Tracking.

====================================================

TESTING

Verify all existing CMS modules continue working:

- Sheets
- Subjects
- Chapters
- Resources

Run frontend build.

Run backend.

Verify no regressions.

====================================================

OUTPUT

Provide:

1. Refactoring summary
2. Files modified
3. Performance improvements
4. UX improvements
5. Accessibility improvements
6. Test results

Stop after Sprint 9.