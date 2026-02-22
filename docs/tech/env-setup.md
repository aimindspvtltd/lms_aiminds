# Local Development Setup

## Prerequisites

- Node.js 20.x
- Docker + Docker Compose
- Git

---

## Step 1 — Clone the Repository

```bash
git clone <repo-url>
cd lms-platform
```

---

## Step 2 — Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5432`.

---

## Step 3 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and fill in values
npm run migrate      # Run all migrations
npm run seed         # (Optional) Seed test data
npm run dev          # Start dev server on port 3000
```

---

## Step 4 — Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:3000/api/v1
npm run dev          # Start Vite dev server on port 5173
```

---

## Environment Variables

### Backend (`.env`)

| Variable          | Example                          | Purpose                        |
|-------------------|----------------------------------|--------------------------------|
| `NODE_ENV`        | `development`                    | Environment mode               |
| `PORT`            | `3000`                           | API server port                |
| `DATABASE_URL`    | `postgres://user:pass@localhost:5432/lms` | PostgreSQL connection |
| `JWT_SECRET`      | `supersecretkey`                 | JWT signing secret             |
| `JWT_EXPIRES_IN`  | `24h`                            | Token expiry                   |
| `BCRYPT_ROUNDS`   | `12`                             | Password hashing rounds        |

### Frontend (`.env`)

| Variable        | Example                            | Purpose              |
|-----------------|------------------------------------|----------------------|
| `VITE_API_URL`  | `http://localhost:3000/api/v1`     | Backend API base URL |

---

## Useful Commands

```bash
# Backend
npm run dev          # Start with hot reload
npm run test         # Run all tests
npm run migrate      # Run pending migrations
npm run migrate:rollback  # Rollback last migration

# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run Vitest tests
npm run lint         # ESLint check
```

---

## Verify Everything Works

1. API health check: `GET http://localhost:3000/api/v1/health` → `{ "success": true }`
2. Frontend: open `http://localhost:5173`
