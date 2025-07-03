import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Extend the User type to include 'hash' and 'type'
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    hash: string;
    type: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        id: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const res = await fetch("http://127.0.0.1:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(creds),
        });

        const user = await res.json();
        return res.ok && user ? user : null;
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
