"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
  User as UserIcon,
  Wallet,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { ROLES, type RoleName } from "@/lib/roles";

/** Demo credentials mapped by role — used for one-click autofill. */
const DEMO_CREDENTIALS: Record<RoleName, { email: string; password: string }> = {
  ROLE_FLEET_MANAGER: { email: "manager@transitops.com", password: "Password@123" },
  ROLE_DRIVER: { email: "driver@transitops.com", password: "Password@123" },
  ROLE_SAFETY_OFFICER: { email: "safety@transitops.com", password: "Password@123" },
  ROLE_FINANCIAL_ANALYST: { email: "finance@transitops.com", password: "Password@123" },
};

/** Icons for each role card on the left panel. */
const ROLE_ICONS: Record<RoleName, typeof Truck> = {
  ROLE_FLEET_MANAGER: Truck,
  ROLE_DRIVER: UserIcon,
  ROLE_SAFETY_OFFICER: ShieldCheck,
  ROLE_FINANCIAL_ANALYST: Wallet,
};

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "", remember: true },
  });

  /** One-click autofill from a role card. */
  const quickFill = (role: RoleName) => {
    const creds = DEMO_CREDENTIALS[role];
    setValue("email", creds.email, { shouldValidate: true });
    setValue("password", creds.password, { shouldValidate: true });
    toast.info(`${ROLES.find((r) => r.name === role)?.label} credentials filled.`);
  };

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    const success = await login(data.email, data.password);
    setSubmitting(false);
    if (success) {
      toast.success("Login successful. Welcome back!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#111827] text-slate-100">
      {/* ───────── LEFT PANEL (30%) ───────── */}
      <aside className="relative hidden w-[30%] min-w-[320px] flex-col justify-between overflow-hidden border-r border-white/5 bg-[#1F2937] p-10 lg:flex">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

        {/* Logo + brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
              <Truck className="h-7 w-7 text-[#111827]" strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                TransitOps
              </h1>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Smart Transport Operations Platform
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div>
            <p className="mb-5 text-sm font-medium text-slate-300">
              Login using one of these roles
            </p>
            <ul className="space-y-2.5">
              {ROLES.map((r) => {
                const Icon = ROLE_ICONS[r.name];
                return (
                  <li key={r.name}>
                    <button
                      type="button"
                      onClick={() => quickFill(r.name)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left transition hover:border-amber-500/30 hover:bg-amber-500/[0.06]"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${r.badge}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          {r.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {r.description}
                        </span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-amber-400" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          TransitOps © 2026
        </div>
      </aside>

      {/* ───────── RIGHT PANEL ───────── */}
      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
              <Truck className="h-6 w-6 text-[#111827]" strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">TransitOps</h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Smart Transport Operations Platform
              </p>
            </div>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-white/5 bg-[#1E293B]/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Sign in to your account
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back! Please login to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@transitops.com"
                    className={`w-full rounded-xl border bg-[#111827]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                      errors.email
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-[#111827]/60 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-white/10 focus:border-amber-500/50 focus:ring-amber-500/20"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-amber-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-[#111827] text-amber-500 focus:ring-amber-500/30"
                    {...register("remember")}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  disabled
                  title="Contact your administrator"
                  className="cursor-not-allowed text-sm text-slate-600 line-through"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 py-3.5 text-sm font-semibold text-[#111827] shadow-lg shadow-amber-500/25 transition hover:shadow-xl hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#111827]/30 border-t-[#111827]" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-7 rounded-xl border border-white/5 bg-[#111827]/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Info className="h-3.5 w-3.5" />
                Demo Credentials
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROLES.map((r) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => quickFill(r.name)}
                    className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-left transition hover:border-amber-500/30 hover:bg-amber-500/[0.05]"
                  >
                    <p className={`text-xs font-semibold ${r.accent}`}>{r.label}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {DEMO_CREDENTIALS[r.name].email}
                    </p>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">
                Password for all demo accounts:{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 text-amber-300">
                  Password@123
                </code>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 lg:hidden">
            TransitOps © 2026
          </p>
        </div>
      </main>
    </div>
  );
}
