# Running the backend against your Supabase database

Follow these steps in order. Stop at the first one that errors and send me the
output — most likely culprit is a column-type mismatch, which is a 1-line fix.

## 1. Get your JDBC connection details from Supabase

Supabase dashboard → **Project Settings → Database → Connection string** →
select the **JDBC** tab, and use the **Connection pooling** values (host ends
in `...pooler.supabase.com`, port `6543`).

You'll have three pieces:
- host + database  → goes in `DB_URL`
- user             → looks like `postgres.<project-ref>`
- password         → the database password you set when creating the project

## 2. Set environment variables (do NOT commit these)

The backend now owns the full API (auth-verified CRUD + analytics + QR), so it
needs the database connection, the Supabase JWT secret (to verify user
sessions), and the service-role key (to upload QR images to Storage).

All Supabase values are in the dashboard under **Settings → API** (JWT secret,
service_role key, project URL) and **Settings → Database** (JDBC connection).

```bash
# Database (Settings → Database → Connection string → JDBC, pooler port 6543)
export DB_URL="jdbc:postgresql://aws-0-<region>.pooler.supabase.com:6543/postgres"
export DB_USERNAME="postgres.<your-project-ref>"
export DB_PASSWORD="<your-database-password>"

# Supabase API (Settings → API)
export SUPABASE_URL="https://<your-project-ref>.supabase.co"
export SUPABASE_JWT_SECRET="<JWT secret>"            # verifies user tokens
export SUPABASE_SERVICE_ROLE_KEY="<service_role key>" # uploads QR images

# Frontend origin(s) allowed to call the API (comma-separated)
export FRONTEND_ORIGINS="http://localhost:5173"
```

## 3. Run it

From the `backend/` folder:

```bash
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
  ./mvnw spring-boot:run
```

You should see `Started TrimrrApplication` and `Tomcat started on port 8080`.

## 4. Verify each piece

```bash
# Health — should return {"status":"UP"}
curl http://localhost:8080/actuator/health

# API requires auth — without a token this should return 401
curl -I http://localhost:8080/api/urls

# Redirect — replace abc123 with a REAL short_url from your urls table.
# -I shows headers only; look for "HTTP/1.1 302" and a "Location:" header.
curl -I http://localhost:8080/abc123

# Unknown code — should be 404
curl -I http://localhost:8080/does-not-exist
```

The authenticated endpoints (`/api/urls`, `/api/analytics/clicks`) are easiest
to verify from the running frontend once you log in — create a link, and the
dashboard/analytics should populate. After a redirect, a new row should appear
in the `clicks` table within a second or two (logged asynchronously).

### API surface

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/{code}` | Public redirect (302) + async click logging |
| `GET` | `/api/urls` | List the caller's links |
| `POST` | `/api/urls` | Create a link (generates code + QR) |
| `GET` | `/api/urls/{id}` | Get one of the caller's links |
| `DELETE` | `/api/urls/{id}` | Delete a link |
| `GET` | `/api/urls/{id}/clicks` | Clicks for one link |
| `GET` | `/api/analytics/clicks` | All clicks across the caller's links |

## Likely issues and fixes

| Symptom | Cause | Fix |
|---|---|---|
| `column "..." does not exist` | Java field ↔ DB column mismatch | Send me the column name; I fix the `@Column` mapping |
| `Provided id of the wrong type` / cast error on `id` | Your `urls.id` is `uuid`, not `bigint` | I change `Url.id` + repo to `UUID` (send me the error) |
| Cannot connect / auth failed | Wrong pooler host, user, or password | Re-copy from the JDBC tab; user must include `.project-ref` |
| Redirect works but no click row | RLS blocking inserts, or geo call slow | Check `clicks` table RLS; geo failures degrade silently |

Send me whatever step 3 or 4 prints and I'll take it from there.
