import NextAuth, { getServerSession } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';
import { Admin } from '@/models/Admin';

async function isAdmin(email) {
  const foundAdmin = (await Admin.findOne({email}))
  if(foundAdmin){
    return foundAdmin;
  }
  // return true;
}

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      if (await isAdmin(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res){
  const session = await getServerSession(req, res, authOptions);
  if(!(await isAdmin(session?.user?.email))){
    res.status(401);
    res.end();
    throw 'Access not allowed'
  }
}
