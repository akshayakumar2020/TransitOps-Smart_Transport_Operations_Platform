"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasRole, type RoleName } from "@/lib/roles";
import { Navbar } from "./Navbar";

/**
 * Wraps protected pages.
 *
 * - Redirects to /login if the user is not authenticated.
 * - Redirects to /unauthorized if the user's role is not in `allowedRoles`.
 * - Shows a loading state while auth is hydrating.
 */
export function ProtectedLayout({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: RoleName[];
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (!hasRole(user.role, allowedRoles)) {
      router.replace("/unauthorized");
    }
  }, [loading, token, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
      </div>
    );
  }

  if (!token || !user || !hasRole(user.role, allowedRoles)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
