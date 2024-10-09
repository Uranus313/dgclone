'use client'

import { Order } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
    order: Order
}
const OrderPopUp = ({ order }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
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

    return (
        <div>
            <div onClick={openModal} className=" flex py-5 border-b-2 border-b-border-color-list text-center">
                <p className="w-1/2 md:w-1/3">{order.product.productTitle}</p>
                <p className="w-1/2 md:w-1/3">{((order.rate && order.rate) || "-")}</p>
                <p className="w-0 md:w-1/3 invisible md:visible">{order.ordersdate}</p>
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
                        
                    </div>
                                   </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    );
}

export default OrderPopUp
