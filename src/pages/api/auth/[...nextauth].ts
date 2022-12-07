import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "text", placeholder: "" },
      },
      authorize: async (credentials) => {
        const user = await prisma.participant.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        console.log(user);
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  // pages: {
  //   signIn: "/auth/login",
  //   error: "/auth/login", // Error code passed in query string as ?error=
  // },
};

export default NextAuth(authOptions);
