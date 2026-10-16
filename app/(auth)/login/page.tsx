"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginUser, type LoginState } from "./actions";
import { Compass, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginUser,
    {}
  );

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#D8CDD2] bg-white p-8 shadow-xs relative z-10">
      <form action={action} className="space-y-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        {state.error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#223843]">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#52646B]">
              <Mail className="h-4 w-4" />
            </div>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full rounded-xl border border-[#D8CDD2] bg-[#EFF1F3]/40 py-2.5 pl-10 pr-3.5 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#223843]">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#52646B]">
              <Lock className="h-4 w-4" />
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[#D8CDD2] bg-[#EFF1F3]/40 py-2.5 pl-10 pr-3.5 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#223843] py-3 px-4 text-sm font-semibold text-white shadow-xs hover:bg-[#344F5B] focus:outline-hidden focus:ring-4 focus:ring-[#223843]/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-[#D8CDD2]/60 text-center text-sm text-[#52646B]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#D97760] hover:underline transition"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#EFF1F3] px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#D8B4A0]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#D8CDD2]/35 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#223843] text-white shadow-xs">
            <Compass className="h-6 w-6 text-[#D8B4A0]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#223843]">
            Let&apos;s Visit
          </span>
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#223843]">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-[#52646B]">
          Sign in to access your upcoming trips and destinations
        </p>
      </div>

      <Suspense fallback={<div className="w-full max-w-md h-72 rounded-2xl border border-[#D8CDD2] bg-white animate-pulse" />}>
        <LoginForm />
      </Suspense>

      <div className="mt-8 text-center text-xs text-[#52646B] relative z-10">
        <Link href="/" className="hover:text-[#223843] transition">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}