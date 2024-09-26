'use client'

import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Wallet } from "./layout";
import { useUser } from "@/app/hooks/useUser";
import { useSeller } from "@/app/hooks/useSeller";




interface Props{
    wallet : Wallet,
    isWalletLoading : boolean
}

function MenuSideBar( {wallet , isWalletLoading} : Props){
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
          setSeller(null);
          router.push('/');
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
    useEffect(() =>{
        console.log(isWalletLoading);
        console.log(wallet);
    },[wallet,isWalletLoading])
    const {seller , setSeller , isLoading} = useSeller();
    return(
        <div className="flex flex-col bg-white">
            {isLoading && <span className="loading loading-dots loading-lg"></span>}
            {
                seller && 
                <ul className="flex flex-col">
                    <li className="flex justify-between">
                        <Link href={"/"}>کیف پول</Link>
                        {isWalletLoading && <span className="loading loading-dots loading-lg"></span>}
                        {wallet?.money && <p>{wallet?.money}</p>}
                    </li>
                    <li><Link href={"/sellers/menu/changeInfo"}>اطلاعات مالک کسب و کار</Link></li>
                    <li><Link href={"/sellers/menu/shopInfo"}>اطلاعات فروشگاه</Link></li>
                    <li><Link href={"/sellers/menu/changeAddress"}>آدرس ها</Link></li>
                    <li><Link href={"/sellers/menu/finances"}>مالی</Link></li>
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