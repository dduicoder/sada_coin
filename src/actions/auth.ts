"use server";

import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth-utils";

export const login = async (data: { id: string; password: string }) => {
  try {
    const result = await signIn("credentials", {
      id: data.id,
      password: await hashPassword(data.password),
      redirect: false,
    });

    console.log(result);

    // If there's an error, it means authentication failed
    if (result?.error) {
      return {
        error: { message: result.error || "로그인에 실패했습니다." },
      };
    }

    // If successful, return success (no error)
    return { success: true };
  } catch (error) {
    // This will catch errors thrown from the authorize function
    return {
      error: {
        message:
          error instanceof Error ? error.message : "로그인에 실패했습니다.",
      },
    };
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
