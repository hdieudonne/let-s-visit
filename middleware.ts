import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/admin")) {
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
    if (user.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/trips") && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/trips/:path*"],
};