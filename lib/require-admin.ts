import { redirect } from "next/navigation";
import { auth } from "@/auth";

// For server actions: throws if the caller is not an admin
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// For pages and layouts: redirects if the visitor is not an admin
export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");
  return session.user;
}