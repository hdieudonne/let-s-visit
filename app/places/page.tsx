import Image from "next/image";
import Link from "next/link";
import { MapPin, Plus, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, todayUtc } from "@/lib/format";

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const places = await prisma.place.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      photos: { take: 1, orderBy: { id: "asc" } },
      trips: {
        where: { date: { gte: todayUtc() }, status: { not: "CANCELLED" } },
        orderBy: { date: "asc" },
        select: { date: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-[#D8CDD2] pb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#D97760] mb-1.5">
            Destinations Catalog
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#223843] sm:text-4xl">
            Places to visit
          </h1>
          <p className="mt-1.5 text-sm text-[#52646B]">
            Pick a scenic location, explore photos, and reserve your seat for upcoming trips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8CDD2] bg-white px-3.5 py-2 text-xs font-semibold text-[#D97760] shadow-2xs hover:bg-[#D8B4A0]/20 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Dashboard
              </Link>
              <Link
                href="/admin/places/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#D97760] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#C96A54] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Place
              </Link>
            </div>
          )}
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or location"
              className="w-60 sm:w-64 rounded-lg border border-[#D8CDD2] bg-white px-3.5 py-2 text-sm text-[#223843] placeholder:text-[#52646B]/60 focus:border-[#223843] focus:outline-hidden focus:ring-3 focus:ring-[#223843]/10 transition"
            />
            <button className="rounded-lg bg-[#223843] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#344F5B] transition cursor-pointer">
              Search
            </button>
          </form>
        </div>
      </div>

      {places.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#D8CDD2] bg-white/70 p-12 text-center">
          <MapPin className="mx-auto h-10 w-10 text-[#D8B4A0] mb-3" />
          <h3 className="text-base font-bold text-[#223843]">No places found</h3>
          <p className="mt-1 text-sm text-[#52646B]">
            Try adjusting your search terms or check back later for new additions.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => {
          const next = place.trips[0];
          return (
            <div
              key={place.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#D8CDD2] bg-white shadow-xs transition hover:border-[#D8B4A0] hover:shadow-sm"
            >
              <Link href={`/places/${place.id}`}>
                <div className="relative h-52 overflow-hidden bg-[#EFF1F3]">
                  {place.photos[0] ? (
                    <Image
                      src={place.photos[0].url}
                      alt={place.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#D8CDD2]/30 text-[#52646B]">
                      <MapPin className="h-10 w-10 text-[#223843]/30" />
                    </div>
                  )}
                  {place.trips.length > 0 && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-[#223843]/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                      {place.trips.length} {place.trips.length === 1 ? "trip" : "trips"}
                    </span>
                  )}
                </div>

                <div className="space-y-2 p-5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#D97760]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{place.location}</span>
                  </p>
                  <h2 className="text-lg font-bold text-[#223843] transition group-hover:text-[#D97760]">
                    {place.name}
                  </h2>
                  <p className="line-clamp-2 text-xs text-[#52646B] leading-relaxed">
                    {place.description}
                  </p>
                  {next ? (
                    <p className="pt-2 text-xs font-semibold text-[#D97760]">
                      Next departure: {formatDate(next.date)}
                    </p>
                  ) : (
                    <p className="pt-2 text-xs text-[#52646B]/70">No dates available yet</p>
                  )}
                </div>
              </Link>

              {isAdmin && (
                <div className="border-t border-[#D8CDD2]/60 bg-[#EFF1F3]/60 px-5 py-2.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#52646B]">Admin controls</span>
                  <Link
                    href={`/admin/places/${place.id}`}
                    className="text-[#D97760] hover:underline"
                  >
                    Edit destination →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}