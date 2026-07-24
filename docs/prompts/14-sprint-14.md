You are continuing development of the PrepFlow project.

Read the Master Prompt and understand the complete project architecture before making any changes.

This is Sprint 14 ONLY.

Do NOT modify previous sprint implementations unless absolutely necessary.

==================================================

SPRINT 14

Smart Discovery & Learning Navigation

Theme:

"Students should never waste time searching."

==================================================

OBJECTIVE

The goal of this sprint is to make every learning resource discoverable within seconds.

PrepFlow is a Preparation Operating System.

Searching for study material should never become a task.

Students should be able to instantly discover, navigate, and resume their learning journey.

Everything must remain dynamic and data-driven.

==================================================

FEATURE 1

Universal Search

Create a global search system capable of searching across the complete learning hierarchy.

Searchable entities:

• Sheets
• Subjects
• Chapters
• Resources

The search must automatically include future entities created through the Admin CMS.

Search should work using:

• Sheet Name
• Subject Name
• Chapter Name
• Resource Title
• Resource Type
• Dynamic Tags
• Dynamic Metadata

Do not hardcode searchable fields.

==================================================

FEATURE 2

Search Ranking Engine

Search results should be ranked intelligently.

Priority:

1. Exact Match
2. Starts With
3. Contains
4. Tag Match
5. Metadata Match

More relevant results should always appear first.

==================================================

FEATURE 3

Global Search Overlay

Instead of a dedicated page, implement a reusable search overlay.

Requirements:

• Opens from search icon
• Opens using Ctrl + K
• ESC closes overlay
• Keyboard navigation
• Highlight selected result
• Press Enter to open selected result

Provide:

• Loading State
• Empty State
• No Results State

==================================================

FEATURE 4

Recently Viewed

Automatically maintain recently viewed resources.

Backend should store recently accessed resources.

Dashboard should display the latest 10 resources.

Each item should contain:

• Resource Title
• Chapter
• Subject
• Last Accessed Time

Students should never manually manage this list.

==================================================

FEATURE 5

Resume Learning

Upgrade the existing Continue Learning feature.

Instead of opening only the sheet,

Resume should navigate directly to:

Sheet

↓

Subject

↓

Chapter

↓

Last Accessed Resource

The student should continue exactly where they left off.

==================================================

FEATURE 6

Related Resources

Every Resource page should display related resources.

Recommendation priority:

1. Same Chapter
2. Same Subject
3. Same Tags
4. Similar Resource Type

Avoid duplicate recommendations.

Keep recommendation logic inside the backend.

==================================================

FEATURE 7

Breadcrumb Navigation

Every learning page should display:

Sheet

>

Subject

>

Chapter

>

Resource

Every level should be clickable.

==================================================

BACKEND

Create reusable services.

SearchService

Responsible for:

• Searching
• Ranking
• Filtering

RecentActivityService

Responsible for:

• Recently Viewed
• Resume Learning

RecommendationService

Responsible for:

• Related Resources
• Recommendation Logic

Keep controllers thin.

Business logic belongs only inside services.

==================================================

API DESIGN

Create scalable public APIs.

Example:

GET

/api/public/search?q=kinematics

Response:

{
    "sheets": [],
    "subjects": [],
    "chapters": [],
    "resources": []
}

Do not expose unnecessary database fields.

==================================================

FRONTEND

Create reusable components.

SearchOverlay

SearchInput

SearchResults

SearchResultCard

RecentlyViewedCard

RelatedResources

Breadcrumb

ResumeLearningButton

Every component must be reusable.

==================================================

UX REQUIREMENTS

Implement:

• Debounced Search
• Keyboard Navigation
• Ctrl + K Shortcut
• ESC Close
• Loading State
• Empty State
• No Results State

Animations should be subtle.

Maintain the existing dark theme.

==================================================

PERFORMANCE

The system should remain scalable for:

100+ Sheets

500+ Subjects

5000+ Chapters

50000+ Resources

Avoid unnecessary database queries.

Reuse existing models.

Implement efficient MongoDB queries.

==================================================

RULES

Do NOT modify:

• Authentication
• Admin CMS
• Progress System

Do NOT duplicate business logic.

Everything must remain:

• Modular
• Reusable
• Data Driven
• Future Ready
• Production Grade

==================================================

BEFORE IMPLEMENTATION

Explain:

1. Search Architecture
2. Search Ranking Strategy
3. Recommendation Strategy
4. Database Query Strategy
5. Performance Considerations
6. Reusable Component Architecture

Only after the architecture is approved, begin implementation.

==================================================

TESTING

Verify:

✓ Universal Search works correctly.

✓ Ranking returns the most relevant results.

✓ Search overlay functions using keyboard shortcuts.

✓ Resume Learning opens the exact last accessed resource.

✓ Recently Viewed updates automatically.

✓ Related Resources are contextually relevant.

✓ Breadcrumb navigation works correctly.

✓ Responsive design.

✓ No regressions in existing functionality.

==================================================

OUTPUT

After implementation provide:

1. Architecture Summary

2. Files Created

3. Files Modified

4. API Summary

5. Search Ranking Explanation

6. Recommendation Logic

7. Testing Summary

Stop after completing Sprint 14.