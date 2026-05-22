import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      mobileNumber?: string
      permissions?: any
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    mobileNumber?: string
    permissions?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    mobileNumber?: string
    permissions?: any
  }
}
