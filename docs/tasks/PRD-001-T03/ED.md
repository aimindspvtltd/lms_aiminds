# PRD-001-T03: Engineering Design — Admin Auth API (Login + Register + JWT Filter)

**Task:** PRD-001-T03
**ARCHITECT:** —
**Date:** 2026-02-21
**Scope:** Backend only
**Depends on:** T01 (Spring Security skeleton + DB schema must be merged first)

---

## 1. API Endpoints

### POST `/api/v1/auth/login`
| | |
|---|---|
| Auth required | No (public) |
| Request body | `{ "email": "string", "password": "string" }` |
| Response 200 | `{ "success": true, "data": { "token": "...", "user": { "id", "name", "email", "role" } } }` |
| Response 400 | Validation error (missing/invalid fields) |
| Response 401 | Invalid credentials (wrong email or password — same message, no hint which) |
| Response 403 | Account is INACTIVE or SUSPENDED |

### POST `/api/v1/auth/register`
| | |
|---|---|
| Auth required | Yes — ADMIN role JWT |
| Request body | `{ "name", "email", "password", "phone"(optional), "role", "org_id" }` |
| Response 201 | `{ "success": true, "data": { "id", "name", "email", "role" }, "message": "User registered successfully" }` |
| Response 400 | Validation error |
| Response 401 | No / invalid JWT |
| Response 403 | JWT is valid but role is not ADMIN |
| Response 409 | Email already exists |

### GET `/api/v1/auth/me`
| | |
|---|---|
| Auth required | Yes — any valid JWT |
| Response 200 | `{ "success": true, "data": { "id", "name", "email", "role" } }` |
| Purpose | Frontend uses this to validate stored JWT on app load |

---

## 2. Package Structure

```
backend/src/main/java/com/lms/
└── domain/
    └── auth/
        ├── AuthController.java
        ├── AuthService.java
        ├── dto/
        │   ├── LoginRequest.java
        │   ├── LoginResponse.java
        │   ├── RegisterRequest.java
        │   └── UserResponse.java
        └── (uses UserRepository from domain/user/)

    └── user/
        ├── User.java              ← JPA Entity
        ├── UserRepository.java    ← Spring Data JPA
        ├── Role.java              ← enum (already in T01)
        └── UserStatus.java        ← enum (already in T01)
```

---

## 3. JPA Entity (`User.java`)

```java
@Entity
@Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String phone;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "password_hash")
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
```

---

## 4. Spring Data Repository (`UserRepository.java`)

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
    Optional<User> findByPhoneAndDeletedAtIsNull(String phone);
    boolean existsByEmailAndDeletedAtIsNull(String email);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :time WHERE u.id = :id")
    void updateLastLoginAt(@Param("id") Long id, @Param("time") LocalDateTime time);
}
```

---

## 5. DTOs

### `LoginRequest.java`
```java
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank         String password
) {}
```

### `RegisterRequest.java`
```java
public record RegisterRequest(
    @NotBlank @Size(min=2, max=255) String name,
    @NotBlank @Email                String email,
    @NotBlank @Size(min=8)          String password,
    @Pattern(regexp = "^\\+?[0-9]{7,15}$") String phone,  // optional
    @NotNull                        Role role
) {}
```

### `LoginResponse.java`
```java
public record LoginResponse(
    String token,
    UserResponse user
) {}
```

### `UserResponse.java`
```java
public record UserResponse(
    Long id,
    String name,
    String email,
    String role
) {}
```

---

## 6. Service (`AuthService.java`)

```java
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // login() flow:
    // 1. Find user by email (soft-delete aware) → throw UnauthorizedException if not found
    // 2. Verify passwordEncoder.matches(plainPassword, user.passwordHash)
    //    → throw UnauthorizedException("Invalid credentials") if mismatch
    //    → IMPORTANT: same error message regardless of whether email missing or password wrong
    // 3. Check user.status == ACTIVE → throw ForbiddenException("Account is not active") if not
    // 4. userRepository.updateLastLoginAt(user.id, now)
    // 5. Generate JWT: jwtUtil.generateToken(user.id, user.role)
    // 6. Return LoginResponse(token, UserResponse from user)
    // SECURITY: Never log the password. Never return password_hash.

    public LoginResponse login(LoginRequest request) { ... }

    // register() flow:
    // 1. Check email uniqueness → throw ConflictException if taken
    // 2. passwordEncoder.encode(request.password)
    // 3. Build User entity with status=ACTIVE
    // 4. userRepository.save(user)
    // 5. Return UserResponse (no token — admin creates accounts, users log in separately)

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse register(RegisterRequest request) { ... }

    // me() flow:
    // 1. Read userId from SecurityContext
    // 2. Fetch user from DB
    // 3. Return UserResponse

    public UserResponse me() { ... }
}
```

---

## 7. Controller (`AuthController.java`)

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
        @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        UserResponse user = authService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(user, "User registered successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success(authService.me()));
    }
}
```

Controller is thin: validate → delegate → format. No business logic here.

---

## 8. Error Scenarios

| Scenario | Exception | HTTP | Client sees |
|----------|-----------|------|-------------|
| Email not in DB | `UnauthorizedException` | 401 | "Invalid credentials" |
| Password mismatch | `UnauthorizedException` | 401 | "Invalid credentials" |
| Account INACTIVE/SUSPENDED | `ForbiddenException` | 403 | "Account is not active" |
| Email already taken (register) | `ConflictException` | 409 | "Email already in use" |
| Validation failure | `MethodArgumentNotValidException` | 400 | Field-level errors |
| No JWT on protected route | Spring Security filter | 401 | "No token provided" |
| Invalid/expired JWT | JwtAuthFilter + Spring Security | 401 | "Invalid or expired token" |
| Wrong role for /auth/register | `ForbiddenException` via @PreAuthorize | 403 | "Access denied" |

---

## 9. Security Notes

- BCrypt cost factor: **12** (configured in `ApplicationConfig` bean)
- JWT secret minimum: 256-bit (32 chars) — enforce via startup validation
- Never log passwords, tokens, or password_hash at any level
- Login endpoint: **do not distinguish** between "email not found" and "wrong password" — same 401 message
- `@PreAuthorize("hasRole('ADMIN')")` is preferred over URL-pattern matching for fine-grained control
- Enable global method security: `@EnableMethodSecurity` on `SecurityConfig` or main application class

---

## 10. Unit Tests Required

```
AuthServiceTest:
  ✓ login_withValidCredentials_returnsTokenAndUser
  ✓ login_withUnknownEmail_throwsUnauthorized
  ✓ login_withWrongPassword_throwsUnauthorized
  ✓ login_withInactiveAccount_throwsForbidden
  ✓ register_withNewEmail_createsUser
  ✓ register_withDuplicateEmail_throwsConflict

JwtUtilTest:
  ✓ generateToken_containsCorrectClaims
  ✓ validateToken_withValidToken_returnsTrue
  ✓ validateToken_withExpiredToken_returnsFalse
  ✓ validateToken_withTamperedToken_returnsFalse
  ✓ extractRole_returnsCorrectRole

AuthControllerIntegrationTest (MockMvc):
  ✓ POST /auth/login — 200 with valid creds
  ✓ POST /auth/login — 401 with invalid creds
  ✓ POST /auth/register — 201 with admin JWT
  ✓ POST /auth/register — 403 with faculty JWT
  ✓ POST /auth/register — 401 with no JWT
  ✓ GET  /auth/me — 200 with valid JWT
```

---

## 11. What WORKER Must Deliver

| File | Description |
|------|-------------|
| `domain/user/User.java` | JPA entity |
| `domain/user/UserRepository.java` | Spring Data repo |
| `domain/auth/AuthController.java` | Controller (thin) |
| `domain/auth/AuthService.java` | Business logic |
| `domain/auth/dto/LoginRequest.java` | DTO |
| `domain/auth/dto/LoginResponse.java` | DTO |
| `domain/auth/dto/RegisterRequest.java` | DTO |
| `domain/auth/dto/UserResponse.java` | DTO |
| `AuthServiceTest.java` | Unit tests |
| `JwtUtilTest.java` | Unit tests |
| `AuthControllerIntegrationTest.java` | MockMvc tests |

No new migrations in this task. Schema from T01 is used as-is.
