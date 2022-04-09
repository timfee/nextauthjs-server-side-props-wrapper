import { InferGetServerSidePropsType, NextPage } from 'next'
import { signIn, signOut } from 'next-auth/react'

import { withAuthSsr } from '@/utils/withSSR'

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ host }) => {
  return (
    <main>
      <div className="p-5 text-white bg-blue-800">{host}</div>
      <div className="flex m-5 space-x-3">
        <button
          className={
            (!session?.user
              ? 'bg-blue-600 text-white'
              : 'bg-slate-300 cursor-not-allowed text-gray-400') +
            ' px-2 py-1 rounded-md'
          }
          onClick={() => !session?.user && signIn()}>
          sign in
        </button>
        <button
          className={
            (session?.user
              ? 'bg-red-600 text-white'
              : 'bg-slate-300 cursor-not-allowed text-gray-400') +
            ' px-2 py-1 rounded-md'
          }
          onClick={() => signOut()}>
          sign out {session?.user.name}
        </button>
      </div>
    </main>
  )
}

/**
 * Wrap the getServerSideProps function with `withAuthSsr`,
 * and your the context's `req` object will get augmented
 * with the return value of `getSession()` for you to do
 * with as you please.
 *
 * Here, we're just passing the value along.
 */
export const getServerSideProps = withAuthSsr(
  async (ctx) => {
    return {
      props: {
        host: ctx.req.headers.host,
        ...(ctx.req.session && { session: ctx.req.session })
      }
    }
  }
  /* If you provide a path as an optional second parameter,
     the user will be redirected to this page if unauthed. */
  // '/login'
)

export default Home
