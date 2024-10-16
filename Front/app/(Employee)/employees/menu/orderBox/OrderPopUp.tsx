'use client'

import { Order } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
    order: Order
}
const OrderPopUp = ({ order }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [state, setState] = useState<number>(0);
    const { user } = useUser();

    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
            setIsOpen(true);
        }
    };

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setIsOpen(false);
        }
    };

    const queryClient = useQueryClient();
    const OrderState = useMutation({
        mutationFn: async () => {
            const result = await fetch("https://localhost:8080/products/order" + `?OrderID=${order._id}&State=${state}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },

            });
            const jsonResult = await result.json();
            console.log(jsonResult);
            if (result.ok) {
                return jsonResult
            } else {
                throw new Error(jsonResult.error);
            }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            queryClient.invalidateQueries({ queryKey: ["orderlist"] });
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    return (
        <div>
            <div onClick={openModal} className=" flex py-5 border-b-2 border-b-border-color-list text-center">
                <p className="w-1/2">{order.product.productID}</p>
                <p className="w-1/2">{((order.rate && order.rate) || "-")}</p>
            </div>

            <dialog ref={dialogRef} className="modal break-all">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    <h3 className="font-bold text-lg pb-2">{order._id}</h3>
                    <div className='block'>
                        <div className=' justify-between pb-2'>
                            <p>آیدی محصول :</p>
                            <p>{order.product.productID}</p>
                        </div>
                        <div className='flex pb-2'>
                            <p className="pl-2"> رنگ :</p>
                            <p>{order.product.color.title}</p>
                        </div>
                        <div className='flex pb-2'>
                            <p className="pl-2">  قیمت :</p>
                            <p>{order.product.price}</p>
                        </div>

                        <div className='flex pb-2'>
                            <p className="pl-2">  فروشنده :</p>
                            <p>{order.product.sellerTitle}</p>
                        </div>
                        <div className=" flex pb-2">
                            <p className="pl-2 pr-4"> خریدار  :</p>
                            <p>{(order.userid && order.userid) || "-"}</p>
                        </div>
                        <div className=" flex pb-2">
                            <p className="pl-2"> تاریخ سفارش :</p>

                            <p>{(order.ordersdate && order.ordersdate) || "-"}</p>
                        </div>
                        <div className=" flex pb-2">
                            <p className="pl-2 pr-4"> تاریخ تحویل  :</p>
                            <p>{(order.recievedate && order.recievedate) || "-"}</p>
                        </div>
                        <div className=" flex pb-2">
                            <p className="pl-2 pr-4"> وضعیت  :</p>
                            <p>{(order.state && order.state) || "-"}</p>
                        </div>

                    </div>
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>

                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => (accessLevel.level === "orderManage" && accessLevel.writeAccess === true) || (accessLevel.level === "shipmentManage" && accessLevel.writeAccess === true)) &&
                                                <div>
                                                    <div className="my-4 flex justify-center">

                                                        <button className='btn btn-primary' type='button' onClick={() => {
                                                            setState(4);
                                                            OrderState.mutate();
                                                        }}>برگشت خورده</button>
                                                        <button className='btn btn-primary' type='button' onClick={() => {
                                                            setState(1);
                                                            OrderState.mutate();
                                                        }}>تحویل داده</button>
                                                        <button className='btn btn-primary' type='button' onClick={() => {
                                                            setState(2);
                                                            OrderState.mutate();
                                                        }}> در انتظار</button>

                                                    </div>
                                                    <div className="my-4 flex justify-center">
                                                        <button className='btn btn-error' type='button' onClick={() => {
                                                            setState(5);
                                                            OrderState.mutate();
                                                        }}>در انبار</button>
                                                        <button className='btn btn-error' type='button' onClick={() => {
                                                            setState(3);
                                                            OrderState.mutate();
                                                        }}>کنسل شده</button>
                                                        <button className='btn btn-warning mx-3' type='button' onClick={closeModal}>خروج</button>
                                                    </div>

                                                </div>

                                            }
                                        </div>

                                    }
                                </div>
                            }
                        </div>

                    }


                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    );
}

export default OrderPopUp
