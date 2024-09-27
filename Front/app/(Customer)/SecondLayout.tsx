import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useUserCheckToken from '../hooks/useCheckToken';
import userContext from '../contexts/userContext';
import orderCartContext from '../contexts/orderCartContext';
import NavBar from './NavBar';
import _ from 'lodash'
import Footer from './Footer';
import { Order, OrdersHistory, User } from '../components/Interfaces/interfaces';

const SecondLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    let [user, setUser] = useState<User|null>(null);
    let [loading, setLoading] = useState<any>(true);
    const [orderCart , setOrderCart] = useState<OrdersHistory>({orders:[],price:0,ordersdate:'',recievedate:'',userid:''});

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

useEffect(() => {
  if(user){
    setOrderCart({...orderCart , userid:user._id})
  }
},[user]);

  return (
    <userContext.Provider value={{user : user , setUser : setUser , isLoading : loading}}>
    <orderCartContext.Provider value={{orderCart : orderCart , setOrderCart : setOrderCart }}>
            {showNavbar && <NavBar />}
            <main style={{paddingTop:'120px'}} >
              {children}
            </main>
            <Footer/>
    </orderCartContext.Provider>
    </userContext.Provider>
  )
}

export default SecondLayout
