import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

// @ts-expect-error: Type error that we intentionally suppress
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // @ts-expect-error: Type error that we intentionally suppress
    async signIn({ user }) {
      const useremail = user.email as string;
      const username = user.name as string;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: useremail },
        });

        if (!existingUser && useremail && username) {
          await prisma.user.create({
            data: {
              email: useremail,
              name: username,
            },
          });
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
      return true;
    },
// @ts-expect-error: Type error that we intentionally suppress
    async jwt({ token, user }) {
      if (user?.email) {
        token.userId = user.email; // Use email as userId
      }
      return token;
    },
// @ts-expect-error: Type error that we intentionally suppress
    async session({ session, token }) {
      if (token?.userId) {
        try {
          const userData = await prisma.user.findUnique({
            where: {
              email: session.user.email!,
            },
            include: {
              reminders: true, // Fetch reminders along with the user
            },
          });
    
          if (userData) {
            session.user = {
              id: userData.id,
              name: userData.name as string,
              email: userData.email,
              reminders: userData.reminders, // Match the type declaration
            };
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    }
    
  },
});

export { handler as GET, handler as POST };
