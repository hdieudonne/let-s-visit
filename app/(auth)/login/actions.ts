"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string };

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/places",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password, or account suspended" };
    }
    throw error; // lets the redirect work
  }
  return {};
}