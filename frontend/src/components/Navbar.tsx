"use client";

import { LogOut, LayoutDashboard, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RoleBadge } from "./RoleBadge";
import { useRouter } from "next/navigation";

/**
 * Top navigation bar shown on all authenticated pages.
 * Right-aligned: avatar + username + role badge + logout button.
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#1F2937]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20">
            <Truck className="h-5 w-5 text-[#111827]" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">TransitOps</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Smart Transport
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <div className="flex justify-end">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-[#111827] ring-2 ring-amber-500/30">
                {initials}
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
