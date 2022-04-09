import NextAuth from 'next-auth'
import GoogleAuth from 'next-auth/providers/google'

export default NextAuth({
  callbacks: {
    /**
     * This is a utility function that doesn't affect any of the SSR stuff.
     * However, I often find that I want to perform operations using the
     * signed-in user's ID as part of the SSR.
     *
     * So, I've extended this function to return include an `id` property
     * inside of the `user` object.
     */
    session: ({ session, token }) => {
      if (token && token.sub) {
        session.user.id = token.sub
      }
      return { ...session }
    }
  },

  providers: [
    GoogleAuth({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ]
})
