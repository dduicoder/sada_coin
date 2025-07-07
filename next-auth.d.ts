import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      hash: string;
      type: string;
    };
    expires: string;
  }
}
