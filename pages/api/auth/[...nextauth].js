import NextAuth from 'next-auth';
import { getServerSession } from 'next-auth/server';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';
import { Admin } from '@/models/Admin';

async function isAdmin(email) {
  const foundAdmin = await Admin.findOne({ email });
  return Boolean(foundAdmin);
}

const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (await isAdmin(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession({ req });
  if (!(await isAdmin(session?.user?.email))) {
    res.status(401).end();
    throw new Error('Access not allowed');
  }
}
