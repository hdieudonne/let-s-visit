import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { cancelTrip } from "../actions";
import CapacityForm from "./capacity-form";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  SlidersHorizontal 
} from "lucide-react";

export default async function ManageTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      place: { select: { name: true, location: true } },
      bookings: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!trip) notFound();

  const bookedCount = trip.bookings.length;
  const spotsLeft = Math.max(0, trip.capacity - bookedCount);

  let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (trip.status === "FULL") {
    statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (trip.status === "CANCELLED") {
    statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button & header */}
      <div>
        <Link
          href="/admin/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Trips</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {trip.place.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border uppercase tracking-wider ${statusBadge}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                {trip.status}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{trip.place.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Capacity
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{trip.capacity}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Maximum seats</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Booked Travelers
          </p>
          <p className="mt-1 text-2xl font-extrabold text-blue-600">{bookedCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Confirmed reservations</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Spots
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600">{spotsLeft}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Open for booking</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Trip Date
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900 leading-tight pt-1">
            {formatDate(trip.date)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled departure</p>
        </div>
      </div>

      {/* Capacity Adjustment */}
      {trip.status !== "CANCELLED" && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            Passenger Capacity Control
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Modify the total headcount limit for this scheduled trip
          </p>

          <CapacityForm tripId={trip.id} capacity={trip.capacity} />
        </div>
      )}

      {/* Travelers Roster */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Confirmed Passenger Roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {trip.bookings.length} {trip.bookings.length === 1 ? "person" : "people"} booked
            </p>
          </div>
        </div>

        {trip.bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No travelers have joined yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Registered users can reserve open seats once public bookings are active.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {trip.bookings.map((booking, index) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600 border border-blue-100">
                    {booking.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {booking.user.name}
                    </p>
                    <p className="text-xs text-slate-500">{booking.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Booked {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Trip Cancellation */}
      {trip.status !== "CANCELLED" && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Cancel Trip
              </h3>
              <p className="mt-1 text-xs text-rose-700/80 max-w-lg">
                Marking this trip as cancelled will close further bookings and notify travelers. This action cannot be automatically undone.
              </p>
            </div>

            <form action={cancelTrip.bind(null, trip.id)}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-600 shadow-2xs hover:bg-rose-50 hover:border-rose-400 transition cursor-pointer"
              >
                Cancel This Trip
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}