"use server";

import { signIn } from "@/auth";

export async function login(formData: any) {
  try {
    await signIn("credentials", {
      id: formData.id,
      password: formData.password,
      redirect: false,
    });
    return { success: true, message: "login successful" };
  } catch (err: any) {
    if (err.type === "AuthError") {
      return {
        error: { message: err.message },
      };
    }
    return { error: { message: "Failed to login", error: err } };
  }
}
