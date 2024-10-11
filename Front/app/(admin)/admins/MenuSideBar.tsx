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
    const { user, setUser, isLoading } = useUser();
    return(
        <div className="flex w-0 md:w-1/5 bg-white ">
            {isLoading && <span className="loading loading-dots loading-lg"></span>}
            {
                user && 
                <ul className="invisible w-0 md:w-auto md:visible flex flex-col p-7 px-17">
                    <li className="pb-1.5"><Link href={"/admins"}>داشبورد</Link></li>
                    <li className="py-1"><Link href={"/admins/menu/validation"}>ارزیابی</Link></li>
                    <li className="py-1.5"><Link href={"/admins/menu/allTickets"}>بلیط ها</Link></li>
                    <li className="py-1"><Link href={"/admins/menu/allEmployees/allRoles"}>نقش ها</Link></li>
                    <li className="py-1.5 text-nowrap"><Link href={"/admins/menu/allSellers/verifyRequests"}> درخواست تایید</Link></li>
                    <li className="py-1.5 text-nowrap">
                        <button onClick={() => logOut.mutate()}>
                            خروج از حساب
                        </button>
                    </li> 
                </ul>
            }
        </div>
    )
}
export default MenuSideBar;