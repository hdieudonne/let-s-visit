"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createTrip, type TripState } from "../actions";
import { 
  Car, 
  Users, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  Calculator 
} from "lucide-react";

export default function TripForm({
  places,
}: {
  places: { id: string; name: string; location?: string }[];
}) {
  const [state, action, pending] = useActionState<TripState, FormData>(
    createTrip,
    {}
  );
  const [cars, setCars] = useState(1);
  const [seats, setSeats] = useState(4);

  const totalCapacity = Math.max(0, cars) * Math.max(0, seats);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      <form action={action} className="space-y-6">
        {state.error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{state.error}</span>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Select Destination Place
          </label>
          <div className="relative">
            <select
              name="placeId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
            >
              <option value="" disabled>
                Choose a place to visit...
              </option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.location ? `(${p.location})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Departure Date
          </label>
          <div className="relative">
            <input
              name="date"
              type="date"
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
            />
          </div>
        </div>

        {/* Fleet & Seat Calculation */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Calculator className="h-4 w-4 text-blue-600" />
            Fleet & Capacity Configuration
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Car className="h-3.5 w-3.5 text-slate-400" />
                Number of Vehicles
              </label>
              <input
                name="cars"
                type="number"
                min={1}
                max={50}
                value={cars}
                onChange={(e) => setCars(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                Passenger Seats per Vehicle
              </label>
              <input
                name="seatsPerCar"
                type="number"
                min={1}
                max={60}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
              />
            </div>
          </div>

          {/* Computed Capacity Banner */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 flex items-center justify-between">
            <span className="text-xs text-blue-800 font-medium">
              Formula: {cars || 0} {cars === 1 ? "car" : "cars"} × {seats || 0} seats
            </span>
            <div className="text-right">
              <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                Total Capacity:{" "}
              </span>
              <span className="text-base font-extrabold text-blue-900">
                {totalCapacity} travelers
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/admin/trips"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Trip...</span>
              </>
            ) : (
              <span>Confirm & Create Trip</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}