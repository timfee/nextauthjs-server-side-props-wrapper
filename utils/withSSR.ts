import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export function withAuthSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext & { req: { session?: Session } }
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
  redirect?: string
) {
  return async function withAuthUserTokenSSR(
    context: GetServerSidePropsContext
  ) {
    const session = await getSession(context)

    if (session) {
      Object.defineProperty(
        context.req,
        'session',
        getPropertyDescriptorForReqSession(session)
      )
    } else if (redirect) {
      return {
        redirect: {
          destination: redirect,
          statusCode: 302
        }
      } as GetServerSidePropsResult<P>
    }
    return handler(context)
  }
}

function getPropertyDescriptorForReqSession(
  session: Session
): PropertyDescriptor {
  return {
    enumerable: true,
    get() {
      return session
    },
    set(value) {
      const keys = Object.keys(value)
      const currentKeys = Object.keys(session)

      currentKeys.forEach((key) => {
        if (!keys.includes(key)) {
          delete session[key]
        }
      })

      keys.forEach((key) => {
        session[key] = value[key]
      })
    }
  }
}
