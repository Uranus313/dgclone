import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useUserCheckToken from './users/hooks/useCheckToken';
import userContext from './contexts/userContext';
import NavBar from './NavBar';
import _ from 'lodash'

const SecondLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    let [user, setUser] = useState<any>(null);
    let [loading, setLoading] = useState<any>(true);
  const pathname = usePathname();
  let {data: serverUser,error,isLoading} = useUserCheckToken();
  const showNavbar = pathname !== "/users/signIn";
  useEffect(() => {
    setLoading(isLoading);
    if(error){
        setUser(null);
    }else if (serverUser?._id && !_.isEqual(serverUser,user)){
        setUser(serverUser);
    }
},[serverUser,isLoading]);
  return (
    <userContext.Provider value={{user : user , setUser : setUser , isLoading : loading}}>
            {showNavbar && <NavBar />}
            <main className='p-5'>
              {children}
            </main>
    </userContext.Provider>
  )
}

export default SecondLayout
