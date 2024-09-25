'use client'
import React, { useContext, useEffect, useState } from 'react'
import MenuSideBar from './../MenuSideBar'
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';



const MenuLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const { user, setUser, isLoading } = useUser();
  const router = useRouter();
  useEffect(() => {
    // console.log(data)
    // console.log(user)
    // console.log(!isLoading)

    if (!user && !isLoading && user?.status != "admin") {
      router.push("/admins/signIn");
    }
  },
    [user, isLoading]
  )

  return (
    <div className='w-full'>
      {isLoading ?
        <span className="loading loading-dots loading-lg"></span>
        : user &&
        <div className='flex'>
          <MenuSideBar />
          {children}
        </div>

      }
    </div>

  )
}

export default MenuLayout;
