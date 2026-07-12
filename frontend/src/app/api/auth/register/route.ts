import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { requireRole } from "@/lib/auth-server";
import { ok, fail } from "@/lib/api-response";
import { ROLE, type RoleName } from "@/lib/roles";

/**
 * POST /api/auth/register
 *
 * Only a Fleet Manager may create new users. Passwords are hashed with
 * bcrypt before being persisted. This mirrors the Spring Boot spec:
 * "Only Fleet Manager can create new users."
 */
export async function POST(req: NextRequest) {
  let caller;
  try {
    caller = requireRole(req, [ROLE.FLEET_MANAGER]);
  } catch (e) {
    const err = e as { status: number; message: string };
    return fail(err.message, err.status ?? 401);
  }

  let body: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const role = body.role ?? "";

  if (!name) return fail("Name is required", 400);
  if (!email) return fail("Email is required", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("Email format is invalid", 400);
  }
  if (!password || password.length < 8) {
    return fail("Password must be at least 8 characters", 400);
  }
  const validRoles: RoleName[] = [
    ROLE.FLEET_MANAGER,
    ROLE.DRIVER,
    ROLE.SAFETY_OFFICER,
    ROLE.FINANCIAL_ANALYST,
  ];
  if (!validRoles.includes(role as RoleName)) {
    return fail("Role is invalid", 400);
  }

  // Resolve role id.
  const roleRows = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, role))
    .limit(1);
  const roleId = roleRows[0]?.id;
  if (!roleId) return fail("Role not found", 400);

  // Enforce unique email.
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return fail("Email already registered", 409);
  }

  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    name,
    email,
    password: passwordHash,
    roleId,
    active: true,
  });

  // Re-fetch the created user joined with its role label.
  const createdUser = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email))
    .limit(1);

  return ok({ user: createdUser[0] }, 201);
}
