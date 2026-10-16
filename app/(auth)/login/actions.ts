"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string };

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";
  const password = formData.get("password");
  const rawCallbackUrl = formData.get("callbackUrl");

  let redirectTo = "/places";

  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (user?.role === "ADMIN") {
      redirectTo = "/admin";
    }

    if (
      typeof rawCallbackUrl === "string" &&
      rawCallbackUrl.startsWith("/") &&
      !rawCallbackUrl.startsWith("//")
    ) {
      if (rawCallbackUrl.startsWith("/admin")) {
        if (user?.role === "ADMIN") {
          redirectTo = rawCallbackUrl;
        }
      } else if (user?.role !== "ADMIN") {
        redirectTo = rawCallbackUrl;
      } else {
        // If an admin had a callbackUrl that is not /places (e.g. /trips/xxx), honor it; otherwise go to /admin
        if (rawCallbackUrl !== "/places" && rawCallbackUrl !== "/") {
          redirectTo = rawCallbackUrl;
        }
      }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password, or account suspended" };
    }
    throw error; // lets the redirect work
  }
  return {};
}