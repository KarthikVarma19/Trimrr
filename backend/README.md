# Trimrr Backend (Spring Boot)

A Java / Spring Boot service that owns the **URL redirect** and **click
analytics** for Trimrr. It connects to the same Supabase PostgreSQL database
the React app uses, but moves the performance-critical redirect path off the
browser and onto a real server.

## Why this exists

The original app did redirects **client-side**: the browser downloaded the
whole React bundle, queried the DB, called a third-party geo API, logged the
click, and only then navigated. This service fixes that:

| Concern            | Before (client-side)                    | Now (Spring Boot)                          |
|--------------------|-----------------------------------------|--------------------------------------------|
| Redirect           | SPA load + JS + multiple round-trips    | Single server-side `302` in milliseconds   |
| Hot-link lookups   | DB hit every time                       | Caffeine cache, DB only on miss            |
| Analytics + geo    | Blocked the redirect                    | Async, off the hot path (`@Async` pool)    |
| Geo source         | `ipapi.co` from the browser (blockable) | Server-side lookup, degrades gracefully    |

## Endpoints

- `GET /{code}` — resolve a short/custom code and `302` redirect to the target;
  records the click asynchronously. Returns `404` for unknown codes.
- `GET /actuator/health` — liveness/readiness.
- `GET /actuator/caches` — cache state (nice for demos).

## Run locally

Requires JDK 21.

```bash
export DB_URL="jdbc:postgresql://<host>:6543/postgres"   # Supabase pooler
export DB_USERNAME="postgres.<project-ref>"
export DB_PASSWORD="<your-db-password>"

JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
  mvn spring-boot:run
```

Get the JDBC connection string from Supabase:
**Project Settings → Database → Connection string → JDBC** (use the pooler,
port `6543`, for an always-on server).

## Design notes

- **302 not 301** on purpose — a 301 is cached permanently by browsers, so
  later clicks would never reach the server and analytics would undercount.
- **Cache misses aren't cached** (`unless = "#result == null"`) so a flood of
  bogus codes can't evict real entries.
- `ddl-auto: none` — Hibernate never touches the schema; Supabase owns it.
