import { NextRequest } from "next/server";
import { verifyToken, type JwtPayload } from "./jwt";
import { hasRole, type RoleName } from "./roles";

/**
 * Server-side auth helper.
 *
 * Extracts and verifies the JWT from the `Authorization: Bearer <token>`
 * header. This is the Next.js equivalent of the Spring `JwtAuthenticationFilter`.
 */
export function getAuthUser(req: NextRequest): JwtPayload | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Require an authenticated user with one of the allowed roles.
 * Throws an `AuthError` with the appropriate status code otherwise.
 */
export function requireRole(
  req: NextRequest,
  allowed: RoleName[]
): JwtPayload {
  const user = getAuthUser(req);
  if (!user) {
    throw new AuthError(401, "Unauthorized: missing or invalid token");
  }
  if (!hasRole(user.role, allowed)) {
    throw new AuthError(403, "Forbidden: insufficient role privileges");
  }
  return user;
}

/** Typed auth error carrying an HTTP status code. */
export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
