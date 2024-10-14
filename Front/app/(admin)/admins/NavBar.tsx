'use client'
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";



function NavBar() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, isLoading } = useUser();
  const [isVisible, setIsVisible] = useState(false);

  const logOut = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/general/logOut", {
        credentials: 'include'
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      setUser(savedUser);
      router.push('/');
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });

  const menu = () => {
    setIsVisible(!isVisible);
    const element = document.getElementById("cardBox");
    if(element){
      if(isVisible){
        element.className="md:flex mt-10 md:mt-20";
      }else{
        element.className="mt-0 md:flex md:mt-20";
      }
    }
    
  };


  return (
    <div className={` w-full bg-white p-3 px-5 bg-opacity-0 md:bg-opacity-100  ${isVisible ? 'md:fixed' : 'fixed'
                }`} >
      <div className=" flex justify-between ">
        <div className="flex w-7/12 ">
          {isLoading && <span className="loading loading-dots loading-lg"></span>}
          {
            user &&
            <div >
              <button onClick={menu} className="md:invisible md:w-0 md:h-0 transition duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 50 50">
                  <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"></path>
                </svg>
              </button>
              <ul className={`md:w-0 md:h-0 transition-all duration-500 ease-in-out transform ${isVisible ? 'opacity-100 max-h-full md:opacity-0 md:h-0' : 'opacity-0 max-h-0'
                } overflow-hidden`}>
                <li className="py-1.5"><Link href={"/admins"} onClick={menu}>داشبورد</Link></li>
                <li className="py-1"><Link href={"/admins/menu/validation"} onClick={menu}>ارزیابی</Link></li>
                <li className="py-1.5"><Link href={"/admins/menu/allTickets"} onClick={menu}>بلیط ها</Link></li>
                <li className="py-1"><Link href={"/admins/menu/allEmployees/allRoles"} onClick={menu}>نقش ها</Link></li>
                <li className="py-1.5"><Link href={"/admins/menu/allCategories"}>دسته بندی ها</Link></li>
                <li className="py-1 text-nowrap"><Link href={"/admins/menu/allSellers/verifyRequests"} onClick={menu}> درخواست تایید</Link></li>
                <li className="pt-1.5 text-nowrap">
                  <button onClick={() => logOut.mutate()}>
                    خروج از حساب
                  </button>
                </li>
              </ul>
            </div>
          }
          <Link href='/'>
            <h2 className="text-primary-color font-Logo text-5xl ml-8 invisible md:visible">
              DigiMarket
            </h2>
          </Link>
        </div>
        {isLoading ? <span className="loading loading-dots loading-lg"></span> :
          user ? <Link className="flex" href="/admins">
            <p className="w-20 px-2 text-sm">
              {"" +
                (user?.firstName ? user?.firstName : "") +
                (user?.lastName ? " " + user?.lastName : "")}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

          </Link> : <Link href="/admins">
            {""
              // (user?.firstName ? user?.firstName : "") +
              // (user?.lastName ? " " + user?.lastName : "")
            }
          </Link>
        }
      </div>
    </div>
  );
};

export default NavBar;
