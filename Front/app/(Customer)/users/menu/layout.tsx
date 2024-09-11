'use client'
import React, { useContext, useEffect, useState } from 'react'
import MenuSideBar from './MenuSideBar'
import { useRouter } from 'next/navigation';
import userContext from '@/app/contexts/userContext';
import { useMutation } from '@tanstack/react-query';
import useGetUserWallet from '../hooks/useGetWallet';


export interface Wallet{
    money  : number,
    _id : string,
    userID : string,
    userType : string
}

const MenuLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    const {data: wallet,error : walletError,isLoading : isWalletLoading} = useGetUserWallet();
    
    const {user , setUser , isLoading} = useContext(userContext);
    const router = useRouter();
    useEffect(() =>{
        // console.log(data)
        // console.log(user)
        // console.log(!isLoading)

        if(!user && !isLoading && user?.status != "user"){
            router.push("/users/signIn");
        }
    },
      [user,isLoading]  
    )
    useEffect(() =>{
      // console.log(data)
      // console.log(user)
      // console.log(!isLoading)

      console.log(walletError)
  },
    [walletError]  
  )
  return (
    <div>
        {isLoading? 
        <span className="loading loading-dots loading-lg"></span>
         : user &&
              <div className='flex'>
            <MenuSideBar isWalletLoading={isWalletLoading} wallet={wallet} />
            {children}
          </div>
                  
            
    }
    </div>
    
  )
}

export default MenuLayout;
