import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    hash: string;
    type: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        try {
          const res = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds),
          });

          const responseData = await res.json();

          if (!res.ok) {
            // Throw an error with the specific message from Flask
            throw new Error(responseData.message || "로그인에 실패했습니다.");
          }

          return responseData;
        } catch (error) {
          // Re-throw the error to be handled by the login action
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.hash = user.hash;
        token.type = user.type;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.hash = token.hash as string;
      session.user.type = token.type as string;
      return session;
    },
  },
} satisfies NextAuthConfig);
