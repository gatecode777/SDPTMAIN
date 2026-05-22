import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "p8yv8w8yv8yv8yv8yv8yv8yv8yv8yv8y",
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id as string;
        token.name = user.name;
        token.mobileNumber = user.mobileNumber;
        token.image = user.image;
      }
      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
        } else if (session.user?.name) {
          token.name = session.user.name;
        }
        if (session.mobileNumber) {
          token.mobileNumber = session.mobileNumber;
        }
        if (session.image) {
          token.image = session.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.mobileNumber = token.mobileNumber as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
