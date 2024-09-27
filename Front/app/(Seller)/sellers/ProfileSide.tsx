import React from 'react'

import Link from 'next/link'
import { useSeller } from '@/app/hooks/useSeller'
import { Seller } from '@/app/components/Interfaces/interfaces'

interface Props{
  seller:Seller|null
}
const ProfileSide = ({seller}:Props) => {
 
  return (
    <div className='p-4'>
        <div className='flex items-center justify-between '>
          <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            {seller?.storeInfo?.commercialName? 
              <h1 className='mx-2 text-base'>{seller?.storeInfo?.commercialName}</h1>
              :  <h1 className='mx-2 text-base'>{seller?.phoneNumber}</h1>
            }
          </div>
          <div className='flex'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mx-1 text-primary-seller">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            <p className=''>{seller?.rating}</p>
          </div>
        </div>

        <hr className=' text-grey-border my-4'/>

        <div>
          <div className=''>
            <div className='flex justify-between'>
              <p>اعلان ها</p>
              <Link href='/sellers/notifications' className='border rounded-md border-primary-seller px-5 py-2 text-primary-seller text-sm'>همه</Link>
            </div>
            {seller?.recentNotifications.slice(0,2).map(notif=>(
              <div className='flex justify-between my-3 overflow-hidden border-b border-grey-border py-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <p className='my-1'>{notif.type}</p>
                <p className='line-clamp-1 my-1'>{notif.content}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full mt-1 text-primary-seller">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </div>
            ))}
          </div>
        </div>
        
    </div>
  )
}

export default ProfileSide