"use client";

import { useState, useTransition } from "react";
import { joinTrip, leaveTrip } from "@/app/places/actions";

export default function JoinButton({
  tripId,
  joined,
}: {
  tripId: string;
  joined: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function run() {
    if (joined && !confirm("Leave this trip? Your seat will be released.")) return;
    setError(undefined);
    startTransition(async () => {
      const res = await (joined ? leaveTrip(tripId) : joinTrip(tripId));
      if (res.error) setError(res.error);
    });
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={pending}
        className={
          joined
            ? "rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            : "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        }
      >
        {pending ? "Please wait..." : joined ? "Leave trip" : "Join trip"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}