"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type TripState = { error?: string; success?: string };

const createSchema = z.object({
  placeId: z.string().min(1, "Choose a place"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  cars: z.coerce.number().int().min(1, "At least 1 car").max(50),
  seatsPerCar: z.coerce.number().int().min(1, "At least 1 seat").max(60),
});

export async function createTrip(
  _prev: TripState,
  formData: FormData
): Promise<TripState> {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    placeId: formData.get("placeId"),
    date: formData.get("date"),
    cars: formData.get("cars"),
    seatsPerCar: formData.get("seatsPerCar"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const date = new Date(`${parsed.data.date}T00:00:00.000Z`);
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  if (date < todayUtc) return { error: "The date cannot be in the past" };

  try {
    await prisma.trip.create({
      data: {
        placeId: parsed.data.placeId,
        date,
        capacity: parsed.data.cars * parsed.data.seatsPerCar,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "This place already has a trip on that date" };
    }
    throw e;
  }

  revalidatePath("/admin/trips");
  redirect("/admin/trips");
}

export async function updateCapacity(
  id: string,
  _prev: TripState,
  formData: FormData
): Promise<TripState> {
  await requireAdmin();

  const parsed = z.coerce
    .number()
    .int()
    .min(1, "Capacity must be at least 1")
    .max(500)
    .safeParse(formData.get("capacity"));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!trip) return { error: "Trip not found" };
  if (trip.status === "CANCELLED") return { error: "This trip is cancelled" };

  const booked = trip._count.bookings;
  if (parsed.data < booked) {
    return { error: `${booked} people already booked. Capacity cannot be lower.` };
  }

  await prisma.trip.update({
    where: { id },
    data: {
      capacity: parsed.data,
      status: booked >= parsed.data ? "FULL" : "OPEN",
    },
  });

  revalidatePath("/admin/trips");
  revalidatePath(`/admin/trips/${id}`);
  return { success: "Capacity updated" };
}

export async function cancelTrip(id: string) {
  await requireAdmin();
  await prisma.trip.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/admin/trips");
  revalidatePath(`/admin/trips/${id}`);
}

export async function deleteTrip(id: string) {
  await requireAdmin();

  const bookings = await prisma.booking.count({ where: { tripId: id } });
  if (bookings > 0) {
    throw new Error("This trip has bookings. Cancel it instead of deleting.");
  }

  await prisma.message.deleteMany({ where: { tripId: id } });
  await prisma.trip.delete({ where: { id } });
  revalidatePath("/admin/trips");
}