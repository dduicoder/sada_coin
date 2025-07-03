"use server";

import { signIn, signOut } from "@/auth";

export const login = async (id: string, password: string) => {
  await signIn("credentials", { id, password, redirectTo: "/user" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
