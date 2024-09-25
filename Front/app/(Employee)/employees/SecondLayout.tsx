import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useUserCheckToken from '../../hooks/useCheckToken';
import userContext from '../../contexts/userContext';
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
  const showNavbar = pathname !== "/employees/signIn";
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
            <main>         
              {children}
            </main>
            
    </userContext.Provider>
  )
}

export default SecondLayout
