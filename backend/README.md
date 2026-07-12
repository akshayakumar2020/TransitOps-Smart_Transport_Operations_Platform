# TransitOps — Backend (Spring Boot)

Smart Transport Operations Platform REST API. Implements the full build plan: auth (JWT + RBAC),
Vehicles, Drivers, Trips (with lifecycle validation), Maintenance, Fuel Logs, Expenses, Dashboard
KPIs, and CSV reporting.

## Stack
- Java 17, Spring Boot 3.3, Spring Data JPA, Spring Security (JWT)
- PostgreSQL (Supabase)
- springdoc-openapi (Swagger UI)

## Setup

1. **Create a Supabase Postgres project** (https://supabase.com) and grab the connection string
   (Project Settings → Database → Connection string → use the **Session pooler** URI for Hibernate DDL).

2. Edit `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:postgresql://YOUR_SUPABASE_HOST:5432/postgres?sslmode=require
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_SUPABASE_DB_PASSWORD
   ```
   Also change `jwt.secret` to your own random 256-bit+ base64 string for production.

3. Build & run:
   ```
   mvn spring-boot:run
   ```
   Hibernate will auto-create all 7 tables on first run (`ddl-auto=update`).

4. Swagger UI: http://localhost:8080/swagger-ui.html

## Auth flow
- `POST /api/auth/signup` with `{ name, email, password, role: "FLEET_MANAGER" | "DRIVER" }` → returns JWT.
- `POST /api/auth/login` with `{ email, password }` → returns JWT.
- Send `Authorization: Bearer <token>` on every subsequent request.
- Vehicle/Driver **create/update** and Maintenance actions require `FLEET_MANAGER` role
  (`@PreAuthorize("hasRole('FLEET_MANAGER')")`).

## Business rules (all enforced in the Service layer)
- Vehicle registration number is unique (DB constraint + service check).
- Retired/In Shop vehicles are excluded from availability queries used by Trip creation.
- Drivers with expired licenses or SUSPENDED status cannot be assigned to a trip.
- A vehicle/driver already ON_TRIP cannot be assigned to another trip.
- Cargo weight must not exceed `vehicle.maxLoadCapacity`.
- Dispatch/Complete/Cancel atomically flip Trip + Vehicle + Driver status inside one
  `@Transactional` service method (see `TripService`).
- Opening a maintenance record flips the vehicle to `IN_SHOP`; closing restores `AVAILABLE`
  (unless the vehicle is `RETIRED`).

## REST surface
See the Build Plan doc §7, all implemented 1:1 — full list also visible live in Swagger UI.

## Seed / demo script
Follow the exact workflow from the plan (§9): register Van-05 (500kg capacity), register driver
Alex, create a 450kg trip, dispatch → complete → check reports; then open/close a maintenance
record on Van-05 to see it hide/reappear in the trip vehicle dropdown.

## Notes
- This code was generated without access to Maven Central in the build sandbox, so it has **not
  been compiled here** — dependencies, imports and package layout were double-checked by hand and
  brace-balance verified across all 53 files, but run `mvn compile` locally as your first step.
