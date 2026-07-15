# Trimrr

A full-stack URL shortener with fast server-side redirects, click analytics,
and QR generation. Built as a monorepo: a React frontend and a Java / Spring
Boot backend sharing a Supabase PostgreSQL database.

```
Trimrr/
├── frontend/   React 19 + Vite + Tailwind 4 + shadcn/ui  (UI, auth, dashboard)
└── backend/    Java 21 + Spring Boot 3                     (redirect + analytics)
```

## Architecture

The frontend uses Supabase **only for authentication** (login/signup issues a
JWT). All application data — creating links, listing, deleting, and analytics —
goes through the Spring Boot REST API, which verifies that Supabase JWT on
every request and enforces per-user ownership. The **redirect** — the
performance-critical path — is also owned by the backend:

```
Visitor clicks a short link
        │
        ▼
Spring Boot  GET /{code}
   ├─ resolve code   (Caffeine cache → Postgres on miss)
   ├─ 302 redirect   (returned immediately)
   └─ record click   (async: device + geo, off the hot path)
```

This replaced the original client-side redirect, which loaded the whole React
bundle and blocked navigation on a third-party geo API call. See
[backend/README.md](backend/README.md) for the design rationale.

## Running locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Environment (`.env` in `frontend/`):

```
VITE_SUPABASE_URL=...                     # Supabase project URL (auth)
VITE_SUPABASE_KEY=...                     # Supabase anon key (auth)
VITE_API_URL=http://localhost:8080        # Spring Boot REST API
VITE_DOMAIN_URL=http://localhost:8080/    # base for short links = backend host
```

### Backend

Requires JDK 21. See [backend/RUNNING.md](backend/RUNNING.md) for the full
walkthrough (Supabase JDBC connection, verification, troubleshooting).

```bash
cd backend
export DB_URL=... DB_USERNAME=... DB_PASSWORD=...
export SUPABASE_URL=... SUPABASE_JWT_SECRET=... SUPABASE_SERVICE_ROLE_KEY=...
export FRONTEND_ORIGINS=http://localhost:5173
./mvnw spring-boot:run
```

## Tech stack

| Layer     | Tech                                                            |
|-----------|-----------------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS 4, shadcn/ui, React Router, Recharts |
| Backend   | Java 21, Spring Boot 3, Spring Data JPA, Caffeine cache          |
| Data/Auth | Supabase (PostgreSQL, Auth, Storage)                            |

## Features

- Short links with collision-checked, human-readable codes
- Fast, cached, server-side redirects (302) with async click logging
- Per-link analytics: total clicks, devices, and locations
- QR code for every link, downloadable as PNG
- Email/password auth with protected routes
