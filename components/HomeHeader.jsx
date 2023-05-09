import {useSession} from 'next-auth/react'
import React from 'react'

const HomeHeader = () => {
    const {data: session} = useSession();

    return (
        <div className="text-blue-900 flex justify-between items-center align-middle">
            <h2>
                <div className="flex gap-2 items-center">
                    <img src={
                            session ?. user ?. image
                        }
                        alt=''
                        className="w-6 h-6 rounded-md md:hidden"/>
                    <div className='text-white flex gap-2'>
                        <h1 className='text-[#70D89D]'>
                            Hello, 
                        </h1>
                        <span>
                             {
                            session ?. user ?. name
                        }!</span>
                    </div>
                </div>
            </h2>
            <div className='hidden md:block'>
                <div className="flex bg-gray-300 text-black  align-middle gap-1 rounded-lg overflow-hidden">
                    <img src={
                            session ?. user ?. image
                        }
                        alt=''
                        className="w-8 h-8"/>
                    <span className="px-2 ">
                        {
                        session ?. user ?. name
                    } </span>
                </div>
            </div>
        </div>
    )
}

export default HomeHeader
