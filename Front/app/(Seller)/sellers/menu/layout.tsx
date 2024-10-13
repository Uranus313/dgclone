'use client'
import React, { useContext, useEffect, useState } from 'react'
import MenuSideBar from './MenuSideBar'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { UserStatus } from '@/app/components/Interfaces/interfaces';
import useGetUserWallet from '@/app/hooks/useGetSellerWallet';
import { useSeller } from '@/app/hooks/useSeller';


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
    
    const {seller , setSeller,isLoading } = useSeller();
    const router = useRouter();
    useEffect(() =>{
        // console.log(data)
        // console.log(user)
        // console.log(!isLoading)

        if(!isLoading && seller?.status != UserStatus.seller){
            console.log('ssssss',JSON.stringify(seller))
            router.push("/sellers/signIn");
        }
        console.log('zzzzz',seller?.status)

    },
      [seller,isLoading]  
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
         : seller &&
              <div className='flex '>
            <MenuSideBar isWalletLoading={isWalletLoading} wallet={wallet} />
            {children}
          </div>
                  
            
    }
    </div>
    
  )
}

export default MenuLayout;
