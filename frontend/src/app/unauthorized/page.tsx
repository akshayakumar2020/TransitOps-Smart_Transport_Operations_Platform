"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

/**
 * Shown when an authenticated user attempts to access a route outside
 * their role's permission matrix. HTTP 403 equivalent.
 */
export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] p-6 text-slate-100">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
          <ShieldX className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-white">403 — Unauthorized</h1>
        <p className="mt-3 text-sm text-slate-400">
          You don&apos;t have permission to access this page. Your role
          {user ? (
            <>
              {" "}
              (<span className="font-medium text-amber-300">
                {user.role.replace("ROLE_", "").replace(/_/g, " ")}
              </span>
              )
            </>
          ) : null}{" "}
          is not authorised for this resource.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-5 py-3 text-sm font-semibold text-[#111827] shadow-lg shadow-amber-500/25 transition hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          If you believe this is an error, contact your Fleet Manager.
        </p>
      </div>
    </div>
  );
}
