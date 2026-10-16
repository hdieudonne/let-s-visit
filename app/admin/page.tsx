import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { formatDate } from "@/lib/format";
import {
  MapPin,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    placesCount,
    tripsCount,
    usersCount,
    bookingsCount,
    upcomingTrips,
    recentUsers,
  ] = await Promise.all([
    prisma.place.count(),
    prisma.trip.count(),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.trip.findMany({
      take: 5,
      orderBy: { date: "asc" },
      include: {
        place: { select: { name: true, location: true } },
        _count: { select: { bookings: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Administrative Control Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back. Monitor platform metrics, manage destinations, and oversee group trips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/places/new"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Place</span>
          </Link>
          <Link
            href="/admin/trips/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Trip</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/places"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Destinations
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{placesCount}</p>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              Curated locations
              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>

        <Link
          href="/admin/trips"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trips Scheduled
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{tripsCount}</p>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              Active itineraries
              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{bookingsCount}</p>
            <p className="mt-1 text-xs text-slate-500">Seat reservations confirmed</p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered Users
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900">{usersCount}</p>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              Community members
              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scheduled Trips Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Upcoming Trips</h2>
            </div>
            <Link
              href="/admin/trips"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all trips <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-900">No trips scheduled</p>
              <p className="text-xs text-slate-500 mt-1">Schedule your first group road trip date.</p>
              <Link
                href="/admin/trips/new"
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.map((trip) => {
                const booked = trip._count.bookings;
                const percentage = Math.min(100, Math.round((booked / (trip.capacity || 1)) * 100));

                return (
                  <div
                    key={trip.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {trip.place.name}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            trip.status === "FULL"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : trip.status === "CANCELLED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          {formatDate(trip.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {trip.place.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs font-medium text-slate-600">
                          {booked} / {trip.capacity} seats ({percentage}%)
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 mt-1">
                          <div
                            className={`h-full rounded-full ${
                              percentage >= 100 ? "bg-amber-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Registered Users */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Recent Users</h2>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-xs">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      user.role === "ADMIN"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Management Links */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Quick Admin Shortcuts
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs font-medium">
              <Link
                href="/admin/places"
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-200/60 text-slate-700 hover:text-blue-600 transition"
              >
                <span>Manage Destinations Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/trips"
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-200/60 text-slate-700 hover:text-blue-600 transition"
              >
                <span>Manage Trips & Capacity</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-200/60 text-slate-700 hover:text-blue-600 transition"
              >
                <span>Manage Registered Travelers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
