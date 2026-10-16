"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { todayUtc } from "@/lib/format";

export type TripResult = { error?: string };

class BookingError extends Error {}

export async function joinTrip(tripId: string): Promise<TripResult> {
  const session = await auth();
  if (!session?.user) return { error: "Please log in to join a trip" };
  const userId = session.user.id;

  let placeId = "";
  try {
    await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { status: true },
        });
        if (!user || user.status !== "ACTIVE") {
          throw new BookingError("Your account cannot book trips");
        }

        const trip = await tx.trip.findUnique({
          where: { id: tripId },
          include: { _count: { select: { bookings: true } } },
        });
        if (!trip || trip.status === "CANCELLED") {
          throw new BookingError("This trip is not available");
        }
        if (trip.date < todayUtc()) throw new BookingError("This date has passed");
        if (trip._count.bookings >= trip.capacity) {
          throw new BookingError("This trip is full");
        }

        const clash = await tx.booking.findFirst({
          where: { userId, trip: { date: trip.date, status: { not: "CANCELLED" } } },
        });
        if (clash) {
          throw new BookingError(
            clash.tripId === tripId
              ? "You already joined this trip"
              : "You already have another trip on this date"
          );
        }

        await tx.booking.create({ data: { userId, tripId } });
        if (trip._count.bookings + 1 >= trip.capacity) {
          await tx.trip.update({ where: { id: tripId }, data: { status: "FULL" } });
        }
        placeId = trip.placeId;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (e) {
    if (e instanceof BookingError) return { error: e.message };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2034") {
        return { error: "Many people are booking right now. Please try again." };
      }
      if (e.code === "P2002") return { error: "You already joined this trip" };
    }
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/places/${placeId}`);
  revalidatePath("/my-trips");
  revalidatePath(`/trips/${tripId}`);
  return {};
}

export async function leaveTrip(tripId: string): Promise<TripResult> {
  const session = await auth();
  if (!session?.user) return { error: "Please log in" };
  const userId = session.user.id;

  const booking = await prisma.booking.findUnique({
    where: { userId_tripId: { userId, tripId } },
    include: { trip: true },
  });
  if (!booking) return { error: "You have not joined this trip" };
  if (booking.trip.date < todayUtc()) return { error: "This trip has already happened" };

  await prisma.$transaction([
    prisma.booking.delete({ where: { id: booking.id } }),
    prisma.trip.updateMany({
      where: { id: tripId, status: "FULL" },
      data: { status: "OPEN" },
    }),
  ]);

  revalidatePath(`/places/${booking.trip.placeId}`);
  revalidatePath("/my-trips");
  revalidatePath(`/trips/${tripId}`);
  return {};
}