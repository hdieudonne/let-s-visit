"use client";

import Image from "next/image";
import { useState } from "react";

export default function PhotoGallery({
  photos,
  alt,
}: {
  photos: { id: string; url: string }[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
        No photos yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-72 overflow-hidden rounded-2xl bg-slate-200 sm:h-96">
        <Image
          src={photos[active].url}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 900px, 100vw"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active
                  ? "border-blue-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={p.url} alt={alt} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}