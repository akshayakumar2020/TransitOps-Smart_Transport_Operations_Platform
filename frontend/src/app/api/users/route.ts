import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { requireRole } from "@/lib/auth-server";
import { ok, fail } from "@/lib/api-response";
import { ROLE } from "@/lib/roles";

/**
 * GET /api/users
 *
 * Lists all users. Restricted to Fleet Managers — demonstrates the
 * role-based access control layer that the Spring Security config enforces
 * in the backend deliverable.
 */
export async function GET(req: NextRequest) {
  try {
    requireRole(req, [ROLE.FLEET_MANAGER]);
  } catch (e) {
    const err = e as { status: number; message: string };
    return fail(err.message, err.status ?? 401);
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
    .innerJoin(roles, eq(users.roleId, roles.id));

  return ok({ users: rows });
}
