import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { ok, fail } from "@/lib/api-response";

/**
 * POST /api/auth/login
 *
 * Validates credentials, verifies the password against the bcrypt hash,
 * and returns a signed JWT (24h expiry) along with the public user object.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body", 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  // Validation — mirrors the Spring @Valid constraints.
  if (!email) return fail("Email is required", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("Email format is invalid", 400);
  }
  if (!password) return fail("Password is required", 400);
  if (password.length < 8) {
    return fail("Password must be at least 8 characters", 400);
  }

  // Look up user with their role in a single query.
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      active: users.active,
      role: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.email, email))
    .limit(1);

  const user = rows[0];

  // Intentionally vague message — never reveal whether the email exists.
  if (!user || !user.active) {
    return fail("Invalid Email or Password", 401);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return fail("Invalid Email or Password", 401);
  }

  const token = signToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return ok({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
