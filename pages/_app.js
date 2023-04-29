import { StateContext } from '@/context/StateContext'
import '@/styles/globals.css'
import '@/styles/stats.css'
import { SessionProvider } from "next-auth/react"

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <StateContext>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </StateContext>
  )
}