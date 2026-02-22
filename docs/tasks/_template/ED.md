# Engineering Design — PRD-XXX-T##

**Written by:** ARCHITECT
**Task:** [docs/tasks/PRD-XXX-T##/index.md](index.md)
**Date:** YYYY-MM-DD

---

## Backend

### DB Changes

_List every table/column being added, modified, or removed._

| Action | Table | Column / Index | Details |
|--------|-------|----------------|---------|
| ADD    | users | otp_secret     | VARCHAR(32) NULL |

**Migration file:** `migrations/TIMESTAMP_description.sql`

**SOT impact:** _Describe what SOT.md will look like after this migration_

---

### API Endpoints

| Method | Route                        | Auth Required | Description              |
|--------|------------------------------|---------------|--------------------------|
| POST   | /api/v1/auth/otp/enable      | ✅ student    | Enable OTP for user      |
| POST   | /api/v1/auth/otp/verify      | ✅ student    | Verify OTP code          |

**Request / Response shapes:**

```
POST /api/v1/auth/otp/enable
Request:  { }
Response: { secret: string, qr_code: string }

POST /api/v1/auth/otp/verify
Request:  { code: string }
Response: { message: string }
```

---

### Code to Create

```
backend/src/
├── controllers/
│   └── [controller-file].js        ← [method names]
├── services/
│   └── [service-file].js           ← [method names]
├── repositories/
│   └── [repo-file].js              ← [method names]
└── validators/
    └── [validator-file].js         ← [schema names]
```

---

## Frontend

### Folder Structure

```
src/features/[feature]/
├── components/
│   └── [ComponentName].tsx
├── hooks/
│   └── use[Name].ts
└── services/
    └── [name].service.ts
```

### Component Hierarchy

```
[PageComponent]
└── [ChildComponent]
    └── [GrandchildComponent]
```

### State Strategy

- Server state: TanStack Query — _what data is fetched_
- Client state: Zustand / useState — _what UI state is managed_

### Routes

| Path                  | Component       | Auth |
|-----------------------|-----------------|------|
| /settings/security    | SecurityPage    | ✅   |

---

## Notes / Risks

_Any technical concerns, edge cases, or decisions the WORKER should be aware of_
