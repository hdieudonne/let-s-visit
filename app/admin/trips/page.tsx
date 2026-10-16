import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deleteTrip } from "./actions";
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Users, 
  Settings2, 
  Trash2, 
  Sparkles,
  AlertCircle
} from "lucide-react";

export default async function AdminTripsPage() {
  const trips = await prisma.trip.findMany({
    include: {
      place: { select: { name: true, location: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Travel Operations
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Trips & Carpools
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule departure dates, monitor traveler bookings, and manage passenger capacities
          </p>
        </div>

        <Link
          href="/admin/trips/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Trip</span>
        </Link>
      </div>

      {/* Trips List */}
      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <Calendar className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No trips scheduled yet</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
            Plan your next journey by pairing an existing destination with a departure date and car fleet.
          </p>
          <Link
            href="/admin/trips/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Schedule First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trips.map((trip) => {
            const bookedCount = trip._count.bookings;
            const percentage = Math.min(
              100,
              Math.round((bookedCount / (trip.capacity || 1)) * 100)
            );

            let statusClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (trip.status === "FULL") {
              statusClasses = "bg-amber-50 text-amber-700 border-amber-200";
            } else if (trip.status === "CANCELLED") {
              statusClasses = "bg-rose-50 text-rose-700 border-rose-200";
            }

            return (
              <div
                key={trip.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition duration-200"
              >
                {/* Trip Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">
                      {trip.place.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border uppercase tracking-wider ${statusClasses}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                      {trip.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      {formatDate(trip.date)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {trip.place.location}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="max-w-xs pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="h-3 w-3 text-slate-400" />
                        {bookedCount} of {trip.capacity} seats booked
                      </span>
                      <span className="font-semibold text-slate-700">{percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          trip.status === "CANCELLED"
                            ? "bg-slate-300"
                            : percentage >= 100
                            ? "bg-amber-500"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full md:w-auto items-center justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    href={`/admin/trips/${trip.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
                  >
                    <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Manage Trip</span>
                  </Link>

                  {bookedCount === 0 && (
                    <form action={deleteTrip.bind(null, trip.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100/80 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}