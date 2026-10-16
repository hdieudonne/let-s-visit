import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import TripChat from "@/components/trip-chat";
import JoinButton from "@/components/join-button";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      place: { include: { photos: { take: 1, orderBy: { id: "asc" } } } },
      bookings: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });
  if (!trip) notFound();

  const isMember = trip.bookings.some((b) => b.userId === userId);
  if (!isMember && !isAdmin) redirect(`/places/${trip.placeId}`);

  const rows = await prisma.message.findMany({
    where: { tripId: id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true } } },
  });
  const initial = rows.reverse().map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    userId: m.userId,
    userName: m.user.name,
  }));

  const cancelled = trip.status === "CANCELLED";
  const canSend = isMember && !cancelled;
  const closedReason = cancelled
    ? "This trip was cancelled, so the chat is closed."
    : !isMember
      ? "You are viewing this chat as an admin (read only)."
      : undefined;

  const photo = trip.place.photos[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/my-trips" className="text-sm text-slate-500 hover:text-blue-600">
        ← My trips
      </Link>

      {cancelled && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          This trip has been cancelled.
        </p>
      )}

      <div className="mt-4 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="relative h-44 bg-slate-200">
              {photo && (
                <Image
                  src={photo.url}
                  alt={trip.place.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                />
              )}
            </div>
            <div className="space-y-2 p-5">
              <h1 className="text-2xl font-bold">{trip.place.name}</h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                {trip.place.location}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-blue-600" />
                {formatDate(trip.date)}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-slate-600">
                <Users className="h-4 w-4 text-blue-600" />
                {trip.bookings.length}/{trip.capacity} travelers
              </p>
              <Link
                href={`/places/${trip.placeId}`}
                className="inline-block pt-1 text-sm font-medium text-blue-600 hover:underline"
              >
                View place details →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h2 className="mb-3 font-semibold">Travelers ({trip.bookings.length})</h2>
            <ul className="space-y-2">
              {trip.bookings.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {b.user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-700">
                    {b.user.name}
                    {b.userId === userId && (
                      <span className="ml-2 text-xs text-slate-400">(you)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {isMember && !cancelled && trip.date >= new Date(new Date().setUTCHours(0, 0, 0, 0)) && (
            <JoinButton tripId={trip.id} joined />
          )}
        </div>

        <div className="lg:col-span-3">
          <TripChat
            tripId={trip.id}
            currentUserId={userId}
            initial={initial}
            canSend={canSend}
            isAdmin={isAdmin}
            closedReason={closedReason}
          />
        </div>
      </div>
    </div>
  );
}