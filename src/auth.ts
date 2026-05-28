import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { authenticateLogin, registerAccount } from "@/lib/auth/server"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      id: "login",
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim()
        const password = credentials?.password?.toString() ?? ""

        if (!email || !password) {
          return null
        }

        const result = await authenticateLogin({
          email,
          password,
        })

        return {
          id: result.profile.id,
          email: result.profile.email,
          name: [result.profile.first_name, result.profile.last_name]
            .filter(Boolean)
            .join(" "),
          first_name: result.profile.first_name,
          last_name: result.profile.last_name,
          handle: result.profile.handle,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        }
      },
    }),
    Credentials({
      id: "register",
      name: "Register",
      credentials: {
        fullName: { label: "Full Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        country: { label: "Country", type: "text" },
      },
      async authorize(credentials) {
        const fullName = credentials?.fullName?.toString().trim()
        const email = credentials?.email?.toString().trim()
        const password = credentials?.password?.toString() ?? ""
        const country = credentials?.country?.toString().trim()

        if (!email || !password) {
          return null
        }

        const result = await registerAccount({
          email,
          password,
          fullName,
          country,
        })
        
        return {
          id: result.profile.id,
          email: result.profile.email,
          name: [result.profile.first_name, result.profile.last_name]
            .filter(Boolean)
            .join(" "),
          first_name: result.profile.first_name,
          last_name: result.profile.last_name,
          handle: result.profile.handle,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          handle: user.handle,
        }
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      if (trigger === "update" && session?.accessToken) {
        token.accessToken = session.accessToken
      }

      if (trigger === "update" && session?.refreshToken) {
        token.refreshToken = session.refreshToken
      }

      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user
      }

      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined

      return session
    },
  },
}

export const authHandler = NextAuth(authOptions)
