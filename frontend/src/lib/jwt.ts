import jwt from "jsonwebtoken";

/**
 * JWT service.
 *
 * In production the secret comes from `JWT_SECRET` in the environment.
 * A dev fallback is provided so the demo runs out-of-the-box. The Spring
 * Boot backend uses the equivalent key from `application.properties`.
 *
 * Token payload mirrors the spec:
 *   { userId, name, email, role }
 * Expiration: 24 hours.
 */

const JWT_SECRET = process.env.JWT_SECRET ?? "transitops_dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "24h";

export interface JwtPayload {
  userId: number;
  name: string;
  email: string;
  role: string;
}

/** Sign a JWT for an authenticated user. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

/** Verify a JWT and return the decoded payload, or null if invalid. */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
