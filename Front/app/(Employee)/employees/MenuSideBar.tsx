'use client'
import userContext from "@/app/contexts/userContext";
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
          setUser(savedUser);
          router.push('/');
      },
      onError: (error) => {
        console.log(error);
        setError(error.message);
      }
    });
    const {user , setUser , isLoading} = useUser();
    return(
        <div className="flex w-1/5 bg-white ">
            {isLoading && <span className="loading loading-dots loading-lg"></span>}
            {
                user && 
                <ul className="flex flex-col p-7 px-17">
                    <li className="pb-1.5"><Link href={"/employees"}>داشبورد</Link></li>
                    <li className="py-1"><Link href={"/employees"}>ارزیابی</Link></li>
                    <li className="py-1.5"><Link href={"/employees"}>بلیط ها</Link></li>
                    <li className="py-1.5"><Link href={"/employees"}>لاگ ها</Link></li>
                    <li className="py-1.5">
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