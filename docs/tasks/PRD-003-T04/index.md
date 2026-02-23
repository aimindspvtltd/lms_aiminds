# PRD-003-T04: Implement content block functionality (videos, documents)

**Parent PRD:** PRD-003_Course-Creation
**Status:** Pending
**Assignee:** ARCHITECT, UX, WORKER

---

## Overview

Implement the content block system that allows different types of content (videos, links, interactive documents) to be added to course modules. This includes backend support and frontend rendering.

---

## Requirements

1. Implement content block data model with type-specific configurations
2. Create backend APIs for content block CRUD operations
3. Build frontend components for each content type:
   - Video embed (YouTube, Vimeo, etc.)
   - External links with preview
   - Interactive documents (Markdown/HTML)
4. Implement video URL validation and embed generation
5. Create preview functionality for all content types
6. Support drag-drop reordering of content blocks
7. Handle edge cases (invalid URLs, embed restrictions)

---

## Content Types

### Video
- Support YouTube, Vimeo URLs
- Extract video metadata (duration, thumbnail)
- Generate responsive embed code
- Handle privacy-enhanced mode

### Link
- URL validation
- Fetch page metadata (title, description)
- Open in new tab option
- Preview card display

### Interactive Document
- Markdown editor with preview
- File attachment support
- Syntax highlighting for code blocks
- Print-friendly view

---

## Deliverables

1. Content block entity enhancements
2. Type-specific validation logic
3. Embed generation service
4. Frontend preview components
5. Content rendering components
6. URL parsing utilities
7. Tests for all content types

---

## Dependencies

- PRD-003-T01 (Data model)
- PRD-003-T02 (APIs)
- PRD-003-T03 (UI framework)

---

## Notes

- Consider content security policy for embeds
- Implement caching for metadata fetching
- Ensure mobile-friendly video embeds
- Plan for offline content access (Phase 2)