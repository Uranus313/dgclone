"use client";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";



const NavBar = () => {

  return (
    <div className="text-grey-dark fixed text-md w-full z-50 bg-white border-b-1 border-solid border-grey-light drop-shadow p-3 px-5 ">
      
      
      <div id='collapsable' className= {`flex justify-between duration-500 transition-all`} >
        <div className="flex text-lg justify-between items-center w-6/12">
            <p className="text-4xl mx-2 text-primary-seller font-Logo">Digimarket</p>
            <div className="menu menu-horizontal px-1">
              <li>
                <details>
                  <summary className="text-lg">کالا</summary>
                  <ul className="bg-base-100 rounded-t-none w-36">
                    <li><Link href="/sellers/products">مدیریت کالا ها</Link></li>
                    <li><Link href="/sellers/addProducts">افزودن کالا</Link></li>
                  </ul>
                </details>
              </li>
          </div>
          
          <div className="menu menu-horizontal px-1">
              <li>
                <details>
                  <summary className="text-lg">سفارش ها</summary>
                  <ul className="bg-base-100 rounded-t-none w-56 ">
                    <li><Link href="/sellers/orders">مدیریت سفارش های جاری</Link></li>
                    <li><Link href="/sellers/orderHistory">تاریخچه ی سفارش ها</Link></li>
                  </ul>
                </details>
              </li>
          </div>

          <div className="menu menu-horizontal px-1">
              <li>
                <details>
                  <summary className="text-lg">مالی</summary>
                  <ul className="bg-base-100 rounded-t-none w-52 ">
                    <li><Link href="/sellers/transactionHostory">تاریخچه تراکنش ها</Link></li>
                    <li><Link href="/sellers/billingList">لیست هزینه ها و کمیسیون</Link></li>
                  </ul>
                </details>
              </li>
          </div>

          <div className="menu menu-horizontal px-1">
              <li>
                <details>
                  <summary className="text-lg">تحلیل عملکرد</summary>
                  <ul className="bg-base-100 rounded-t-none w-52 ">
                    <li><Link href="/sellers/analyses"> خلاصه نموداری عملکرد</Link></li>
                    <li><Link href="/sellers/saleAnalyse">دسته بندی کالایی فروش</Link></li>
                  </ul>
                </details>
              </li>
          </div>

          <Link href="" className="px-3">
            <p className=""></p>
          </Link>

          <Link href="/" className="px-3">
            <p className="">پشتیبانی</p>
          </Link>
        </div>



        <div className="flex items-center">
          {/* <span className="loading loading-dots loading-lg"></span> */}
          <Link className="ml-3" href="/users/menu/changeInfo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </Link>
          <Link className="ml-3" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </Link>


          <p className="mx-2">|</p>
          <Link href="/sellers/menu/changeInfo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

          </Link>
        </div>
        </div>
      </div>
      

  );
};

export default NavBar;
