import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, todayUtc } from "@/lib/format";

export default async function MyTripsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      trip: {
        include: {
          place: { select: { name: true, location: true } },
          _count: { select: { bookings: true } },
        },
      },
    },
    orderBy: { trip: { date: "asc" } },
  });

  const today = todayUtc();
  const upcoming = bookings.filter((b) => b.trip.date >= today);
  const past = bookings.filter((b) => b.trip.date < today);

  function TripRow({ b, muted = false }: { b: (typeof bookings)[number]; muted?: boolean }) {
    return (
      <li
        className={`flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs ${
          muted ? "opacity-60" : ""
        }`}
      >
        <div>
          <p className="font-semibold">{b.trip.place.name}</p>
          <p className="text-sm text-slate-600">
            {formatDate(b.trip.date)} · {b.trip._count.bookings}/{b.trip.capacity} travelers
            {b.trip.status === "CANCELLED" && " · CANCELLED"}
          </p>
        </div>
        <Link
          href={`/trips/${b.trip.id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Open →
        </Link>
      </li>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My trips</h1>

      <h2 className="mb-3 text-lg font-semibold">Upcoming</h2>
      {upcoming.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
          You haven&apos;t joined any trip yet.{" "}
          <Link href="/places" className="font-medium text-blue-600 underline">
            Browse places
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((b) => (
            <TripRow key={b.id} b={b} />
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 mt-10 text-lg font-semibold">Past</h2>
          <ul className="space-y-3">
            {past.map((b) => (
              <TripRow key={b.id} b={b} muted />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}