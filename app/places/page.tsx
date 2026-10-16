import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, todayUtc } from "@/lib/format";

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Places to visit</h1>
          <p className="text-slate-600">Pick a place, then choose a date to join.</p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or location"
            className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {places.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No places found.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((place) => {
          const next = place.trips[0];
          return (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-slate-200">
                {place.photos[0] ? (
                  <Image
                    src={place.photos[0].url}
                    alt={place.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <MapPin className="h-10 w-10 opacity-40" />
                  </div>
                )}
              </div>
              <div className="space-y-2 p-5">
                <h2 className="text-lg font-bold transition group-hover:text-blue-600">
                  {place.name}
                </h2>
                <p className="flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {place.location}
                </p>
                {next ? (
                  <p className="text-sm font-medium text-blue-600">
                    {place.trips.length} upcoming{" "}
                    {place.trips.length === 1 ? "date" : "dates"} · next {formatDate(next.date)}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">No dates available yet</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}