import Link from "next/link";
import { auth, signOut } from "@/auth";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  LogOut,
  Layers
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Let&apos;s Visit
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/80 uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/admin/places"
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
              >
                <MapPin className="h-4 w-4" />
                <span>Places</span>
              </Link>
              <Link
                href="/admin/trips"
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
              >
                <Calendar className="h-4 w-4" />
                <span>Trips</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            <Link
              href="/places"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            {session?.user && (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {session.user.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                    {session.user.name}
                  </span>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button
                    type="submit"
                    title="Log out"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition shadow-2xs cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-100 bg-white px-4 py-2 gap-4 text-xs font-semibold">
          <Link
            href="/admin/places"
            className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600"
          >
            <MapPin className="h-3.5 w-3.5" />
            Places
          </Link>
          <Link
            href="/admin/trips"
            className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600"
          >
            <Calendar className="h-3.5 w-3.5" />
            Trips
          </Link>
          <Link
            href="/places"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 ml-auto"
          >
            View site
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Main Admin Container */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}