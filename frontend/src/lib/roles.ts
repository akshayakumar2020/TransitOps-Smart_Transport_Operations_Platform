/**
 * Centralised role definitions and access-control matrix.
 *
 * Roles follow the Spring Security convention (ROLE_ prefix) so the
 * Next.js demo maps 1:1 onto the Spring Boot backend deliverable.
 */

export const ROLE = {
  FLEET_MANAGER: "ROLE_FLEET_MANAGER",
  DRIVER: "ROLE_DRIVER",
  SAFETY_OFFICER: "ROLE_SAFETY_OFFICER",
  FINANCIAL_ANALYST: "ROLE_FINANCIAL_ANALYST",
} as const;

export type RoleName = (typeof ROLE)[keyof typeof ROLE];

export interface RoleMeta {
  name: RoleName;
  label: string;
  description: string;
  accent: string; // tailwind text color
  badge: string; // tailwind classes
}

/**
 * Human-friendly metadata for each role, used by the login page
 * and the role badge component.
 */
export const ROLES: RoleMeta[] = [
  {
    name: ROLE.FLEET_MANAGER,
    label: "Fleet Manager",
    description: "Full access to the entire platform",
    accent: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    name: ROLE.DRIVER,
    label: "Driver",
    description: "Dashboard, own trips & profile",
    accent: "text-sky-400",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  {
    name: ROLE.SAFETY_OFFICER,
    label: "Safety Officer",
    description: "Driver module & reports",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    name: ROLE.FINANCIAL_ANALYST,
    label: "Financial Analyst",
    description: "Fuel, expenses & reports",
    accent: "text-violet-400",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
];

export const ROLE_BY_NAME: Record<RoleName, RoleMeta> = ROLES.reduce(
  (acc, r) => {
    acc[r.name] = r;
    return acc;
  },
  {} as Record<RoleName, RoleMeta>
);

/**
 * Route → allowed roles matrix.
 * Drives both the client ProtectedRoute and the server middleware.
 */
export const ROUTE_PERMISSIONS: Record<string, RoleName[]> = {
  "/dashboard": [
    ROLE.FLEET_MANAGER,
    ROLE.DRIVER,
    ROLE.SAFETY_OFFICER,
    ROLE.FINANCIAL_ANALYST,
  ],
  "/fleet": [ROLE.FLEET_MANAGER],
  "/drivers": [ROLE.FLEET_MANAGER, ROLE.SAFETY_OFFICER],
  "/trips": [ROLE.FLEET_MANAGER, ROLE.DRIVER],
  "/fuel": [ROLE.FLEET_MANAGER, ROLE.FINANCIAL_ANALYST],
  "/expenses": [ROLE.FLEET_MANAGER, ROLE.FINANCIAL_ANALYST],
  "/reports": [ROLE.FLEET_MANAGER, ROLE.SAFETY_OFFICER, ROLE.FINANCIAL_ANALYST],
  "/settings": [ROLE.FLEET_MANAGER],
};

/** API permission matrix — used by the server auth helper. */
export const API_PERMISSIONS: Record<string, RoleName[]> = {
  "GET:/api/users": [ROLE.FLEET_MANAGER],
  "POST:/api/auth/register": [ROLE.FLEET_MANAGER],
};

export function hasRole(role: string, allowed: RoleName[]): boolean {
  return allowed.includes(role as RoleName);
}
