"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type UserActionResult = { error?: string };

export async function setUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<UserActionResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { error: "You cannot change your own account" };

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!target) return { error: "User not found" };

  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin/users");
  return {};
}

export async function setUserRole(
  userId: string,
  role: "USER" | "ADMIN"
): Promise<UserActionResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { error: "You cannot change your own role" };

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!target) return { error: "User not found" };

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return {};
}

export async function deleteUser(userId: string): Promise<UserActionResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { error: "You cannot delete your own account" };

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, bookings: { select: { tripId: true } } },
  });
  if (!target) return { error: "User not found" };
  if (target.role === "ADMIN") {
    return { error: "Remove this user's admin role before deleting the account" };
  }

  const tripIds = target.bookings.map((b) => b.tripId);

  await prisma.$transaction([
    prisma.message.deleteMany({ where: { userId } }),
    prisma.booking.deleteMany({ where: { userId } }),
    // Their seats are free again, so trips marked FULL can reopen
    prisma.trip.updateMany({
      where: { id: { in: tripIds }, status: "FULL" },
      data: { status: "OPEN" },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath("/admin/trips");
  revalidatePath("/places", "layout");
  return {};
}