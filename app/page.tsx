import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Calendar,
  Users,
  Car,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  const places = await prisma.place.findMany({
    take: 6,
    include: {
      photos: { take: 1 },
      _count: { select: { trips: true, photos: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-100/60 via-indigo-50/50 to-emerald-50/30 blur-3xl opacity-70 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-8 backdrop-blur-sm shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover Weekend Escapes & Shared Road Trips</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
            Explore extraordinary places,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              together.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s Visit connects adventure seekers with group journeys. Discover breathtaking destinations, share comfortable rides, and make memories on the road.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/places"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/35 transition active:scale-[0.98]"
            >
              Browse Destinations
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!session?.user && (
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-[0.98]"
              >
                Create Free Account
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin/trips/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                Schedule a Trip
              </Link>
            )}
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-100 pt-10">
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <p className="text-2xl font-bold text-slate-900">{places.length}+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Curated Spots</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Shared Journeys</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <p className="text-2xl font-bold text-slate-900">4-6 Seats</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Per Vehicle Fleet</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <p className="text-2xl font-bold text-emerald-600">Active</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Trips & Bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Explore The Outdoors
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">
                Featured Places to Visit
              </h2>
              <p className="text-slate-600 mt-2 text-sm max-w-xl">
                Browse hand-picked destinations ready for your next excursion.
              </p>
            </div>
            <Link
              href="/places"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
            >
              View all destinations
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          {places.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
              <MapPin className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-base font-semibold text-slate-900">No destinations yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Admins can add places from the admin dashboard.
              </p>
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin/places/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Add First Place
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="group flex flex-col rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    {place.photos[0] ? (
                      <Image
                        src={place.photos[0].url}
                        alt={place.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400">
                        <MapPin className="h-10 w-10 opacity-40" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {place._count.trips} {place._count.trips === 1 ? "trip" : "trips"}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{place.location}</span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {place.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 flex-1 leading-relaxed">
                      {place.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{place._count.photos} photos available</span>
                      <Link
                        href={`/places/${place.id}`}
                        className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Simple & Seamless
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              How Let&apos;s Visit Works
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Start your journey in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-5">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Discover Places</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Browse scenic destinations, view uploaded photos, and check upcoming trip itineraries.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-5">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Reserve Your Seat</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Car fleets and seating capacities are carefully calculated so everyone rides comfortably.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 mb-5">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Travel & Connect</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Meet your travel companions, chat with your group, and experience great memories together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Peace of Mind
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 leading-tight">
                Built specifically for friendly group adventures
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Forget the headache of juggling spreadsheets, guessing passenger counts, and coordinating drivers. Let&apos;s Visit handles capacity tracking, trip updates, and community chats seamlessly.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Automatic Capacity Guard</h4>
                    <p className="text-sm text-slate-500">
                      Calculates car seats dynamically and prevents overbooking when trips reach maximum limit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Curated & Verified Locations</h4>
                    <p className="text-sm text-slate-500">
                      High-resolution photos, local guidance, and authentic destination tips.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Seamless Administration</h4>
                    <p className="text-sm text-slate-500">
                      Easy control for organizers to schedule trips, manage travelers, and adjust capacities in seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  Community Highlights
                </span>
                <h3 className="mt-4 text-2xl font-bold">
                  &ldquo;Planning road trips with friends used to take hours. Now we just pick a place and go.&rdquo;
                </h3>
                <p className="mt-6 text-sm text-blue-100 font-medium">
                  — The Let&apos;s Visit Community
                </p>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-200" />
                    <span className="text-sm font-medium">Weekly group excursions</span>
                  </div>
                  <Link
                    href="/places"
                    className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-md hover:bg-slate-100 transition"
                  >
                    Explore Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}