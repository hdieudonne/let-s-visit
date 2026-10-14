"use client";

import { useActionState } from "react";
import { createPlace, type PlaceState } from "../actions";

export default function NewPlacePage() {
  const [state, action, pending] = useActionState<PlaceState, FormData>(createPlace, {});

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Add place</h1>
      <form action={action} className="space-y-4">
        <input name="name" placeholder="Place name" required
          className="w-full rounded border p-2" />
        <input name="location" placeholder="Location (district, city...)" required
          className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Description, what to see, what to bring..."
          required rows={6} className="w-full rounded border p-2" />
        <div>
          <label className="mb-1 block text-sm">Photos (max 5 MB each)</label>
          <input name="photos" type="file" accept="image/*" multiple />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {pending ? "Saving..." : "Save place"}
        </button>
      </form>
    </div>
  );
}