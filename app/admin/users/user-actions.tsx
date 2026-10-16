"use client";

import { useState, useTransition } from "react";
import {
  deleteUser,
  setUserRole,
  setUserStatus,
  type UserActionResult,
} from "./actions";

export default function UserActions({
  userId,
  name,
  role,
  status,
  isSelf,
}: {
  userId: string;
  name: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  if (isSelf) {
    return <span className="text-xs text-slate-400">This is you</span>;
  }

  function run(task: () => Promise<UserActionResult>, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setError(undefined);
    startTransition(async () => {
      const res = await task();
      if (res.error) setError(res.error);
    });
  }

  const btn =
    "rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50";

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {status === "ACTIVE" ? (
          <button
            disabled={pending}
            onClick={() =>
              run(
                () => setUserStatus(userId, "SUSPENDED"),
                `Suspend ${name}? They will not be able to log in, book trips or chat.`
              )
            }
            className={`${btn} border-amber-300 text-amber-700 hover:bg-amber-50`}
          >
            Suspend
          </button>
        ) : (
          <button
            disabled={pending}
            onClick={() => run(() => setUserStatus(userId, "ACTIVE"))}
            className={`${btn} border-emerald-300 text-emerald-700 hover:bg-emerald-50`}
          >
            Reactivate
          </button>
        )}

        {role === "USER" ? (
          <button
            disabled={pending}
            onClick={() =>
              run(
                () => setUserRole(userId, "ADMIN"),
                `Make ${name} an admin? They will be able to manage everything.`
              )
            }
            className={`${btn} border-blue-300 text-blue-700 hover:bg-blue-50`}
          >
            Make admin
          </button>
        ) : (
          <button
            disabled={pending}
            onClick={() =>
              run(() => setUserRole(userId, "USER"), `Remove admin role from ${name}?`)
            }
            className={`${btn} border-slate-300 text-slate-700 hover:bg-slate-50`}
          >
            Remove admin
          </button>
        )}

        {role === "USER" && (
          <button
            disabled={pending}
            onClick={() =>
              run(
                () => deleteUser(userId),
                `Delete ${name}? Their bookings and messages will be deleted too. This cannot be undone.`
              )
            }
            className={`${btn} border-red-300 text-red-600 hover:bg-red-50`}
          >
            Delete
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}