/**
 * Seed script — populates roles and demo users.
 *
 * Run with: `npx tsx src/db/seed.ts`
 * (or via `npm run db:seed` once the script is wired up)
 *
 * Demo credentials (password: Password@123 for all):
 *   manager@transitops.com   → ROLE_FLEET_MANAGER
 *   driver@transitops.com    → ROLE_DRIVER
 *   safety@transitops.com    → ROLE_SAFETY_OFFICER
 *   finance@transitops.com   → ROLE_FINANCIAL_ANALYST
 */

import { eq } from "drizzle-orm";
import { db } from "./index";
import { roles, users } from "./schema";
import { hashPassword } from "../lib/password";

const DEMO_USERS = [
  { name: "Fleet Manager", email: "manager@transitops.com", role: "ROLE_FLEET_MANAGER" },
  { name: "Driver", email: "driver@transitops.com", role: "ROLE_DRIVER" },
  { name: "Safety Officer", email: "safety@transitops.com", role: "ROLE_SAFETY_OFFICER" },
  { name: "Financial Analyst", email: "finance@transitops.com", role: "ROLE_FINANCIAL_ANALYST" },
];

async function seed() {
  console.log("🌱  Seeding TransitOps database…");

  // 1. Upsert roles.
  for (const roleName of DEMO_USERS.map((u) => u.role)) {
    const existing = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(roles).values({ name: roleName });
      console.log(`  + role: ${roleName}`);
    }
  }

  // 2. Upsert demo users with hashed password.
  const passwordHash = await hashPassword("Password@123");
  for (const u of DEMO_USERS) {
    const roleRow = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, u.role))
      .limit(1);
    const roleId = roleRow[0]?.id;
    if (!roleId) {
      throw new Error(`Role ${u.role} not found`);
    }
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, u.email))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(users).values({
        name: u.name,
        email: u.email,
        password: passwordHash,
        roleId,
        active: true,
      });
      console.log(`  + user: ${u.email} (${u.role})`);
    } else {
      await db
        .update(users)
        .set({ password: passwordHash, active: true })
        .where(eq(users.email, u.email));
      console.log(`  ~ refreshed: ${u.email}`);
    }
  }

  console.log("✅  Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
