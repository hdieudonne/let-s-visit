"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "./actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    {}
  );

  return (
    <main className="mx-auto mt-16 max-w-sm p-4">
      <h1 className="mb-6 text-2xl font-bold">Create account</h1>

      {state.success ? (
        <p className="rounded bg-green-100 p-3 text-green-800">
          Account created.{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>
      ) : (
        <form action={action} className="space-y-4">
          <input name="name" placeholder="Full name" required
            className="w-full rounded border p-2" />
          <input name="email" type="email" placeholder="Email" required
            className="w-full rounded border p-2" />
          <input name="password" type="password" placeholder="Password (min 8)" required
            className="w-full rounded border p-2" />
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button disabled={pending}
            className="w-full rounded bg-black p-2 text-white disabled:opacity-50">
            {pending ? "Creating..." : "Register"}
          </button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">Log in</Link>
          </p>
        </form>
      )}
    </main>
  );
}