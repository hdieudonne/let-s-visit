"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { uploadImage } from "@/lib/cloudinary";

const placeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
});

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per photo

export type PlaceState = { error?: string };

function getPhotoFiles(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

function checkPhotos(files: File[]): string | null {
  for (const f of files) {
    if (!f.type.startsWith("image/")) return `${f.name} is not an image`;
    if (f.size > MAX_SIZE) return `${f.name} is larger than 5 MB`;
  }
  return null;
}

export async function createPlace(
  _prev: PlaceState,
  formData: FormData
): Promise<PlaceState> {
  await requireAdmin();

  const parsed = placeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    location: formData.get("location"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const files = getPhotoFiles(formData);
  const photoError = checkPhotos(files);
  if (photoError) return { error: photoError };

  const urls = await Promise.all(files.map(uploadImage));

  await prisma.place.create({
    data: { ...parsed.data, photos: { create: urls.map((url) => ({ url })) } },
  });

  revalidatePath("/admin/places");
  redirect("/admin/places");
}

export async function updatePlace(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = placeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    location: formData.get("location"),
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  await prisma.place.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/places");
  revalidatePath(`/admin/places/${id}`);
}

export async function addPhotos(id: string, formData: FormData) {
  await requireAdmin();

  const files = getPhotoFiles(formData);
  const photoError = checkPhotos(files);
  if (photoError) throw new Error(photoError);
  if (files.length === 0) return;

  const urls = await Promise.all(files.map(uploadImage));
  await prisma.placePhoto.createMany({
    data: urls.map((url) => ({ url, placeId: id })),
  });
  revalidatePath(`/admin/places/${id}`);
}

export async function deletePhoto(photoId: string, placeId: string) {
  await requireAdmin();
  await prisma.placePhoto.delete({ where: { id: photoId } });
  revalidatePath(`/admin/places/${placeId}`);
}

export async function deletePlace(id: string) {
  await requireAdmin();

  const tripCount = await prisma.trip.count({ where: { placeId: id } });
  if (tripCount > 0) {
    throw new Error("This place has trips. Delete or cancel them first.");
  }

  await prisma.place.delete({ where: { id } });
  revalidatePath("/admin/places");
}