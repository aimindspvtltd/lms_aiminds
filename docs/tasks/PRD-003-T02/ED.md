# PRD-003-T02: Engineering Design - Backend APIs for Course Management

## Overview

This document details the backend API implementation for course, module, and content block management.

## API Specifications

### 1. Course Management APIs

#### GET /api/admin/courses
**Description:** Retrieve paginated list of courses for the organization

**Request Parameters:**
```
- page (int): Page number (default: 0)
- size (int): Page size (default: 20)
- sort (string): Sort field and direction (default: "createdAt,desc")
- status (string): Filter by status (DRAFT|PUBLISHED|ARCHIVED)
- search (string): Search in title and description
```

**Response:** 
```json
{
  "content": [
    {
      "id": 1,
      "title": "Core Java - 5 Days",
      "description": "Comprehensive Java programming course",
      "durationDays": 5,
      "accessMode": "SEQUENTIAL",
      "status": "PUBLISHED",
      "moduleCount": 10,
      "createdAt": "2024-02-23T10:00:00Z",
      "updatedAt": "2024-02-23T10:00:00Z",
      "createdBy": "admin@example.com",
      "updatedBy": "admin@example.com"
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "number": 0,
  "size": 20
}
```

#### POST /api/admin/courses
**Description:** Create a new course

**Request Body:**
```json
{
  "title": "Core Java - 5 Days",
  "description": "Comprehensive Java programming course",
  "durationDays": 5,
  "accessMode": "SEQUENTIAL",
  "status": "DRAFT"
}
```

**Validation Rules:**
- title: Required, 3-255 characters
- description: Optional, max 2000 characters
- durationDays: Optional, 1-365
- accessMode: Required, must be SEQUENTIAL or OPEN
- status: Optional, defaults to DRAFT

#### GET /api/admin/courses/{id}
**Description:** Get course details with modules

**Response:**
```json
{
  "id": 1,
  "title": "Core Java - 5 Days",
  "description": "Comprehensive Java programming course",
  "durationDays": 5,
  "accessMode": "SEQUENTIAL",
  "status": "PUBLISHED",
  "modules": [
    {
      "id": 1,
      "title": "Java Basics",
      "description": "Introduction to Java",
      "sortOrder": 1,
      "contentBlockCount": 5
    }
  ],
  "createdAt": "2024-02-23T10:00:00Z",
  "updatedAt": "2024-02-23T10:00:00Z",
  "createdBy": "admin@example.com",
  "updatedBy": "admin@example.com"
}
```

#### PUT /api/admin/courses/{id}
**Description:** Update course details

**Request Body:** Same as POST

#### DELETE /api/admin/courses/{id}
**Description:** Delete a course (only if DRAFT status)

### 2. Module Management APIs

#### GET /api/admin/courses/{courseId}/modules
**Description:** Get all modules for a course

**Response:**
```json
[
  {
    "id": 1,
    "title": "Java Basics",
    "description": "Introduction to Java",
    "sortOrder": 1,
    "contentBlockCount": 5,
    "createdAt": "2024-02-23T10:00:00Z",
    "updatedAt": "2024-02-23T10:00:00Z",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com"
  }
]
```

#### POST /api/admin/courses/{courseId}/modules
**Description:** Create a new module

**Request Body:**
```json
{
  "title": "Java Basics",
  "description": "Introduction to Java",
  "sortOrder": 1
}
```

**Validation Rules:**
- title: Required, 3-255 characters
- description: Optional, max 1000 characters
- sortOrder: Required, positive integer, unique within course

### 3. Content Block Management APIs

#### GET /api/admin/modules/{moduleId}/content-blocks
**Description:** Get all content blocks for a module

**Response:**
```json
[
  {
    "id": 1,
    "type": "VIDEO",
    "title": "Introduction to Java",
    "sortOrder": 1,
    "config": {
      "url": "https://youtube.com/watch?v=abc123",
      "platform": "youtube",
      "durationSeconds": 300
    },
    "createdAt": "2024-02-23T10:00:00Z",
    "updatedAt": "2024-02-23T10:00:00Z",
    "createdBy": "admin@example.com",
    "updatedBy": "admin@example.com"
  }
]
```

#### POST /api/admin/modules/{moduleId}/content-blocks
**Description:** Create a new content block

**Request Body:**
```json
{
  "type": "VIDEO",
  "title": "Introduction to Java",
  "sortOrder": 1,
  "config": {
    "url": "https://youtube.com/watch?v=abc123",
    "platform": "youtube",
    "durationSeconds": 300
  }
}
```

**Validation Rules:**
- type: Required, must be valid ContentType
- title: Required, 3-255 characters
- sortOrder: Required, positive integer, unique within module
- config: Required, must match type schema

## Implementation Details

### Controller Layer

#### CourseController.java
```java
@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
@Tag(name = "Course Management")
public class CourseController {
    
    private final CourseService courseService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<CourseDto>> getCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String search) {
        
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sort.split(",")));
        return ResponseEntity.ok(courseService.getCourses(pageRequest, status, search));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> createCourse(
            @Valid @RequestBody CreateCourseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        CourseDto course = courseService.createCourse(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(course);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDetailDto> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCourseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        return ResponseEntity.ok(courseService.updateCourse(id, request, userPrincipal.getId()));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
```

### Service Layer

#### CourseService.java
```java
@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final SecurityService securityService;
    
    @Transactional(readOnly = true)
    public Page<CourseDto> getCourses(PageRequest pageRequest, CourseStatus status, String search) {
        Organization org = securityService.getCurrentUserOrganization();
        
        Specification<Course> spec = CourseSpecifications.belongsToOrganization(org.getId());
        
        if (status != null) {
            spec = spec.and(CourseSpecifications.hasStatus(status));
        }
        
        if (StringUtils.hasText(search)) {
            spec = spec.and(CourseSpecifications.searchByTitleOrDescription(search));
        }
        
        return courseRepository.findAll(spec, pageRequest)
                .map(courseMapper::toDto);
    }
    
    public CourseDto createCourse(CreateCourseRequest request, Long userId) {
        Organization org = securityService.getCurrentUserOrganization();
        
        // Check for duplicate title
        if (courseRepository.existsByOrganizationIdAndTitle(org.getId(), request.getTitle())) {
            throw new BusinessException("Course with this title already exists");
        }
        
        Course course = courseMapper.toEntity(request);
        course.setOrganization(org);
        course.setCreatedBy(userId);
        course.setUpdatedBy(userId);
        
        course = courseRepository.save(course);
        return courseMapper.toDto(course);
    }
    
    @Transactional(readOnly = true)
    public CourseDetailDto getCourseById(Long id) {
        Course course = findCourseById(id);
        return courseMapper.toDetailDto(course);
    }
    
    public CourseDto updateCourse(Long id, UpdateCourseRequest request, Long userId) {
        Course course = findCourseById(id);
        
        if (!course.getTitle().equals(request.getTitle())) {
            // Check for duplicate title
            if (courseRepository.existsByOrganizationIdAndTitleAndIdNot(
                    course.getOrganization().getId(), request.getTitle(), id)) {
                throw new BusinessException("Course with this title already exists");
            }
        }
        
        courseMapper.updateEntity(course, request);
        course.setUpdatedBy(userId);
        
        course = courseRepository.save(course);
        return courseMapper.toDto(course);
    }
    
    public void deleteCourse(Long id) {
        Course course = findCourseById(id);
        
        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new BusinessException("Only draft courses can be deleted");
        }
        
        courseRepository.delete(course);
    }
    
    private Course findCourseById(Long id) {
        Organization org = securityService.getCurrentUserOrganization();
        return courseRepository.findByIdAndOrganizationId(id, org.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
    }
}
```

### Repository Layer

#### CourseRepository.java
```java
@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    
    Optional<Course> findByIdAndOrganizationId(Long id, Long orgId);
    
    boolean existsByOrganizationIdAndTitle(Long orgId, String title);
    
    boolean existsByOrganizationIdAndTitleAndIdNot(Long orgId, String title, Long id);
    
    @Query("SELECT COUNT(m) FROM Module m WHERE m.course.id = :courseId")
    long countModulesByCourseId(Long courseId);
}
```

### DTOs

#### CreateCourseRequest.java
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @Min(value = 1, message = "Duration must be at least 1 day")
    @Max(value = 365, message = "Duration cannot exceed 365 days")
    private Integer durationDays;
    
    @NotNull(message = "Access mode is required")
    private AccessMode accessMode;
    
    private CourseStatus status = CourseStatus.DRAFT;
}
```

### Error Handling

```java
@RestControllerAdvice
public class CourseExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

## Testing

### Unit Tests
```java
@ExtendWith(MockitoExtension.class)
class CourseServiceTest {
    
    @Mock
    private CourseRepository courseRepository;
    
    @InjectMocks
    private CourseService courseService;
    
    @Test
    void createCourse_Success() {
        // Test implementation
    }
    
    @Test
    void createCourse_DuplicateTitle_ThrowsException() {
        // Test implementation
    }
}
```

### Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
class CourseControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void getCourses_Success() throws Exception {
        mockMvc.perform(get("/api/admin/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }
}
```

## Security Considerations

1. All endpoints require ADMIN role
2. Organization-level data isolation
3. Audit trail maintained for all operations
4. Input validation to prevent SQL injection
5. Rate limiting should be implemented at API gateway level