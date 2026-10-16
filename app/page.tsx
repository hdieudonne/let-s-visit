import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import {
  MapPin,
  Calendar,
  Users,
  Car,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  const places = await prisma.place.findMany({
    take: 6,
    include: {
      photos: { take: 1 },
      _count: {
        select: {
          trips: true,
          photos: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main className="bg-[#EFF1F3] text-[#223843]">
      {/* Hero section */}
      <section className="border-b border-[#D8CDD2] bg-[#EFF1F3]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D97760]">
                <span className="h-2 w-2 rounded-full bg-[#D97760]" />
                Weekend trips, shared with others
              </p>

              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Good places are better when{" "}
                <span className="text-[#D97760]">shared.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#52646B] sm:text-lg">
                Find places worth visiting, plan your next trip, and share
                the journey with people who enjoy exploring just as much
                as you do.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/places"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#223843] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#344F5B]"
                >
                  Explore destinations
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {!session?.user && (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-lg border border-[#223843]/25 bg-transparent px-6 py-3.5 text-sm font-semibold text-[#223843] transition-colors hover:bg-white"
                  >
                    Join Let&apos;s Visit
                  </Link>
                )}

                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#223843]/25 px-6 py-3.5 text-sm font-semibold text-[#223843] transition-colors hover:bg-white"
                  >
                    Admin dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#D8CDD2] pt-6">
                <div>
                  <p className="text-2xl font-bold">
                    {places.length.toString().padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm text-[#52646B]">
                    Featured destinations
                  </p>
                </div>

                <div className="border-l border-[#D8CDD2] pl-8">
                  <p className="text-2xl font-bold">Together</p>
                  <p className="mt-1 text-sm text-[#52646B]">
                    Better travel experiences
                  </p>
                </div>
              </div>
            </div>

            {/* Simple visual panel using the same palette */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-[#D8CDD2] p-3 sm:p-4">
                {places[0]?.photos[0] ? (
                  <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[420px]">
                    <Image
                      src={places[0].photos[0].url}
                      alt={places[0].name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#223843]/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#D8B4A0]">
                        A place to start
                      </p>

                      <h2 className="text-2xl font-bold sm:text-3xl">
                        {places[0].name}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                        <MapPin className="h-4 w-4" />
                        {places[0].location}
                      </p>

                      <Link
                        href={`/places/${places[0].id}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#D8B4A0]"
                      >
                        View destination
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] flex-col justify-between rounded-xl bg-[#223843] p-7 text-white sm:h-[420px] sm:p-9">
                    <div>
                      <MapPin className="h-8 w-8 text-[#D97760]" />
                      <p className="mt-6 text-sm text-[#D8B4A0]">
                        Your next adventure
                      </p>
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                        There&apos;s always somewhere new to go.
                      </h2>
                      <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                        Browse destinations and find inspiration for your
                        next trip.
                      </p>

                      <Link
                        href="/places"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D8B4A0] hover:text-white"
                      >
                        Discover places
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -left-2 -z-0 h-20 w-24 rounded-2xl bg-[#D97760] sm:-left-4 sm:h-24 sm:w-28" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#D97760]">
                Find your next stop
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Places worth visiting
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#52646B] sm:text-base">
                Take a look at some of the destinations you can explore
                with Let&apos;s Visit.
              </p>
            </div>

            <Link
              href="/places"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#223843] transition-colors hover:text-[#D97760]"
            >
              See all destinations
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {places.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D8CDD2] bg-[#EFF1F3] px-6 py-16 text-center">
              <MapPin className="mx-auto h-10 w-10 text-[#D97760]" />

              <h3 className="mt-4 text-lg font-semibold">
                No destinations yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#52646B]">
                New places will appear here when they are added.
              </p>

              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin/places/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#223843] px-5 py-3 text-sm font-semibold text-white hover:bg-[#344F5B]"
                >
                  Add a destination
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <article
                  key={place.id}
                  className="group overflow-hidden rounded-xl border border-[#D8CDD2]/80 bg-white transition-colors duration-200 hover:border-[#D8B4A0]"
                >
                  <Link
                    href={`/places/${place.id}`}
                    className="block"
                    aria-label={`View ${place.name}`}
                  >
                    <div className="relative h-56 overflow-hidden bg-[#EFF1F3]">
                      {place.photos[0] ? (
                        <Image
                          src={place.photos[0].url}
                          alt={place.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#D8CDD2]/50">
                          <MapPin className="h-10 w-10 text-[#223843]/40" />
                        </div>
                      )}

                      <span className="absolute bottom-3 left-3 rounded-md bg-[#223843]/90 px-3 py-1.5 text-xs font-medium text-white">
                        {place._count.trips}{" "}
                        {place._count.trips === 1 ? "trip" : "trips"}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="flex items-center gap-2 text-xs font-medium text-[#D97760]">
                        <MapPin className="h-3.5 w-3.5" />
                        {place.location}
                      </p>

                      <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#223843]">
                        {place.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#52646B]">
                        {place.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-[#D8CDD2]/70 pt-4">
                        <span className="text-xs text-[#52646B]">
                          {place._count.photos}{" "}
                          {place._count.photos === 1 ? "photo" : "photos"}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#223843] transition-colors group-hover:text-[#D97760]">
                          Explore
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[#D8CDD2] bg-[#EFF1F3] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#D97760]">
              Getting started
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your next trip starts here
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#52646B] sm:text-base">
              A straightforward way to discover places and plan a journey.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-[#D8CDD2] bg-white p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D8CDD2]/60 text-[#223843]">
                <MapPin className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold text-[#D97760]">
                01
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Choose a destination
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#52646B]">
                Browse available places, look through photos, and find
                somewhere you would like to visit.
              </p>
            </div>

            <div className="rounded-xl border border-[#D8CDD2] bg-white p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D8B4A0]/50 text-[#223843]">
                <Car className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold text-[#D97760]">
                02
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Plan your journey
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#52646B]">
                Check trip details and available seats before making
                arrangements for your journey.
              </p>
            </div>

            <div className="rounded-xl border border-[#D8CDD2] bg-white p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D97760]/15 text-[#D97760]">
                <Users className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold text-[#D97760]">
                03
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Enjoy the experience
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#52646B]">
                Join a shared journey, meet other travelers, and enjoy
                discovering somewhere new.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="bg-[#223843] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#D8B4A0]">
              Make time to explore
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Somewhere new is waiting.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Find a destination, check the available trips, and start
              planning your next getaway.
            </p>
          </div>

          <Link
            href="/places"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-[#D97760] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#C96A54]"
          >
            Browse places
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-5">
          <div className="flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>Let&apos;s Visit</p>
            <p>Find places. Share journeys. Make memories.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
