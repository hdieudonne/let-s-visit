import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";
import { auth, signOut } from "@/auth";

const linkClass =
  "rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Let&apos;s Visit
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link href="/places" className={linkClass}>Destinations</Link>
          {user && <Link href="/my-trips" className={linkClass}>My trips</Link>}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/places"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-blue-600 hover:bg-blue-50"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}

          {user ? (
            <>
              <span className="ml-3 hidden items-center gap-1.5 text-slate-700 md:inline-flex">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:bg-slate-100">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>Log in</Link>
              <Link
                href="/register"
                className="ml-1 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}