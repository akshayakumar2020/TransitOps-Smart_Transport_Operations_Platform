"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Users,
  Route as RouteIcon,
  Fuel,
  ShieldCheck,
  Wallet,
  FileBarChart,
  Settings as SettingsIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { useAuth } from "@/context/AuthContext";
import { RoleBadge } from "@/components/RoleBadge";
import { ROLE, ROLES, type RoleName } from "@/lib/roles";
import { apiClient } from "@/lib/api-client";

/**
 * Dashboard — accessible to every authenticated role.
 *
 * Each role sees a curated set of stat cards + quick actions based on the
 * ROUTE_PERMISSIONS matrix, demonstrating role-based UI rendering.
 */

interface DashboardStats {
  label: string;
  value: string;
  trend: string;
  icon: typeof Truck;
  accent: string;
}

const ROLE_MODULES: Record<RoleName, { title: string; icon: typeof Truck }[]> = {
  ROLE_FLEET_MANAGER: [
    { title: "Vehicle Registry", icon: Truck },
    { title: "Driver Management", icon: Users },
    { title: "Trip Dispatch", icon: RouteIcon },
    { title: "Maintenance", icon: SettingsIcon },
    { title: "Fuel & Expense", icon: Fuel },
    { title: "Reports", icon: FileBarChart },
  ],
  ROLE_DRIVER: [
    { title: "My Dashboard", icon: Truck },
    { title: "My Trips", icon: RouteIcon },
    { title: "Profile", icon: Users },
  ],
  ROLE_SAFETY_OFFICER: [
    { title: "Driver Module", icon: Users },
    { title: "Safety Reports", icon: ShieldCheck },
  ],
  ROLE_FINANCIAL_ANALYST: [
    { title: "Fuel", icon: Fuel },
    { title: "Expenses", icon: Wallet },
    { title: "Reports", icon: FileBarChart },
  ],
};

const STATS_BY_ROLE: Record<RoleName, DashboardStats[]> = {
  ROLE_FLEET_MANAGER: [
    { label: "Active Vehicles", value: "248", trend: "+12 this week", icon: Truck, accent: "text-amber-400" },
    { label: "Drivers On Duty", value: "64", trend: "+5 today", icon: Users, accent: "text-sky-400" },
    { label: "Trips Today", value: "132", trend: "+8.2%", icon: RouteIcon, accent: "text-emerald-400" },
    { label: "Pending Maintenance", value: "7", trend: "2 urgent", icon: AlertTriangle, accent: "text-red-400" },
  ],
  ROLE_DRIVER: [
    { label: "Trips This Week", value: "14", trend: "2 remaining", icon: RouteIcon, accent: "text-sky-400" },
    { label: "Hours Logged", value: "38h", trend: "On track", icon: Clock, accent: "text-emerald-400" },
    { label: "Safety Score", value: "98", trend: "+2 pts", icon: ShieldCheck, accent: "text-amber-400" },
    { label: "On-Time Rate", value: "96%", trend: "+1.4%", icon: CheckCircle2, accent: "text-emerald-400" },
  ],
  ROLE_SAFETY_OFFICER: [
    { label: "Open Incidents", value: "3", trend: "1 high priority", icon: AlertTriangle, accent: "text-red-400" },
    { label: "Drivers Monitored", value: "64", trend: "All active", icon: Users, accent: "text-sky-400" },
    { label: "Compliance Score", value: "94%", trend: "+3.1%", icon: ShieldCheck, accent: "text-emerald-400" },
    { label: "Reports Filed", value: "27", trend: "This month", icon: FileBarChart, accent: "text-violet-400" },
  ],
  ROLE_FINANCIAL_ANALYST: [
    { label: "Fuel Spend (MTD)", value: "$48.2K", trend: "-6.4%", icon: Fuel, accent: "text-amber-400" },
    { label: "Operating Expense", value: "$112K", trend: "+2.1%", icon: Wallet, accent: "text-violet-400" },
    { label: "Cost / Mile", value: "$1.84", trend: "-$0.06", icon: TrendingUp, accent: "text-emerald-400" },
    { label: "Budget Utilised", value: "62%", trend: "On track", icon: FileBarChart, accent: "text-sky-400" },
  ],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const role = (user?.role ?? ROLE.FLEET_MANAGER) as RoleName;
  const stats = STATS_BY_ROLE[role];
  const modules = ROLE_MODULES[role];
  const [userCount, setUserCount] = useState<number | null>(null);

  // Fleet managers get a live user count to prove the protected API works.
  useEffect(() => {
    if (role !== ROLE.FLEET_MANAGER) return;
    apiClient
      .get<{ success: boolean; users: { id: number }[] }>("/users")
      .then((res) => setUserCount(res.data.users.length))
      .catch(() => setUserCount(null));
  }, [role]);

  const roleMeta = ROLES.find((r) => r.name === role);

  return (
    <ProtectedLayout allowedRoles={[role]}>
      {/* Welcome header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Here&apos;s what&apos;s happening across your operations today.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#1E293B]/60 px-4 py-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-[#111827]">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <RoleBadge role={role} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group rounded-2xl border border-white/5 bg-[#1E293B]/60 p-5 transition hover:border-amber-500/20 hover:bg-[#1E293B]"
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${s.accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <TrendingUp className="h-4 w-4 text-slate-600" />
              </div>
              <p className="mt-4 text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
              <p className={`mt-2 text-xs ${s.accent}`}>{s.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Modules + side panel */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Modules */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Modules
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.title}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-[#1E293B]/60 p-5 text-left transition hover:border-amber-500/30 hover:bg-[#1E293B]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 transition group-hover:from-amber-400 group-hover:to-amber-600 group-hover:text-[#111827]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-white">{m.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#1E293B]/60 p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">
              Your Access Level
            </h3>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${roleMeta?.accent}`}>
                {(() => {
                  const map: Record<RoleName, typeof Truck> = {
                    ROLE_FLEET_MANAGER: Truck,
                    ROLE_DRIVER: Users,
                    ROLE_SAFETY_OFFICER: ShieldCheck,
                    ROLE_FINANCIAL_ANALYST: Wallet,
                  };
                  const Icon = map[role];
                  return <Icon className="h-5 w-5" />;
                })()}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{roleMeta?.label}</p>
                <p className="text-xs text-slate-400">{roleMeta?.description}</p>
              </div>
            </div>
          </div>

          {role === ROLE.FLEET_MANAGER && (
            <div className="rounded-2xl border border-white/5 bg-[#1E293B]/60 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">
                System Overview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Users</span>
                  <span className="font-semibold text-white">
                    {userCount ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Roles</span>
                  <span className="font-semibold text-white">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Platform Status</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Operational
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
