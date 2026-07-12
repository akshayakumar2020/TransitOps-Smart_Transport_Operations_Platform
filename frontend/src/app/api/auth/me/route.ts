import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { getAuthUser } from "@/lib/auth-server";
import { ok, fail } from "@/lib/api-response";

/**
 * GET /api/auth/me
 *
 * Returns the profile of the currently authenticated user.
 * Used by the frontend to rehydrate the AuthContext on page reload.
 */
export async function GET(req: NextRequest) {
  const caller = getAuthUser(req);
  if (!caller) {
    return fail("Unauthorized", 401);
  }

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: roles.name,
      active: users.active,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, caller.userId))
    .limit(1);

  const user = rows[0];
  if (!user || !user.active) {
    return fail("User not found or inactive", 401);
  }

  return ok({ user });
}
