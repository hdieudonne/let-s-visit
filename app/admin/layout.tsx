import Link from "next/link";
import { LayoutDashboard, MapPin, Calendar, Users, ExternalLink, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";

const linkClass =
  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div>
      {/* Admin sub-menu, sticks below the main navbar (h-16) */}
      <div className="sticky top-16 z-30 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm font-medium sm:px-6 lg:px-8">
          <span className="mr-3 inline-flex shrink-0 items-center gap-1 rounded-md border border-blue-200/80 bg-blue-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>

          <Link href="/admin" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/admin/places" className={linkClass}>
            <MapPin className="h-4 w-4" />
            Places
          </Link>
          <Link href="/admin/trips" className={linkClass}>
            <Calendar className="h-4 w-4" />
            Trips
          </Link>
          <Link href="/admin/users" className={linkClass}>
            <Users className="h-4 w-4" />
            Users
          </Link>

          <Link
            href="/places"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}