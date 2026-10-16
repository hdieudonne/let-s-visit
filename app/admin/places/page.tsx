import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deletePlace } from "./actions";
import { 
  MapPin, 
  Plus, 
  Image as ImageIcon, 
  Calendar, 
  Edit3, 
  Trash2, 
  Sparkles 
} from "lucide-react";

export default async function AdminPlacesPage() {
  const places = await prisma.place.findMany({
    include: {
      photos: { take: 1 },
      _count: { select: { photos: true, trips: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Destinations Directory
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Places
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, manage, and upload photography for road trip destinations
          </p>
        </div>

        <Link
          href="/admin/places/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Destination</span>
        </Link>
      </div>

      {/* Places List */}
      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <MapPin className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No places added yet</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
            Get started by adding your first scenic spot, trail, or city for future group trips.
          </p>
          <Link
            href="/admin/places/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add First Place
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {places.map((place) => {
            const thumbnail = place.photos[0]?.url;
            return (
              <div
                key={place.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Photo thumbnail */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={place.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-6 w-6 opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {place.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-blue-600" />
                        {place.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                        {place._count.photos} {place._count.photos === 1 ? "photo" : "photos"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {place._count.trips} {place._count.trips === 1 ? "trip" : "trips"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full sm:w-auto items-center justify-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    href={`/admin/places/${place.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit</span>
                  </Link>

                  <form action={deletePlace.bind(null, place.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100/80 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}