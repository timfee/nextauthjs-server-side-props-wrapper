import '@/styles/globals.css'

import { NextComponentType } from 'next'
import type { AppContext, AppInitialProps, AppProps } from 'next/app'
import App from 'next/app'
import { getSession, SessionProvider } from 'next-auth/react'

const MyApp: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps
}: AppProps) => {
  /**
   * The documentation at https://next-auth.js.org/getting-started/example#configure-shared-session-state
   * suggests pulling `session` out of the `pageProps` via the spread operator
   * (e.g. `pageProps: { session, ...pageProps }`), but I've found this has
   * the unintended side-effect of making the session object inaccessible
   * within the page rendering component.
   */
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

/**
 * Upon initial mount, populate the `session` page prop with
 * results from the server.
 *
 * This is optional; I've found that it reduces page flashes
 * when an auth'd user arrives for the first time, but there
 * may be other implications.
 */
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const session = await getSession(appContext.ctx)

  return { ...appProps, pageProps: { session } }
}

export default MyApp
