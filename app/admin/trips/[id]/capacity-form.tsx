"use client";

import { useActionState } from "react";
import { updateCapacity, type TripState } from "../actions";
import { Users, AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

export default function CapacityForm({
  tripId,
  capacity,
}: {
  tripId: string;
  capacity: number;
}) {
  const [state, action, pending] = useActionState<TripState, FormData>(
    updateCapacity.bind(null, tripId),
    {}
  );

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{state.success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-44">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Users className="h-4 w-4" />
          </div>
          <input
            name="capacity"
            type="number"
            min={1}
            max={500}
            defaultValue={capacity}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Update Limit</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-slate-400">
        Adjusting capacity recalculates open seats automatically. Cannot be lower than booked passengers.
      </p>
    </form>
  );
}