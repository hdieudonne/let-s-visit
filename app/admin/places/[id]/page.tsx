import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addPhotos, deletePhoto, updatePlace } from "../actions";
import { 
  ArrowLeft, 
  MapPin, 
  Trash2, 
  UploadCloud, 
  Save, 
  ImageIcon, 
  Sparkles 
} from "lucide-react";

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/places"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Places</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Edit {place.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update location details, descriptions, and manage destination photos
            </p>
          </div>
          <Link
            href="/places"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            Preview on site
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Place Details Form */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            General Information
          </h2>

          <form action={updatePlace.bind(null, place.id)} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Destination Name
              </label>
              <input
                name="name"
                defaultValue={place.name}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Location
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  name="location"
                  defaultValue={place.location}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Description & Highlights
              </label>
              <textarea
                name="description"
                defaultValue={place.description}
                required
                rows={5}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Photo Gallery Section */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Photo Gallery
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {place.photos.length} uploaded {place.photos.length === 1 ? "photo" : "photos"}
              </p>
            </div>
          </div>

          {place.photos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 mb-6">
              No photos currently uploaded for this destination.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {place.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative h-40 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-2xs"
                >
                  <Image
                    src={photo.url}
                    alt={place.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="250px"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <form action={deletePhoto.bind(null, photo.id, place.id)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload More Photos Form */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3">
              Upload Additional Photos
            </h3>
            <form action={addPhotos.bind(null, place.id)} className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  className="block w-full max-w-sm mx-auto text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                >
                  <UploadCloud className="h-4 w-4 text-blue-600" />
                  Upload Photos
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}