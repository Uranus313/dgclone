import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useUserCheckToken from '../hooks/useCheckToken';
import userContext from '../contexts/userContext';
import orderCartContext from '../contexts/orderCartContext';
import categoriesContext from '../contexts/categoriesContext';
import NavBar from './NavBar';
import _ from 'lodash'
import Footer from './Footer';
import { Order, OrdersHistory, User } from '../components/Interfaces/interfaces';
import { Category } from './page';
import useGetCategories from '../hooks/useGetCategories';

const SecondLayout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    let [user, setUser] = useState<User|null>(null);
    let [loading, setLoading] = useState<any>(true);
    const [orderCart , setOrderCart] = useState<OrdersHistory>({orders:[],price:0,ordersdate:'',recievedate:'',userid:''});
    const [categories , setCategories] =  useState<Category[]|undefined>()

  const pathname = usePathname();
  let {data: serverUser,error,isLoading} = useUserCheckToken();
  let {data:Categories}=useGetCategories()

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

useEffect(()=>{
  if (Categories){
    setCategories(Categories)
  }
},[Categories])

  return (
    <userContext.Provider value={{user : user , setUser : setUser , isLoading : loading}}>
    <orderCartContext.Provider value={{orderCart : orderCart , setOrderCart : setOrderCart }}>
    <categoriesContext.Provider value={{categories:categories,setCategories:setCategories}}>
            {showNavbar && <NavBar />}
            <main style={{paddingTop:'120px'}} >
              {children}
            </main>
            <Footer/>
    </categoriesContext.Provider>
    </orderCartContext.Provider>
    </userContext.Provider>
  )
}

export default SecondLayout
