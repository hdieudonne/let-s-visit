import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, todayUtc } from "@/lib/format";
import PhotoGallery from "@/components/photo-gallery";
import JoinButton from "@/components/join-button";

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  const place = await prisma.place.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { id: "asc" } },
      trips: {
        where: { date: { gte: todayUtc() }, status: { not: "CANCELLED" } },
        orderBy: { date: "asc" },
        include: {
          bookings: {
            orderBy: { createdAt: "asc" },
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });
  if (!place) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link href="/places" className="text-sm text-slate-500 hover:text-blue-600">
          ← All places
        </Link>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/places/${place.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              Edit in Admin
            </Link>
            <Link
              href="/admin/trips/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition"
            >
              + Schedule Trip
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <PhotoGallery photos={place.photos} alt={place.name} />
          <div>
            <h1 className="text-3xl font-bold">{place.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-slate-600">
              <MapPin className="h-4 w-4 text-blue-600" />
              {place.location}
            </p>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
              {place.description}
            </p>
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Available dates</h2>

          {place.trips.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
              No dates available yet. Check back soon.
            </p>
          )}

          {place.trips.map((trip) => {
            const booked = trip.bookings.length;
            const left = trip.capacity - booked;
            const full = left <= 0;
            const joined = !!userId && trip.bookings.some((b) => b.userId === userId);
            const percent = Math.min(100, Math.round((booked / trip.capacity) * 100));

            return (
              <div
                key={trip.id}
                className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold">{formatDate(trip.date)}</p>
                    <p className={`text-sm ${full ? "text-red-600" : "text-slate-600"}`}>
                      {full ? "Fully booked" : `${left} of ${trip.capacity} seats left`}
                    </p>
                  </div>
                  {joined && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      You&apos;re in
                    </span>
                  )}
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${full ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {userId ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700">
                      Travelers ({booked})
                    </p>
                    {booked === 0 ? (
                      <p className="text-sm text-slate-500">Be the first to join.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {trip.bookings.map((b) => (
                          <span
                            key={b.id}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                          >
                            {b.user.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Log in to see who is going.</p>
                )}

                <div className="flex items-center gap-3">
                  {!userId ? (
                    <Link
                      href="/login"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Log in to join
                    </Link>
                  ) : joined ? (
                    <>
                      <JoinButton tripId={trip.id} joined />
                      <Link
                        href={`/trips/${trip.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Open trip →
                      </Link>
                    </>
                  ) : full ? (
                    <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
                      Full
                    </span>
                  ) : (
                    <JoinButton tripId={trip.id} joined={false} />
                  )}

                  {isAdmin && (
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="ml-auto text-xs font-semibold text-slate-500 hover:text-blue-600 hover:underline"
                    >
                      Manage in Admin →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}