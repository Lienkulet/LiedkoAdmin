import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"
import Head from 'next/head';
import { Logo } from ".";
import { useStateContext } from "@/context/StateContext";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  const { data: session } = useSession()
  const { toggleNav } = useStateContext();

  if (!session) {
    return (
      <div className='bg-blue-900 w-screen h-screen flex items-center'>
        <div className="text-center w-full ">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg color-black font-bold">Login with Google</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white h-screen ">
      <Head>
        <title>Liedko Admin</title>
      </Head>
      <div className="md:hidden flex justify-between p-2 text-blue-900   text-xl font-bold">

      <Logo />

      <button
      onClick={() => toggleNav()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" size={'3rem'} className="w-6 h-6 text-xl">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      
        </div>
      <div className="flex h-screen">

        <Nav  /> 
        <Toaster />
        <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4 font-bold">
          {children}
        </div>
      </div>
    </div>

  )
}

export default Layout;
