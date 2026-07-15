# Deploying Trimrr

Architecture: **frontend on Vercel**, **backend (Docker) on Render**, **database
on Supabase**. Short links resolve on the backend, so the backend should stay
awake — Render's free service sleeps after 15 min idle, so we keep it warm with
a free uptime pinger (step 2b).

```
Browser ──► Vercel (React)  ──► Render (Spring Boot API + redirect) ──► Supabase (Postgres)
                                        └── login/signup ──► Supabase Auth
```

## 1. Prerequisites

- Push the latest code to GitHub (including `backend/Dockerfile`). `.env` files
  stay local — they are gitignored and must NOT be committed.
- In Supabase → **Settings → API Keys → Secret keys**, create a secret key
  (`sb_secret_…`). Production needs this for QR uploads.

## 2. Deploy the backend on Render

1. Sign up at [render.com](https://render.com) with GitHub (no card required).
2. **New → Web Service** → connect the Trimrr repo.
3. **Root Directory: `backend`** (so Render finds `backend/Dockerfile`).
   Render auto-detects the Dockerfile and sets Runtime = Docker.
4. Instance type: **Free**.
5. Health check path: `/actuator/health`. (Render injects `PORT`; the app
   already listens on `$PORT`.)
6. Add environment variables:

   | Name | Value |
   |------|-------|
   | `DB_URL` | `jdbc:postgresql://aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres` |
   | `DB_USERNAME` | `postgres.gbslrayhrawbvfpyguda` |
   | `DB_PASSWORD` | your Supabase DB password |
   | `SUPABASE_URL` | `https://gbslrayhrawbvfpyguda.supabase.co` |
   | `SUPABASE_JWKS_URL` | `https://gbslrayhrawbvfpyguda.supabase.co/auth/v1/.well-known/jwks.json` |
   | `SUPABASE_SERVICE_ROLE_KEY` | your `sb_secret_…` key |
   | `FRONTEND_ORIGINS` | `https://trimrr-urls.vercel.app` |

7. Create Web Service. First build takes a few minutes. Note the URL, e.g.
   `https://trimrr-backend.onrender.com`.
8. Verify: `curl https://trimrr-backend.onrender.com/actuator/health` → `{"status":"UP"}`.

### 2b. Keep it awake (free)

Render's free service sleeps after 15 min idle, which would make short links
slow to respond after inactivity. Prevent it with a free uptime monitor:

- [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org)
- Add an HTTP(S) monitor for `https://trimrr-backend.onrender.com/actuator/health`
  every 5 minutes. That traffic keeps the instance from sleeping.

## 3. Point the frontend at the backend (Vercel)

In the Vercel project → **Settings → Environment Variables**, set:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://gbslrayhrawbvfpyguda.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
| `VITE_API_URL` | `https://trimrr-xxxx.koyeb.app` (no trailing slash) |
| `VITE_DOMAIN_URL` | `https://trimrr-xxxx.koyeb.app/` (trailing slash — short-link base) |

Then **redeploy** the frontend so the new env vars take effect (Vite inlines
them at build time).

## 4. Verify end-to-end

1. Open the Vercel site, sign up / log in.
2. Create a link → it should appear with a QR code.
3. Open the short link (`https://trimrr-xxxx.koyeb.app/<code>`) → redirects.
4. Check the link's analytics page → click is recorded.

## Notes

- **CORS**: only origins in `FRONTEND_ORIGINS` may call the API. If you use
  Vercel preview URLs too, add them (comma-separated) or switch the CORS config
  to an allowed-origin *pattern* (`https://*.vercel.app`).
- **Custom domain**: short links currently look like `onrender.com/<code>`. Add
  a custom domain on Render later for prettier links, then update `VITE_DOMAIN_URL`.
- **Secrets**: the DB password/keys were shared in chat during setup — rotate
  them in Supabase before treating this as production.
