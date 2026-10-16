import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TripForm from "./trip-form";
import { ArrowLeft, Calendar, MapPin, Plus } from "lucide-react";

export default async function NewTripPage() {
  const places = await prisma.place.findMany({
    select: { id: true, name: true, location: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Trips</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Schedule New Trip
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure departure date, select destination, and set carpool vehicle capacity
        </p>
      </div>

      {places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <MapPin className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900">No destinations available</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            You need to create at least one destination place before you can schedule a trip.
          </p>
          <Link
            href="/admin/places/new"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add a Destination First
          </Link>
        </div>
      ) : (
        <TripForm places={places} />
      )}
    </div>
  );
}