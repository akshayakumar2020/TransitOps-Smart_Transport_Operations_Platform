import {
  pgTable,
  bigserial,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

/**
 * Roles table.
 * Mirrors the SQL spec:
 *   TABLE roles (id BIGSERIAL PRIMARY KEY, name VARCHAR(100))
 */
export const roles = pgTable("roles", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

/**
 * Users table.
 * Mirrors the SQL spec:
 *   TABLE users (
 *     id BIGSERIAL PRIMARY KEY,
 *     name VARCHAR(255),
 *     email VARCHAR(255) UNIQUE,
 *     password VARCHAR(255),
 *     role_id BIGINT REFERENCES roles(id),
 *     active BOOLEAN,
 *     created_at TIMESTAMPTZ
 *   )
 */
export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  roleId: bigserial("role_id", { mode: "number" })
    .notNull()
    .references(() => roles.id),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Role = typeof roles.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
