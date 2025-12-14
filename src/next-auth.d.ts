// src/types/next-auth.d.ts or in the root directory
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // id can be string or undefined
      name?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
    };
    accessToken?: string;
  }
}
