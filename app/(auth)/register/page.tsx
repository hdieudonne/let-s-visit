"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "./actions";
import { Compass, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    {}
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#EFF1F3] px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#D8B4A0]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D8CDD2]/35 blur-3xl pointer-events-none" />

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
          Create an account
        </h1>
        <p className="mt-1.5 text-sm text-[#52646B]">
          Join our community of road trippers and explorers
        </p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md rounded-2xl border border-[#D8CDD2] bg-white p-8 shadow-xs relative z-10">
        {state.success ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D8B4A0]/30 text-[#223843]">
              <CheckCircle2 className="h-8 w-8 text-[#D97760]" />
            </div>
            <h2 className="text-xl font-bold text-[#223843]">Account Created!</h2>
            <p className="text-sm text-[#52646B]">
              Your account has been successfully registered. You can now log in and join upcoming trips.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#223843] py-3 px-4 text-sm font-semibold text-white shadow-xs hover:bg-[#344F5B] transition"
              >
                Continue to Log in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            {state.error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#223843]">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#52646B]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Alex Rivera"
                  required
                  className="w-full rounded-xl border border-[#D8CDD2] bg-[#EFF1F3]/40 py-2.5 pl-10 pr-3.5 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
                />
              </div>
            </div>

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
                  placeholder="alex@example.com"
                  required
                  className="w-full rounded-xl border border-[#D8CDD2] bg-[#EFF1F3]/40 py-2.5 pl-10 pr-3.5 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#223843]">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#52646B]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-[#D8CDD2] bg-[#EFF1F3]/40 py-2.5 pl-10 pr-3.5 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#52646B]">Must be at least 8 characters long</p>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#223843] py-3 px-4 text-sm font-semibold text-white shadow-xs hover:bg-[#344F5B] focus:outline-hidden focus:ring-4 focus:ring-[#223843]/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {!state.success && (
          <div className="mt-6 pt-5 border-t border-[#D8CDD2]/60 text-center text-sm text-[#52646B]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D97760] hover:underline transition"
            >
              Log in
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-[#52646B] relative z-10">
        <Link href="/" className="hover:text-[#223843] transition">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}