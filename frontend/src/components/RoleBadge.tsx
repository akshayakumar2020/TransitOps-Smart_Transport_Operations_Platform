"use client";

import { ROLE_BY_NAME } from "@/lib/roles";

/**
 * Small reusable badge that renders a human-friendly role label with a
 * colour matched to the role's accent. Used in the Navbar and the
 * Dashboard user card.
 */
export function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_BY_NAME[role as keyof typeof ROLE_BY_NAME];
  const label = meta?.label ?? role.replace("ROLE_", "").replace(/_/g, " ");
  const classes =
    meta?.badge ??
    "bg-slate-500/15 text-slate-300 border-slate-500/30";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
