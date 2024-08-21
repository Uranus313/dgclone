
import NextAuth, { SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
interface credentials {
    phoneNumber : String,
    password : String
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phoneNumber: { label: "phoneNumber", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials : any ) {
        console.log("ll")
        // Call your external API to authenticate the user
        const res = await fetch("http://localhost:3005/users/user/logIn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: credentials.phoneNumber,
            password: credentials.password,
          }),
        });
        // console.log(res)
        const user = await res.json();
        console.log(user)
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user; // Return user object
        }
        throw new Error(user.error);
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy, // Use JWT for session strategy
    maxAge: 6 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user } : { token: JWT; user?: any }) {
      // Persist the user information in the token
      if (user) {
        token.user = user; // Assuming your user object has an id
      }
      return token;
    },
    async session({ session, token } : { token: JWT; session: any }) {
      // Add the user id to the session
      if (token) {
        session.user = token.user;
      }
      console.log(session)
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

