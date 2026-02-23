# PRD-003-T05: Engineering Design - Quiz Integration Points

## Overview

This document outlines the integration points and contracts that will enable seamless quiz functionality integration in the future.

## Integration Architecture

### Design Principles

1. **Loose Coupling**: Course module should not depend on quiz module implementation
2. **Interface Segregation**: Define minimal required interfaces
3. **Future Compatibility**: Design for extensibility without breaking changes
4. **Feature Flags**: Hide quiz functionality until ready

## Database Integration

### ContentBlock Schema (Already Defined)

```sql
CREATE TABLE content_blocks (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES modules(id),
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'VIDEO', 
        'LINK', 
        'INTERACTIVE_DOCUMENT', 
        'QUIZ_PRACTICE',      -- Future quiz type
        'QUIZ_EVALUATION'     -- Future quiz type
    )),
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL,
    config_json JSONB NOT NULL DEFAULT '{}',
    quiz_id BIGINT,  -- Foreign key to future quiz table
    -- audit columns...
);

-- Note: Foreign key constraint for quiz_id will be added when quiz table exists
-- via migration: ALTER TABLE content_blocks ADD CONSTRAINT fk_quiz 
-- FOREIGN KEY (quiz_id) REFERENCES quizzes(id);
```

### Quiz Configuration Schema

For QUIZ_PRACTICE and QUIZ_EVALUATION content blocks, the config_json will store:

```json
{
    "quizMode": "PRACTICE|EVALUATION",
    "timeLimitMinutes": 30,        // null for practice
    "totalMarks": 100,              // only for evaluation
    "passingMarks": 40,             // only for evaluation
    "attemptsAllowed": 1,           // -1 for unlimited
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "showAnswersAfter": "IMMEDIATELY|AFTER_SUBMISSION|AFTER_RELEASE",
    "releaseMode": "AUTO|MANUAL"    // manual requires faculty action
}
```

## Interface Definitions

### QuizService Interface

```java
public interface QuizService {
    
    /**
     * Check if a quiz exists and is accessible
     */
    boolean quizExists(Long quizId, Long organizationId);
    
    /**
     * Get basic quiz information for display
     */
    QuizSummary getQuizSummary(Long quizId);
    
    /**
     * Validate if quiz can be used in content block
     */
    void validateQuizForContentBlock(Long quizId, ContentType type);
    
    /**
     * Get quiz metadata for content block configuration
     */
    QuizMetadata getQuizMetadata(Long quizId);
}
```

### Quiz DTOs

```java
@Data
@Builder
public class QuizSummary {
    private Long id;
    private String title;
    private Integer questionCount;
    private Integer totalMarks;
    private QuizStatus status;  // DRAFT, PUBLISHED, ARCHIVED
}

@Data
@Builder
public class QuizMetadata {
    private Long id;
    private String title;
    private QuizType type;      // PRACTICE, EVALUATION
    private Integer questionCount;
    private Integer defaultTimeLimit;
    private Integer defaultMarks;
    private boolean supportsPartialMarking;
    private List<String> questionTypes;  // SCQ, MCQ, FIB
}
```

## Placeholder Implementation

### NoOpQuizService.java

```java
@Service
@ConditionalOnProperty(
    name = "feature.quiz-module.enabled",
    havingValue = "false",
    matchIfMissing = true
)
@Slf4j
public class NoOpQuizService implements QuizService {
    
    @Override
    public boolean quizExists(Long quizId, Long organizationId) {
        log.warn("Quiz module not enabled. Quiz {} validation skipped", quizId);
        return false;
    }
    
    @Override
    public QuizSummary getQuizSummary(Long quizId) {
        throw new BusinessException("Quiz module is not enabled");
    }
    
    @Override
    public void validateQuizForContentBlock(Long quizId, ContentType type) {
        throw new BusinessException(
            "Cannot create quiz content blocks. Quiz module is not enabled"
        );
    }
    
    @Override
    public QuizMetadata getQuizMetadata(Long quizId) {
        throw new BusinessException("Quiz module is not enabled");
    }
}
```

## API Integration Points

### Quiz Selection Endpoint (Placeholder)

```java
@RestController
@RequestMapping("/api/admin/quizzes")
@ConditionalOnProperty(name = "feature.quiz-module.enabled", havingValue = "true")
public class QuizIntegrationController {
    
    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuizSummary>> getAvailableQuizzes(
            @RequestParam(required = false) QuizType type,
            @RequestParam(required = false) QuizStatus status) {
        
        // This endpoint will be implemented by quiz module
        // Returns quizzes that can be added to content blocks
        return ResponseEntity.ok(Collections.emptyList());
    }
    
    @GetMapping("/{id}/preview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizPreviewDto> getQuizPreview(@PathVariable Long id) {
        // Returns preview data for embedding in course builder
        return ResponseEntity.ok(new QuizPreviewDto());
    }
}
```

## Content Block Validation Enhancement

### QuizContentValidator.java

```java
@Component
@RequiredArgsConstructor
public class QuizContentValidator {
    
    private final QuizService quizService;
    private final FeatureFlags featureFlags;
    
    public void validateQuizContent(ContentType type, Map<String, Object> config, Long orgId) {
        if (!isQuizType(type)) {
            return;
        }
        
        if (!featureFlags.isQuizModuleEnabled()) {
            throw new BusinessException(
                "Cannot create quiz content blocks. Quiz feature is not available yet"
            );
        }
        
        Long quizId = ((Number) config.get("quizId")).longValue();
        if (quizId == null) {
            throw new ValidationException("Quiz ID is required for quiz content blocks");
        }
        
        // Validate quiz exists and is accessible
        if (!quizService.quizExists(quizId, orgId)) {
            throw new ResourceNotFoundException("Quiz not found or not accessible");
        }
        
        // Validate quiz type matches content block type
        quizService.validateQuizForContentBlock(quizId, type);
        
        // Validate quiz-specific configuration
        validateQuizConfig(type, config);
    }
    
    private boolean isQuizType(ContentType type) {
        return type == ContentType.QUIZ_PRACTICE || 
               type == ContentType.QUIZ_EVALUATION;
    }
    
    private void validateQuizConfig(ContentType type, Map<String, Object> config) {
        if (type == ContentType.QUIZ_EVALUATION) {
            Integer timeLimit = (Integer) config.get("timeLimitMinutes");
            if (timeLimit != null && timeLimit < 1) {
                throw new ValidationException("Time limit must be at least 1 minute");
            }
            
            Integer passingMarks = (Integer) config.get("passingMarks");
            Integer totalMarks = (Integer) config.get("totalMarks");
            if (passingMarks != null && totalMarks != null && passingMarks > totalMarks) {
                throw new ValidationException("Passing marks cannot exceed total marks");
            }
        }
    }
}
```

## Frontend Integration Points

### Quiz Selector Component Interface

```typescript
// types/quiz.ts
export interface QuizSummary {
  id: number;
  title: string;
  questionCount: number;
  totalMarks?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface QuizSelectorProps {
  mode: 'PRACTICE' | 'EVALUATION';
  onSelect: (quiz: QuizSummary) => void;
  selectedQuizId?: number;
}

// Placeholder component
export const QuizSelector: React.FC<QuizSelectorProps> = ({ mode, onSelect }) => {
  if (!useFeatureFlag('quizModule')) {
    return (
      <div className="p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600">Quiz functionality coming soon!</p>
      </div>
    );
  }
  
  // Actual implementation will be provided by quiz module
  return <QuizSelectorImplementation mode={mode} onSelect={onSelect} />;
};
```

### Quiz Preview Component Interface

```typescript
export interface QuizPreviewProps {
  quizId: number;
  mode: 'PRACTICE' | 'EVALUATION';
  config: {
    timeLimitMinutes?: number;
    totalMarks?: number;
    passingMarks?: number;
  };
}

export const QuizPreview: React.FC<QuizPreviewProps> = ({ quizId, mode, config }) => {
  if (!useFeatureFlag('quizModule')) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <FileQuestion className="w-8 h-8 text-gray-400" />
          <div>
            <h4 className="font-medium">Quiz #{quizId}</h4>
            <p className="text-sm text-gray-500">
              {mode === 'PRACTICE' ? 'Practice Quiz' : 'Evaluation Quiz'}
            </p>
          </div>
        </div>
      </Card>
    );
  }
  
  // Full implementation from quiz module
  return <QuizPreviewImplementation {...props} />;
};
```

## Feature Flags

### application.yml

```yaml
feature:
  quiz-module:
    enabled: false  # Set to true when quiz module is ready
    
# Feature flag configuration
management:
  endpoint:
    features:
      enabled: true
```

### FeatureFlags.java

```java
@Component
@ConfigurationProperties(prefix = "feature")
@Data
public class FeatureFlags {
    
    private QuizModule quizModule = new QuizModule();
    
    @Data
    public static class QuizModule {
        private boolean enabled = false;
    }
    
    public boolean isQuizModuleEnabled() {
        return quizModule.isEnabled();
    }
}
```

## Migration Strategy

### Phase 1: Current Implementation
- Content blocks with quiz types exist but cannot be created
- quiz_id column exists but no foreign key constraint
- Validation prevents quiz content block creation

### Phase 2: Quiz Module Integration
1. Quiz module implements QuizService interface
2. Add foreign key constraint:
   ```sql
   ALTER TABLE content_blocks 
   ADD CONSTRAINT fk_content_blocks_quiz 
   FOREIGN KEY (quiz_id) REFERENCES quizzes(id);
   ```
3. Enable feature flag
4. Register quiz module's QuizService implementation

### Phase 3: Full Integration
- Remove NoOpQuizService
- Remove feature flag checks
- Full bidirectional integration

## Testing Strategy

### Integration Contract Tests

```java
@SpringBootTest
@ActiveProfiles("test")
public abstract class QuizIntegrationContractTest {
    
    @Autowired
    protected QuizService quizService;
    
    @Test
    public void testQuizExists() {
        // Contract: should return false for non-existent quiz
        assertFalse(quizService.quizExists(-1L, 1L));
    }
    
    @Test
    public void testValidateQuizForContentBlock() {
        // Contract: should throw exception for invalid quiz
        assertThrows(ResourceNotFoundException.class, () -> 
            quizService.validateQuizForContentBlock(-1L, ContentType.QUIZ_PRACTICE)
        );
    }
    
    // Quiz module will extend this test with actual implementations
}
```

## Documentation

### Integration Guide (for Quiz Module Team)

```markdown
# Quiz Module Integration Guide

## Overview
The course module has prepared integration points for quiz functionality.

## Integration Steps

1. **Implement QuizService Interface**
   - Create a service implementing `com.lms.course.integration.QuizService`
   - Register as Spring Bean with `@Service` annotation

2. **Database Integration**
   - Create `quizzes` table
   - Run migration to add foreign key constraint

3. **API Implementation**
   - Implement `/api/admin/quizzes/available` endpoint
   - Implement `/api/admin/quizzes/{id}/preview` endpoint

4. **Frontend Components**
   - Provide `QuizSelectorImplementation` component
   - Provide `QuizPreviewImplementation` component

5. **Enable Feature Flag**
   - Set `feature.quiz-module.enabled=true`

## Testing
- Run `QuizIntegrationContractTest` suite
- Verify content block creation with quiz types
- Test quiz selection in course builder
```

## Security Considerations

1. **Authorization**: Quiz access must respect organization boundaries
2. **Validation**: Prevent quiz content blocks from referencing quizzes from other orgs
3. **Data Isolation**: Ensure quiz preview doesn't leak sensitive information

## Performance Considerations

1. **Caching**: Cache quiz metadata for content block display
2. **Lazy Loading**: Don't fetch full quiz details until needed
3. **Batch Operations**: Support bulk quiz validation for course copy operations