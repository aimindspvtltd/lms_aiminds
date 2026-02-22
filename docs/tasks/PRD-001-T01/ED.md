# PRD-001-T01: Engineering Design — Backend Scaffold + DB Schema

**Task:** PRD-001-T01
**ARCHITECT:** —
**Date:** 2026-02-21
**Scope:** Backend only — no frontend work in this task

---

## 1. Dependencies (pom.xml)

```xml
<!-- Spring Boot 3.2.x -->
spring-boot-starter-web
spring-boot-starter-security
spring-boot-starter-data-jpa
spring-boot-starter-validation
spring-boot-starter-actuator

<!-- Database -->
postgresql (runtime)
flyway-core
flyway-database-postgresql

<!-- JWT -->
io.jsonwebtoken:jjwt-api:0.12.3
io.jsonwebtoken:jjwt-impl:0.12.3
io.jsonwebtoken:jjwt-jackson:0.12.3

<!-- Utilities -->
lombok
mapstruct

<!-- Test -->
spring-boot-starter-test
spring-security-test
testcontainers:postgresql
```

---

## 2. application.yml

```yaml
spring:
  application:
    name: lms-backend

  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:lms_db}
    username: ${DB_USERNAME:lms_user}
    password: ${DB_PASSWORD:lms_password}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2

  jpa:
    hibernate:
      ddl-auto: validate          # Flyway owns the schema — Hibernate only validates
    show-sql: false
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
      hibernate.format_sql: true

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: false
    validate-on-migrate: true

jwt:
  secret: ${JWT_SECRET}           # Must be >= 256 bits (32 chars)
  expiration-ms: ${JWT_EXPIRY_MS:14400000}   # 4 hours default

server:
  port: 8080
  servlet:
    context-path: /

logging:
  level:
    com.lms: INFO
    org.springframework.security: WARN
```

---

## 3. Package Structure

```
backend/src/main/java/com/lms/
│
├── LmsApplication.java                    ← @SpringBootApplication entry point
│
├── config/
│   ├── SecurityConfig.java                ← Filter chain, CORS, session policy
│   ├── JwtProperties.java                 ← @ConfigurationProperties("jwt")
│   └── ApplicationConfig.java            ← BCryptPasswordEncoder bean
│
├── security/
│   ├── JwtUtil.java                       ← Generate / validate / extract claims
│   ├── JwtAuthFilter.java                 ← OncePerRequestFilter (runs per request)
│   └── UserPrincipal.java                 ← Spring Security UserDetails impl
│
├── common/
│   ├── response/
│   │   ├── ApiResponse.java               ← Generic { success, data, message }
│   │   └── PageResponse.java              ← { success, data[], pagination }
│   └── exception/
│       ├── AppException.java              ← Base RuntimeException with HttpStatus
│       ├── UnauthorizedException.java     ← 401
│       ├── ForbiddenException.java        ← 403
│       ├── NotFoundException.java         ← 404
│       ├── ConflictException.java         ← 409
│       ├── ValidationException.java       ← 400
│       └── GlobalExceptionHandler.java    ← @RestControllerAdvice
│
└── domain/
    └── user/
        ├── Role.java                      ← enum: ADMIN, FACULTY, STUDENT
        └── UserStatus.java                ← enum: ACTIVE, INACTIVE, SUSPENDED
```

---

## 4. Spring Security Design (`SecurityConfig.java`)

```
Filter Chain:
  1. CorsFilter           ← Allow frontend origin
  2. JwtAuthFilter        ← Validate token, set SecurityContext
  3. AuthorizationFilter  ← Role-based access

Security Rules:
  PERMIT ALL:
    - POST  /api/v1/auth/login
    - POST  /api/v1/auth/register
    - GET   /actuator/health

  REQUIRE AUTHENTICATION (any valid JWT):
    - All other /api/**

  ROLE RESTRICTIONS (enforced at method level via @PreAuthorize):
    - /api/v1/admin/**  → ADMIN only
    - /api/v1/faculty/**→ FACULTY only
    - /api/v1/student/**→ STUDENT only

Session Policy: STATELESS (no HttpSession — JWT only)
CSRF: Disabled (stateless REST API)
```

---

## 5. JWT Design (`JwtUtil.java`)

```
Token Structure:
  Header:  { alg: HS256, typ: JWT }
  Payload: {
    sub:  userId (Long as String)   ← identify the user
    role: "ADMIN"                   ← role checks without DB hit
    iat:  issuedAt (epoch seconds)
    exp:  expiredAt (iat + 14400)   ← 4 hours
  }

What is NOT in the token:
  - email: not needed — /auth/me fetches user by sub (userId) from DB
  - name:  not needed — same reason
  - status: not needed — checked at login; revocation handled via deleted_at/status in DB

Methods:
  String generateToken(Long userId, Role role)
  boolean validateToken(String token)
  Long    extractUserId(String token)
  Role    extractRole(String token)
  boolean isTokenExpired(String token)

Secret: HMAC-SHA256, key from jwt.secret property (minimum 32 chars / 256 bits)
Library: io.jsonwebtoken (jjwt 0.12.3)
```

---

## 6. JWT Filter Design (`JwtAuthFilter.java`)

```
Extends: OncePerRequestFilter

Flow per request:
  1. Read Authorization header
  2. If null or doesn't start with "Bearer " → skip (next filter handles auth)
  3. Extract token string (after "Bearer ")
  4. JwtUtil.validateToken(token)
     → If invalid/expired: SecurityContextHolder.clearContext(), continue chain
                           (security rules will reject the request as 401)
  5. Extract userId, email, role from token
  6. Build UsernamePasswordAuthenticationToken(UserPrincipal, null, authorities)
  7. Set on SecurityContextHolder
  8. Continue filter chain

Note: Filter must NOT throw exceptions — just clear context and let
      Spring Security handle the 401 response.
```

---

## 7. Common Response Format

### `ApiResponse<T>`
```java
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;

    public static <T> ApiResponse<T> success(T data) { ... }
    public static <T> ApiResponse<T> success(T data, String message) { ... }
    public static ApiResponse<Void> message(String message) { ... }
}
```

### Error Response (from `GlobalExceptionHandler`)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Exception → HTTP Status Mapping
| Exception              | HTTP Code |
|------------------------|-----------|
| UnauthorizedException  | 401       |
| ForbiddenException     | 403       |
| NotFoundException      | 404       |
| ConflictException      | 409       |
| ValidationException    | 400       |
| MethodArgumentNotValid | 400       |
| Generic Exception      | 500       |

**IMPORTANT:** Never expose stack traces or internal messages in error responses. Log the full exception server-side (INFO/ERROR), return a safe message to client.

---

## 8. Docker Compose (`docker-compose.yml` at project root)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    container_name: lms_postgres
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_USER: lms_user
      POSTGRES_PASSWORD: lms_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U lms_user -d lms_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: lms_redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 9. Flyway Migration Plan

Migration files live at: `backend/src/main/resources/db/migration/`
(Flyway classpath location. Source files also committed to `backend/migrations/` for reference.)

**File naming:** `V{version}__{description}.sql` — Flyway double-underscore convention

Tables are added migration-by-migration as each PRD needs them. Only PRD-001 tables are created here.

| File | Purpose | Depends On |
|------|---------|------------|
| `V1__create_update_trigger_function.sql` | trigger function | — |
| `V2__create_users.sql` | users table | V1 |
| `V3__seed_initial_admin.sql` | seed admin user (bootstrap) | V2 |

Remaining tables (courses, modules, questions, quizzes, batches, student-org links, etc.) will be added in their respective PRD tasks.

**V3 WORKER action required:** Generate a BCrypt cost-12 hash for the admin password and replace the placeholder before running migrations. Use `new BCryptPasswordEncoder(12).encode("yourPassword")` in a test or shell.

---

## 10. DB Schema — PRD-001 Tables

### Table: `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| email | VARCHAR(255) | nullable, UNIQUE (partial index) |
| phone | VARCHAR(20) | nullable, UNIQUE (partial index) |
| name | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('ADMIN','FACULTY','STUDENT') |
| password_hash | VARCHAR(255) | nullable (OTP-only students) |
| status | VARCHAR(20) | NOT NULL DEFAULT 'ACTIVE', CHECK IN ('ACTIVE','INACTIVE','SUSPENDED') |
| last_login_at | TIMESTAMP | nullable |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP |
| deleted_at | TIMESTAMP | nullable (soft delete) |

No org link on this table. Student-to-institution association added in a later PRD.

---

## 11. Key Indexes (V2 migration)

```sql
idx_users_email_unique   UNIQUE (email)  WHERE email IS NOT NULL AND deleted_at IS NULL
idx_users_phone_unique   UNIQUE (phone)  WHERE phone IS NOT NULL AND deleted_at IS NULL
idx_users_role           (role)          WHERE deleted_at IS NULL
```

---

## 12. What WORKER Must Deliver

| File | Description |
|------|-------------|
| `LmsApplication.java` | Entry point with `@SpringBootApplication`, enable `@PreAuthorize` |
| `config/SecurityConfig.java` | Filter chain, CORS, session policy |
| `config/JwtProperties.java` | `@ConfigurationProperties("jwt")` |
| `config/ApplicationConfig.java` | `BCryptPasswordEncoder` bean |
| `security/JwtUtil.java` | Generate/validate/extract JWT |
| `security/JwtAuthFilter.java` | OncePerRequestFilter |
| `security/UserPrincipal.java` | UserDetails impl |
| `common/response/ApiResponse.java` | Generic response |
| `common/exception/*.java` | All exception classes + handler |
| `domain/user/Role.java` | Enum |
| `domain/user/UserStatus.java` | Enum |
| `docker-compose.yml` | Postgres + Redis |
| `application.yml` | All configuration |
| `.env.example` | All required env variables documented |
| `V1__create_update_trigger_function.sql` | Trigger function |
| `V2__create_users.sql` | Users table |
| `V3__seed_initial_admin.sql` | Seed admin user (replace hash placeholder first) |

**No business endpoints in this task.** App must start, security must reject unauthenticated requests with 401, V1+V2 migrations must run cleanly.
