"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginUser,
    {}
  );

  return (
    <main className="mx-auto mt-16 max-w-sm p-4">
      <h1 className="mb-6 text-2xl font-bold">Log in</h1>
      <form action={action} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required
          className="w-full rounded border p-2" />
        <input name="password" type="password" placeholder="Password" required
          className="w-full rounded border p-2" />
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending}
          className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
          {pending ? "Logging in..." : "Log in"}
        </button>
        <p className="text-sm">
          No account?{" "}
          <Link href="/register" className="underline">Register</Link>
        </p>
      </form>
    </main>
  );
}