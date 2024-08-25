"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import useUserCheckToken from "./users/hooks/useCheckToken";
import userContext from "./contexts/userContext";
import { Categories , Category } from "./page";
import {useRouter} from 'next/navigation'
import MegaMenu from "./MegaMenu";


const NavBar = () => {
  const [isCategory , setIsCategory] = useState(false)
  const {user , setUser , isLoading} = useContext(userContext);
  const [navcollaps , setNavcollaps] = useState<boolean>(false)
  const lastScroll = useRef<number>(0);
  const [display , setDisplay] = useState('100')
  const manage = useRouter()

  window.onscroll = function(e) {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value
      const collapsableElement = document.getElementById('collapsable');
      console.log(display)
      if (currentScroll > 0 && lastScroll.current < currentScroll){
        lastScroll.current = currentScroll;
        console.log('down')
        // setNavcollaps(true)
        setDisplay('0')
        if (collapsableElement) {
          collapsableElement.style.display = 'none';
      }
        
      }else if(currentScroll > 0 && lastScroll.current > currentScroll){
        lastScroll.current = currentScroll;
        console.log('up')
        // setNavcollaps(false)
        setDisplay('100')
        if (collapsableElement) {
          collapsableElement.style.display = 'flex';
        }
        
        
      }
  };

  return (
    <div className="text-grey-dark text-md w-full z-50 bg-white border-b-1 border-solid border-grey-light drop-shadow p-3 px-5 ">
      <div className="mb-6 flex justify-between">
        <div className="flex w-7/12">
          <Link href='/'>     
            <h2 className="text-primary-color font-Logo text-5xl ml-8">
              DigiMarket
            </h2>
          </Link>

          <label className="input w-full bg-primary-bg input-bordered flex items-center gap-2">
            <input type="text" className="grow " placeholder="...جستجو کنید" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        <div className="flex">
          {isLoading? <span className="loading loading-dots loading-lg"></span>:
          user? <Link href="/users/menu/changeInfo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </Link>: <Link href="/users/signIn">
          ثبت نام کنید/وارد شوید
        </Link>
          }
          

          <p className="mx-4 text-grey-light">|</p>

          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>
      
      { !navcollaps && 
      <div id='collapsable' className= {`flex justify-between opacity-${display} duration-500 transition-all`} >
        <div className="flex">
          <div onMouseEnter={()=>setIsCategory(true)} onMouseLeave={()=> setIsCategory(false)} className="">

            <Link href="/" className="font-bold flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                />
              </svg>
              <p className="mx-2">دسته بندی</p>
            </Link>

            {isCategory && <MegaMenu/>}
          </div>

          <p className="mx-4 text-grey-light">|</p>
          <Link href="/" className="ml-6 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <p className="mx-2 ">شگفت انگیز</p>
          </Link>

          <Link href="/" className="ml-6 flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.75v16.5M2.25 12h19.5M6.375 17.25a4.875 4.875 0 0 0 4.875-4.875V12m6.375 5.25a4.875 4.875 0 0 1-4.875-4.875V12m-9 8.25h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5Zm12.621-9.44c-1.409 1.41-4.242 1.061-4.242 1.061s-.349-2.833 1.06-4.242a2.25 2.25 0 0 1 3.182 3.182ZM10.773 7.63c1.409 1.409 1.06 4.242 1.06 4.242S9 12.22 7.592 10.811a2.25 2.25 0 1 1 3.182-3.182Z"
              />
            </svg>

            <p className="mx-2 ">کارت هدیه</p>
          </Link>

          <Link href="/" className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
              />
            </svg>

            <p className="mx-2 ">پرفروش ها</p>
          </Link>
          <p className="mx-4 text-grey-light">|</p>

          <Link href="/" className="ml-6 flex">
            <p className="mx-2 ">ارتباط با ما</p>
          </Link>

          <Link href="/" className="ml-6 flex">
            <p className="mx-2 ">فروشنده شوید</p>
          </Link>
        </div>

        <div className="text-primary-color flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          <p className="mx-2">لطفا شهرتان را انتخاب کنید</p>
        </div>
      </div>
      }
    </div>
  );
};

export default NavBar;
