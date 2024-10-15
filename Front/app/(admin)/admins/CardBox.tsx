'use client'
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import useGetUserCount from "./hooks/useGetUserCount";
import useGetEmployeeCount from "./hooks/useGetEmployeeCount";
import useGetSellerCount from "./hooks/useGetSellerCount";
import useGetTransactionCount from "./hooks/useGetTransactionCount";
import { useUser } from "@/app/hooks/useUser";
import useGetProdsAndOrdersCount from "./hooks/useGetProdsAndOrdersCount";

interface Props {
    changeList: (list: string) => void
}
function CardBox({ changeList }: Props) {
    const { user, setUser, isLoading } = useUser();
    const { data: userCount, error: uError, isLoading: isUserCountLoading } = useGetUserCount();
    const { data: employeeCount, error: eError, isLoading: isEmployeeCountLoading } = useGetEmployeeCount();
    const { data: sellerCount, error: sError, isLoading: isSellerCountLoading } = useGetSellerCount();
    const { data: transactionCount, error: tError, isLoading: isTransactionCountLoading } = useGetTransactionCount();
    const { data: productAndOrderCount, error: poError, isLoading: isCountLoading } = useGetProdsAndOrdersCount();

    function goToList() {
        const element = document.getElementById("list");
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (

        <div className='w-9/12 text-white text-center pr-20' >
            <div className='md:flex mt-10 md:mt-20' id="cardBox">
                <div className='bg-primary-color flex-1 mx-5 rounded-md '>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white" className="size-16"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }
                        <div className='self-center px-3'>
                            {isUserCountLoading && <span className="loading loading-dots loading-lg"></span>}
                            {userCount?.count && <p>{userCount?.count}</p>}
                            <p>کاربران</p>
                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("users");
                        goToList();
                    }}>نشان دادن کاربران </button>
                </div>
                <div className='bg-red-box flex-1 mx-5 rounded-md mt-10 md:mt-0'>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                className="size-16"
                                viewBox="0 0 16 16"> <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }
                        <div className='self-center px-3'>
                            {isEmployeeCountLoading && <span className="loading loading-dots loading-lg"></span>}
                            {employeeCount?.count && <p>{employeeCount?.count}</p>}
                            <p>کارمندان</p>
                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("employees");
                        goToList();
                    }}>نشان دادن کارمندان </button>
                </div>
                <div className='bg-purple-box flex-1 mx-5 rounded-md mt-10 md:mt-0'>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                className="size-16"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }
                        <div className='self-center px-3 '>
                            {isCountLoading && <span className="loading loading-dots loading-lg"></span>}

                            <div>
                                {productAndOrderCount &&
                                    <div>

                                        {productAndOrderCount?.orders_count && <p>{productAndOrderCount?.orders_count}</p>}
                                    </div>
                                }
                                <p>سفارش ها</p>
                            </div>

                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("orders");
                        goToList();
                    }}>نشان دادن سفارش ها </button>
                </div>
            </div>
            <div className='md:flex mt-16'>
                <div className='bg-blue-box flex-1 mx-5 rounded-md mt-10 md:mt-0'>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white" className="size-16"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }

                        <div className='self-center px-3'>
                            
                            {isSellerCountLoading && <span className="loading loading-dots loading-lg"></span>}
                            {sellerCount?.count && <p>{sellerCount?.count}</p>}
                            <p> فروشندگان</p>
                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("sellers");
                        goToList();
                    }}>نشان دادن فروشندگان </button>
                </div>
                <div className='bg-green-box flex-1 mx-5 rounded-md mt-10 md:mt-0'>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                className="size-16"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }
                        <div className='self-center px-3'>
                        {isCountLoading && <span className="loading loading-dots loading-lg"></span>}
                            <div>
                                {productAndOrderCount &&
                                    <div>

                                        {productAndOrderCount?.prods_count && <p>{productAndOrderCount?.prods_count}</p>}
                                    </div>
                                }
                                <p> محصولات</p>
                            </div>


                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("products");
                        goToList();
                    }}>نشان دادن محصولات </button>
                </div>
                <div className='bg-greener-box flex-1 mx-5 rounded-md mt-10 md:mt-0'>
                    <div className='flex'>
                        {isLoading ? <span className="loading loading-dots loading-lg"></span> :

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                className="size-16"
                                viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                        }
                        <div className='self-center px-3'>
                            {isTransactionCountLoading && <span className="loading loading-dots loading-lg"></span>}
                            {transactionCount?.count && <p>{transactionCount?.count}</p>}
                            <p> تراکنش ها</p>
                        </div>
                    </div>
                    <button className="rounded-b-md py-1.5 mt-1 w-full bg-button-box" onClick={(e) => {
                        changeList("transactions");
                        goToList();
                    }}>نشان دادن تراکنش ها </button>

                </div>
            </div>

        </div>
    )
}
export default CardBox;