"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ChatMessage = {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
};

export type ChatResult = { error?: string };

// Returns who the current user is for this trip, or null if they have no access.
async function getAccess(tripId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const { id: userId, role } = session.user;
  if (role === "ADMIN") return { userId, isAdmin: true, isMember: false };

  const booking = await prisma.booking.findUnique({
    where: { userId_tripId: { userId, tripId } },
    select: { id: true },
  });
  if (!booking) return null;

  return { userId, isAdmin: false, isMember: true };
}

export async function fetchMessages(tripId: string): Promise<ChatMessage[]> {
  const access = await getAccess(tripId);
  if (!access) return [];

  const rows = await prisma.message.findMany({
    where: { tripId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true } } },
  });

  return rows.reverse().map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    userId: m.userId,
    userName: m.user.name,
  }));
}

export async function sendMessage(
  tripId: string,
  rawText: string
): Promise<ChatResult> {
  const access = await getAccess(tripId);
  if (!access?.isMember) return { error: "Only travelers on this trip can chat" };

  const text = rawText.trim();
  if (!text) return { error: "Write a message first" };
  if (text.length > 1000) return { error: "Message is too long (max 1000 characters)" };

  const [user, trip] = await Promise.all([
    prisma.user.findUnique({ where: { id: access.userId }, select: { status: true } }),
    prisma.trip.findUnique({ where: { id: tripId }, select: { status: true } }),
  ]);
  if (!user || user.status !== "ACTIVE") return { error: "Your account cannot send messages" };
  if (!trip || trip.status === "CANCELLED") return { error: "This trip is cancelled" };

  await prisma.message.create({
    data: { tripId, userId: access.userId, text },
  });
  return {};
}

export async function deleteMessage(messageId: string): Promise<ChatResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.message.deleteMany({ where: { id: messageId } });
  return {};
}