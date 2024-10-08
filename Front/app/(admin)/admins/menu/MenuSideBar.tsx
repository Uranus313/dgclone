'use client'

import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";



function MenuSideBar(){
    const router = useRouter();
    const [error,setError] = useState<string|null>(null);
    const logOut = useMutation({
      mutationFn: async () => {
        const result = await fetch("http://localhost:3005/users/general/logOut",{
            credentials: 'include'
        });
          const jsonResult = await result.json();
          if(result.ok){
              return jsonResult
          }else{
              throw new Error(jsonResult.error);
          }    
      },
      onSuccess: (savedUser) =>{
          console.log(savedUser);
          // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
          // queryClient.invalidateQueries(["user"]);
          setUser(savedUser);
          router.push('/admins');
          // router.push('/');
      },
      onError: (error) => {
        // Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})// navigate("/");
        //   console.log(error)
        //   console.log(error.response?.data.detail)
        console.log(error);
        setError(error.message)
        // setError(error)
      }
    });
    const {user , setUser , isLoading} = useUser();
    return(
        <div className="flex flex-col bg-white">
            {isLoading && <span className="loading loading-dots loading-lg"></span>}
            {
                user && 
                <ul className="flex flex-col">
                    <li><Link href={"/admins/menu/allAdmins"}>ادمین ها</Link></li>
                    <li><Link href={"/admins/menu/allSellers"}>فروشنده ها</Link></li>
                    <li><Link href={"/admins/menu/allUsers"}>خریداران</Link></li>
                    <li><Link href={"/admins/menu/changeInfo"}>تغییر مشخصات خود</Link></li>
                    <li><Link href={"/"}>کارت های هدیه</Link></li>
                    <li><Link href={"/"}>اعلان ها</Link></li>
                    <li><Link href={"/"}>اطلاعات کاربری</Link></li>
                    <li><Link href={"/"}>آخرین بازدید ها</Link></li>
                    <li>
                        
                        <button onClick={() => logOut.mutate()}>
                            خروج از حساب کاربری
                        </button>
                    </li> 
                </ul>
            }
        </div>
    )
}
export default MenuSideBar;