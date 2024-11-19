import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      const useremail: string | undefined = user.email as string;
      const username: string | undefined = user.name as string;
      
      const existingUser = await prisma.user.findUnique({
        where: { email: useremail },
      });

      try {
        if (!existingUser) {
          if (useremail && username) {
            const newUser = await prisma.user.create({
              data: {
                email: useremail,
                name: username,
              },
            });
            user.id = newUser.email; // Use email as the ID
          }
        } else {
          console.log("Existing user", existingUser);
          user.id = existingUser.email; // Use email as the ID
        }
      } catch (error) {
        console.log("Next auth error ####################", error);
        return false;
      }
      return true;
    },

    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id; // Store email as userId in the token
      }
      return token;
    },

    session: ({ session, token }: any) => {
      if (session.user) {
        session.user.id = token.userId; // Assign the email as the user ID in the session
        // Only keep name and email in session
        session.user = {
          name: session.user.name,
          email: session.user.email,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
