import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addPhotos, deletePhoto, updatePlace } from "../actions";

export default async function EditPlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = await prisma.place.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!place) notFound();

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-6 text-2xl font-bold">Edit place</h1>
        <form action={updatePlace.bind(null, place.id)} className="space-y-4">
          <input name="name" defaultValue={place.name} required
            className="w-full rounded border p-2" />
          <input name="location" defaultValue={place.location} required
            className="w-full rounded border p-2" />
          <textarea name="description" defaultValue={place.description} required
            rows={6} className="w-full rounded border p-2" />
          <button className="rounded bg-black px-4 py-2 text-white">Save changes</button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Photos</h2>
        {place.photos.length === 0 && <p className="mb-4">No photos yet.</p>}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {place.photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="relative h-32 w-full overflow-hidden rounded">
                <Image src={photo.url} alt={place.name} fill className="object-cover" sizes="200px" />
              </div>
              <form action={deletePhoto.bind(null, photo.id, place.id)}>
                <button className="text-sm text-red-600 underline">Remove</button>
              </form>
            </div>
          ))}
        </div>

        <form action={addPhotos.bind(null, place.id)} className="space-y-3">
          <input name="photos" type="file" accept="image/*" multiple required />
          <button className="block rounded border px-4 py-2">Upload photos</button>
        </form>
      </section>
    </div>
  );
}