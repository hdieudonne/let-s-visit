import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-6 border-b p-4">
        <span className="font-bold">Admin</span>
        <Link href="/admin/places" className="underline">Places</Link>
        <Link href="/places" className="underline">View site</Link>
      </nav>
      <div className="mx-auto max-w-3xl p-4">{children}</div>
    </div>
  );
}