# LMS Platform — Quiz & Assessment Module

B2B corporate training platform with classroom delivery, practice quizzes, and timed assessments.

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Backend    | Java 21 · Spring Boot 3 · Spring Security (JWT)     |
| ORM        | jOOQ (type-safe SQL) · Flyway (migrations)           |
| Database   | PostgreSQL 16 · Redis 7 (optional Phase 1)           |
| Frontend   | React 18 · Vite · Tailwind CSS · Shadcn/UI          |
| Libraries  | TanStack Query · Axios · React Router · react-markdown |
| WebSocket  | STOMP over SockJS (timed assessments only)           |

## Quick Start

### 1. Start Database

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432 and Redis on port 6379.

### 2. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Spring Boot starts on `http://localhost:8080`. Flyway auto-runs migrations. A default admin user is seeded:
- **Email:** admin@lms.com
- **Password:** admin123

### 3. Generate jOOQ Classes

After Flyway runs the first time, generate jOOQ type-safe classes:

```bash
cd backend
./mvnw jooq-codegen:generate
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

React app starts on `http://localhost:5173`. Vite proxies `/api/*` to Spring Boot automatically.

### 5. Verify

- Backend health: `curl http://localhost:8080/api/health`
- Frontend: Open `http://localhost:5173`
- Login: `admin@lms.com` / `admin123`

## Project Structure

```
lms-platform/
├── backend/
│   ├── src/main/java/com/lms/
│   │   ├── config/          # Security, WebSocket, CORS
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # jOOQ queries
│   │   ├── dto/             # Request/Response objects
│   │   ├── exception/       # Custom exceptions + global handler
│   │   ├── security/        # JWT filter, utility
│   │   └── util/            # AnswerMatcher, helpers
│   ├── src/main/resources/
│   │   ├── db/migration/    # Flyway SQL migrations
│   │   └── application.yml  # Configuration
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # Auth context
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities (cn function)
│   │   ├── pages/           # Route pages (auth, admin, faculty, student)
│   │   └── services/        # API client (Axios)
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml       # PostgreSQL + Redis
└── README.md
```

## Default Credentials

| Role    | Email            | Password   |
|---------|------------------|------------|
| Admin   | admin@lms.com    | admin123   |

Students use OTP login (mock mode: OTP logged to console in dev).

## Key Concepts

- **Classwork**: Faculty projects questions on screen. Students watch. No device interaction. No WebSocket.
- **Practice Quiz**: Students solve on their devices. Instant feedback. Ungraded.
- **Timed Assessment**: Graded quiz with server-side timer. Auto-submit. WebSocket for launch/extend/release.
- **Three availability modes for assessments**: Scheduled window, module-unlock, or faculty-triggered.
