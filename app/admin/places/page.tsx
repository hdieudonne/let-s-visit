import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePlace } from "./actions";

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: { _count: { select: { photos: true, trips: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Places</h1>
        <Link href="/admin/places/new" className="rounded bg-black px-4 py-2 text-white">
          Add place
        </Link>
      </div>

      {places.length === 0 && <p>No places yet.</p>}

      <ul className="space-y-3">
        {places.map((place) => (
          <li key={place.id} className="flex items-center justify-between rounded border p-4">
            <div>
              <p className="font-semibold">{place.name}</p>
              <p className="text-sm text-gray-600">
                {place.location} · {place._count.photos} photos · {place._count.trips} trips
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/places/${place.id}`} className="underline">Edit</Link>
              <form action={deletePlace.bind(null, place.id)}>
                <button className="text-red-600 underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}