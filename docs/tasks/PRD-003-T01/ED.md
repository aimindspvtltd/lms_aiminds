# PRD-003-T01: Engineering Design - Data Model for Course Creation

## Overview

This document details the data model design for the Course Creation feature, including database schemas, relationships, and migration scripts.

## Data Model Design

### Entity Relationship Diagram

```
Organization
    |
    ├─── Course (1:N)
    │        |
    │        └─── Module (1:N)
    │                 |
    │                 └─── ContentBlock (1:N)
    │                           |
    │                           └─── Quiz (optional reference for future)
    |
    └─── User (for audit columns)
```

### Database Schema

#### 1. Course Table

```sql
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    org_id BIGINT NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER,
    access_mode VARCHAR(20) NOT NULL DEFAULT 'SEQUENTIAL' CHECK (access_mode IN ('SEQUENTIAL', 'OPEN')),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT courses_org_title_unique UNIQUE (org_id, title)
);

CREATE INDEX idx_courses_org_id ON courses(org_id);
CREATE INDEX idx_courses_status ON courses(status);
```

#### 2. Module Table (Sessions)

```sql
CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT modules_course_sort_unique UNIQUE (course_id, sort_order)
);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_sort_order ON modules(sort_order);
```

#### 3. ContentBlock Table

```sql
CREATE TABLE content_blocks (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('VIDEO', 'LINK', 'INTERACTIVE_DOCUMENT', 'QUIZ_PRACTICE', 'QUIZ_EVALUATION')),
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL,
    config_json JSONB NOT NULL DEFAULT '{}',
    quiz_id BIGINT REFERENCES quizzes(id), -- For future quiz integration
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT content_blocks_module_sort_unique UNIQUE (module_id, sort_order)
);

CREATE INDEX idx_content_blocks_module_id ON content_blocks(module_id);
CREATE INDEX idx_content_blocks_type ON content_blocks(type);
CREATE INDEX idx_content_blocks_sort_order ON content_blocks(sort_order);
CREATE INDEX idx_content_blocks_quiz_id ON content_blocks(quiz_id);
```

### Config JSON Schema

The `config_json` field in content_blocks stores type-specific configuration:

#### VIDEO Type
```json
{
    "url": "https://youtube.com/watch?v=...",
    "platform": "youtube|vimeo|custom",
    "duration_seconds": 300,
    "thumbnail_url": "https://..."
}
```

#### LINK Type
```json
{
    "url": "https://example.com/resource",
    "description": "Brief description of the resource",
    "open_in_new_tab": true
}
```

#### INTERACTIVE_DOCUMENT Type
```json
{
    "content": "Markdown or HTML content",
    "format": "markdown|html",
    "attachments": [
        {
            "name": "file.pdf",
            "url": "https://...",
            "size_bytes": 1024000
        }
    ]
}
```

#### QUIZ_PRACTICE / QUIZ_EVALUATION Type
```json
{
    "time_limit_minutes": 30,  // null for practice
    "marks": 100,              // only for evaluation
    "passing_marks": 40        // only for evaluation
}
```

## Migration Scripts

### V003_001__create_course_tables.sql

```sql
-- Create courses table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    org_id BIGINT NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER,
    access_mode VARCHAR(20) NOT NULL DEFAULT 'SEQUENTIAL' CHECK (access_mode IN ('SEQUENTIAL', 'OPEN')),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT courses_org_title_unique UNIQUE (org_id, title)
);

CREATE INDEX idx_courses_org_id ON courses(org_id);
CREATE INDEX idx_courses_status ON courses(status);

-- Create modules table
CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT modules_course_sort_unique UNIQUE (course_id, sort_order)
);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_sort_order ON modules(sort_order);

-- Create content_blocks table
CREATE TABLE content_blocks (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('VIDEO', 'LINK', 'INTERACTIVE_DOCUMENT', 'QUIZ_PRACTICE', 'QUIZ_EVALUATION')),
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL,
    config_json JSONB NOT NULL DEFAULT '{}',
    quiz_id BIGINT, -- Will add foreign key constraint when quiz table exists
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL REFERENCES users(id),
    updated_by BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT content_blocks_module_sort_unique UNIQUE (module_id, sort_order)
);

CREATE INDEX idx_content_blocks_module_id ON content_blocks(module_id);
CREATE INDEX idx_content_blocks_type ON content_blocks(type);
CREATE INDEX idx_content_blocks_sort_order ON content_blocks(sort_order);
CREATE INDEX idx_content_blocks_quiz_id ON content_blocks(quiz_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON content_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Entity Classes

### Course.java
```java
@Entity
@Table(name = "courses")
public class Course extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Column(name = "duration_days")
    private Integer durationDays;
    
    @Column(name = "access_mode")
    @Enumerated(EnumType.STRING)
    private AccessMode accessMode = AccessMode.SEQUENTIAL;
    
    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.DRAFT;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @OrderBy("sortOrder ASC")
    private List<Module> modules = new ArrayList<>();
}
```

### Module.java
```java
@Entity
@Table(name = "modules")
public class Module extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
    
    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    @OrderBy("sortOrder ASC")
    private List<ContentBlock> contentBlocks = new ArrayList<>();
}
```

### ContentBlock.java
```java
@Entity
@Table(name = "content_blocks")
public class ContentBlock extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType type;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
    
    @Type(type = "jsonb")
    @Column(name = "config_json", columnDefinition = "jsonb")
    private Map<String, Object> config = new HashMap<>();
    
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz; // For future integration
}
```

## Enums

```java
public enum AccessMode {
    SEQUENTIAL,
    OPEN
}

public enum CourseStatus {
    DRAFT,
    PUBLISHED,
    ARCHIVED
}

public enum ContentType {
    VIDEO,
    LINK,
    INTERACTIVE_DOCUMENT,
    QUIZ_PRACTICE,
    QUIZ_EVALUATION
}
```

## Notes

1. All tables include audit columns with automatic updated_at triggers
2. Cascade deletes are configured for maintaining referential integrity
3. Unique constraints ensure no duplicate sort orders within same parent
4. Indexes are added for foreign keys and frequently queried columns
5. The quiz_id field in content_blocks is prepared for future quiz integration
6. JSONB type is used for config_json to enable efficient querying