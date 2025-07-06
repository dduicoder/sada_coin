import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

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
        // throw new Error("foobar");
        try {
          const res = await axios.post(
            `${process.env.BACKEND_URL}/login` || "",
            creds
          );

          if (res.data) {
            return res.data;
          }
        } catch (error) {
          // Re-throw the error to be handled by the login action
          throw new Error("error.response.data.message");

          // throw new Error("error.response.data.message");
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
