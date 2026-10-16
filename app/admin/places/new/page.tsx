"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPlace, type PlaceState } from "../actions";
import { 
  ArrowLeft, 
  MapPin, 
  UploadCloud, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  FileText
} from "lucide-react";

export default function NewPlacePage() {
  const [state, action, pending] = useActionState<PlaceState, FormData>(
    createPlace,
    {}
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button & title */}
      <div>
        <Link
          href="/admin/places"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Places</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Add New Destination
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Provide information and scenic imagery for travelers to explore
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <form action={action} className="space-y-6">
          {state.error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{state.error}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Destination Name
            </label>
            <input
              name="name"
              placeholder="e.g. Mount Rainier Vista Point"
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
                placeholder="e.g. Ashford, Washington"
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
              placeholder="Describe the trail, scenic viewpoints, recommended gear, and best time of day to visit..."
              required
              rows={5}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-600/10 transition"
            />
          </div>

          {/* Photo Upload Zone */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Destination Photos
            </label>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center hover:border-blue-400 transition">
              <UploadCloud className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Upload image files
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG, or WebP (max 5 MB each, multiple supported)
              </p>
              <div className="mt-4 flex justify-center">
                <input
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full max-w-xs text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/admin/places"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Destination...</span>
                </>
              ) : (
                <span>Save Place</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}