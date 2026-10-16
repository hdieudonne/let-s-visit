import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import UserActions from "./user-actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { _count: { select: { bookings: true, messages: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.user.count();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-slate-600">
            {total} registered {total === 1 ? "user" : "users"}
            {q && ` · ${users.length} matching "${q}"`}
          </p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email"
            className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {u._count.bookings} {u._count.bookings === 1 ? "booking" : "bookings"}
                    <br />
                    {u._count.messages} {u._count.messages === 1 ? "message" : "messages"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserActions
                      userId={u.id}
                      name={u.name}
                      role={u.role}
                      status={u.status}
                      isSelf={u.id === session?.user?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}