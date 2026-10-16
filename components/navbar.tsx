import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";
import { auth, signOut } from "@/auth";

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-[#52646B] transition hover:bg-[#D8CDD2]/50 hover:text-[#223843]";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D8CDD2] bg-[#EFF1F3]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#223843] text-white shadow-xs">
            <Compass className="h-5 w-5 text-[#D8B4A0]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#223843]">
            Let&apos;s Visit
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-sm font-medium">
          <Link href="/places" className={linkClass}>
            Destinations
          </Link>
          {user && (
            <Link href="/my-trips" className={linkClass}>
              My trips
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-[#D8CDD2] bg-white px-3 py-1.5 text-xs font-semibold text-[#D97760] shadow-2xs hover:bg-[#D8B4A0]/20 transition"
            >
              <ShieldCheck className="h-4 w-4 text-[#D97760]" />
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center ml-2">
              <span className="hidden items-center gap-1.5 text-sm font-medium text-[#223843] md:inline-flex px-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#D97760]" />
                {user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button className="ml-1 rounded-lg border border-[#D8CDD2] bg-white px-3 py-1.5 text-xs font-semibold text-[#223843] shadow-2xs transition hover:bg-[#EFF1F3] cursor-pointer">
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                href="/register"
                className="ml-1 rounded-lg bg-[#D97760] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#C96A54]"
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