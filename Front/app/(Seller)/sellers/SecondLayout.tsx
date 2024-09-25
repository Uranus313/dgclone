'use client'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
// import useUserCheckToken from '../hooks/useCheckToken';
import userContext from '../../contexts/userContext';
import _ from 'lodash'
import FooterSeller from './FooterSeller';
import NavbarSeller from './NavbarSeller';
import { Seller } from '@/app/components/Interfaces/interfaces';
import sellerContext from '@/app/contexts/sellerContext';
import useUserCheckToken from '../../hooks/useCheckToken';

const SecondLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    let [seller, setSeller] = useState<Seller|null>(null);
    let [loading, setLoading] = useState<any>(true);
  const pathname = usePathname();
  let {data: serverUser,error,isLoading} = useUserCheckToken();
  const showNavbar = pathname !== "/employees/signIn";
  useEffect(() => {
    setLoading(isLoading);
    if(error){
        setSeller(null);
    }else if (serverUser?._id && !_.isEqual(serverUser,seller)){
        setSeller(serverUser);
    }
},[serverUser,isLoading]);
  return (
    <sellerContext.Provider value={{seller : seller , setSeller : setSeller , isLoading : loading}}>
         <NavbarSeller/>
            <main className='p-5' style={{paddingTop:'85px'}}>
              {children}
            </main>
         <FooterSeller/>
            
    </sellerContext.Provider>
  )
}

export default SecondLayout
