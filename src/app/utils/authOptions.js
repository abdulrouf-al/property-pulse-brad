 import connectDb from "../config/database";
 import User from '@/app/models/User'
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // this dose not save the user to do more tests, but we don't need it in production mood
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //invoked on successful sign in
    async signIn({ profile }) {
            /* 
            1. connect to database 
            2. check if user exists
            3. if not, add user to database
            4. return true to allow sign in
            */

    try {
        await connectDb();
        const userExists = await User.findOne({ email: profile.email });
         if (!userExists) {
            //Truncate user name if too long
          const username = profile.name.slice(0, 20);
          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }
        return true;
    }catch(err){
        console.log(err)
        return false
    }

    },
    //modifies the session object
    async session({ session }) {
      /* 
            get user from database 
            assign user id to session 
            return session
            */
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id.toString();
      return session;
    },
  },
};
