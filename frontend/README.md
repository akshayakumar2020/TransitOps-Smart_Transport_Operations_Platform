# TransitOps — Smart Transport Operations Platform

> **Authentication Module** — enterprise-grade JWT auth with role-based access
> control, built on Clean Architecture principles.

This repository contains two implementations of the same authentication module:

| Implementation | Path | Status |
|---|---|---|
| **Next.js** (working demo) | `src/` | ✅ Runs in this sandbox |
| **Spring Boot** (reference) | `backend/` | 📦 Production source for deployment |

The Next.js app is a fully functional, deployable implementation of the spec.
The `backend/` folder contains the equivalent Spring Boot project (Java 21,
Spring Security + JWT) for teams that prefer the JVM stack — the API contract,
database schema, and role model are identical.

---

## ✨ Features

- **JWT Authentication** — 24h signed tokens (`userId`, `name`, `email`, `role`)
- **Role-Based Access Control** — 4 roles with per-route permission matrix
- **Protected Routes** — client-side guard + server-side enforcement
- **BCrypt Password Hashing** — 10 salt rounds (interchangeable between stacks)
- **Premium Dark UI** — split-screen login, glassmorphism, amber accents
- **Toast Notifications** — login success/failure, session expired, unauthorized
- **Form Validation** — React Hook Form + Zod-style rules
- **Swagger / OpenAPI** — documented endpoints (Spring Boot deliverable)

---

## 🎭 Roles & Demo Credentials

Password for **all** demo accounts: `Password@123`

| Role | Email | Access |
|---|---|---|
| Fleet Manager | `manager@transitops.com` | Full platform access |
| Driver | `driver@transitops.com` | Dashboard, own trips, profile |
| Safety Officer | `safety@transitops.com` | Driver module, reports |
| Financial Analyst | `finance@transitops.com` | Fuel, expenses, reports |

---

## 🗄️ Database Schema

```sql
TABLE roles (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

TABLE users (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,          -- BCrypt hash
  role_id    BIGINT NOT NULL REFERENCES roles(id),
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

See [`database/schema.sql`](./database/schema.sql) for the full script with seed data.

---

## 🚀 Getting Started (Next.js Demo)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # DATABASE_URL + JWT_SECRET already set

# 3. Apply schema + seed demo users
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. Start dev server
npm run dev
# → http://localhost:3000/login
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | local PG |
| `JWT_SECRET` | 256-bit signing secret | (dev fallback) |
| `JWT_EXPIRES_IN` | Token lifetime | `24h` |

---

## 🔌 API Reference

### `POST /api/auth/login`
```json
// Request
{ "email": "manager@transitops.com", "password": "Password@123" }

// 200 Response
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Fleet Manager",
            "email": "manager@transitops.com",
            "role": "ROLE_FLEET_MANAGER" }
}

// 401 Response
{ "success": false, "message": "Invalid Email or Password" }
```

### `POST /api/auth/register`  🔒 Fleet Manager only
```json
// Request (with Bearer token)
{ "name": "Jane Driver", "email": "jane@transitops.com",
  "password": "Password@123", "role": "ROLE_DRIVER" }

// 201 Response
{ "success": true,
  "user": { "id": 5, "name": "Jane Driver",
            "email": "jane@transitops.com", "role": "ROLE_DRIVER" } }
```

### `GET /api/auth/me`  🔒 Authenticated
Returns the profile of the currently authenticated user.

### `GET /api/users`  🔒 Fleet Manager only
Lists all users (demonstrates RBAC).

### `GET /api/health`
Liveness probe — `{ "ok": true }`.

---

## 🏗️ Architecture

```
Controller (route.ts)  →  Service (lib)  →  Repository (db/schema)  →  PostgreSQL
        ↓                     ↓                    ↓
      DTO / validation    JWT + BCrypt        Drizzle ORM
```

### Clean Architecture mapping

| Spring Boot concept | Next.js equivalent |
|---|---|
| `@RestController` | `app/api/*/route.ts` |
| `@Service` | `lib/auth-server.ts`, `lib/jwt.ts`, `lib/password.ts` |
| `@Repository` | `db/schema.ts` + Drizzle queries |
| `SecurityConfig` | per-route `requireRole()` checks |
| `JwtAuthenticationFilter` | `lib/auth-server.ts#getAuthUser` |
| `BCryptPasswordEncoder` | `lib/password.ts` |
| `@ControllerAdvice` | `lib/api-response.ts` (`ok`/`fail`) |
| `AuthContext` (React) | `context/AuthContext.tsx` |
| `ProtectedRoute` | `components/ProtectedLayout.tsx` |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#111827` | Page background |
| `--bg-sidebar` | `#1F2937` | Left panel / navbar |
| `--bg-card` | `#1E293B` | Cards & login form |
| `--accent` | `#F59E0B` | Amber — buttons, highlights |
| `radius` | `xl` (12px) | All interactive elements |
| `shadow` | `2xl` + glow | Login CTA |

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts      ← POST /api/auth/login
│   │   │   │   ├── register/route.ts   ← POST /api/auth/register
│   │   │   │   └── me/route.ts         ← GET  /api/auth/me
│   │   │   ├── users/route.ts           ← GET  /api/users (Fleet Mgr)
│   │   │   └── health/route.ts          ← GET  /api/health
│   │   ├── login/page.tsx               ← Premium split-screen login
│   │   ├── dashboard/page.tsx           ← Role-aware dashboard
│   │   ├── unauthorized/page.tsx        ← 403 page
│   │   ├── layout.tsx                   ← AuthProvider + ToastContainer
│   │   └── page.tsx                     ← Redirect → /dashboard
│   ├── components/
│   │   ├── Navbar.tsx                   ← Avatar + role badge + logout
│   │   ├── ProtectedLayout.tsx          ← Route guard
│   │   └── RoleBadge.tsx                ← Reusable role pill
│   ├── context/
│   │   └── AuthContext.tsx              ← login/logout/isAuthenticated
│   ├── db/
│   │   ├── schema.ts                    ← Drizzle tables (roles, users)
│   │   ├── seed.ts                      ← Demo users + roles
│   │   └── index.ts                     ← Drizzle client
│   └── lib/
│       ├── api-client.ts                ← Axios + JWT interceptor
│       ├── api-response.ts              ← Standardised envelope
│       ├── auth-server.ts               ← getAuthUser / requireRole
│       ├── jwt.ts                       ← signToken / verifyToken
│       ├── password.ts                  ← hashPassword / comparePassword
│       └── roles.ts                     ← Role matrix + permissions
├── database/
│   └── schema.sql                       ← SQL script (Supabase PG)
├── backend/                             ← Spring Boot reference project
│   ├── pom.xml
│   └── src/main/java/com/transitops/...
├── .env
└── README.md
```

---

## 🔐 Security Notes

- Passwords are **never** returned in API responses.
- Login failures return a generic `"Invalid Email or Password"` to prevent
  user enumeration.
- JWTs are stored in `localStorage` and sent via `Authorization: Bearer`.
- The axios interceptor clears storage and redirects on 401 (session expiry).
- BCrypt cost factor = 10 (matches Spring Boot `BCryptPasswordEncoder`).

---

## 🧩 Future Integration Points

The auth module is designed to be extended by:

- **Dashboard** — already scaffolded with role-aware stat cards
- **Vehicle Registry** — add `vehicles` table + `GET /api/vehicles`
- **Driver Management** — `ROLE_DRIVER` CRUD under `/drivers`
- **Trip Dispatch** — `trips` table + dispatch endpoints
- **Maintenance** — `maintenance_logs` table
- **Fuel & Expense** — `fuel_records`, `expenses` tables
- **Reports** — aggregation endpoints guarded by role matrix
- **Settings** — `ROLE_FLEET_MANAGER` only

Each new module just needs to:
1. Add a Drizzle table in `src/db/schema.ts`
2. Create an API route under `src/app/api/`
3. Wrap the page in `<ProtectedLayout allowedRoles={[...]}>`

---

## 🛠️ Tech Stack

**Frontend:** React 19 · Next.js 16 · Tailwind CSS 4 · React Hook Form ·
React Toastify · Lucide React · Axios

**Backend (demo):** Next.js Route Handlers · Drizzle ORM · PostgreSQL

**Backend (reference):** Java 21 · Spring Boot 3.5 · Spring Security ·
Spring Data JPA · Hibernate · JWT · Lombok · SpringDoc OpenAPI

---

## 📜 License

TransitOps © 2026 — Odoo Hackathon project.
