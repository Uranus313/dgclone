"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import useUserCheckToken from "../../hooks/useCheckToken";
import userContext from "../../contexts/userContext";
// import { Categories , Category } from "./page";
import { useRouter } from 'next/navigation'
import { useUser } from "@/app/hooks/useUser";
// import MegaMenu from "./MegaMenu";


const NavBar = () => {
  const [isCategory, setIsCategory] = useState(false)
  const { user, setUser, isLoading } = useUser();
  const [navcollaps, setNavcollaps] = useState<boolean>(false)
  const lastScroll = useRef<number>(0);
  const [display, setDisplay] = useState('100')
  const manage = useRouter()


  return (
    <div className="fixed w-full bg-white p-3 px-5 ">
      <div className=" flex justify-between">
        <div className="flex w-7/12">
          <Link href='/'>
            <h2 className="text-primary-color font-Logo text-5xl ml-8">
              DigiMarket
            </h2>
          </Link>
        </div>
        {isLoading ? <span className="loading loading-dots loading-lg"></span> :
          user ? <Link className="flex" href="/employees">
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

          </Link> : <Link href="/employees">
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
