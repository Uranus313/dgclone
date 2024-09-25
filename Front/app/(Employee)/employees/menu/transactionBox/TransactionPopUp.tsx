"use client";

import { Wallet } from "@/app/(Customer)/users/menu/layout";
import { Transaction } from "@/app/components/Interfaces/interfaces";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";


export interface Props {
    transaction: Transaction;
}

const TransactionPopUp = ({ transaction }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);

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
        <div >

            <div onClick={() => {
                openModal();
            }} className=" flex py-5 border-b-2 border-b-border-color-list text-center">


                <p className="w-1/4">{(transaction.money && transaction.money) || "-"}</p>
                <p className="w-1/4">{(transaction.sender.entityType && transaction.sender.entityType) || "-"}</p>
                <p className="w-1/4">{(transaction.receiver.entityType && transaction.receiver.entityType) || "-"}</p>
                <p className="w-1/4">{(transaction.date && transaction.date) || "-"}</p>

            </div>

            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    <h3 className="font-bold text-lg pb-2">
                        {((transaction.title && transaction.title) || "-")}
                    </h3>
                    <div className="block">
                        <div className=" pb-2">
                            <p>فرستنده </p>
                            <p>نوع :</p>
                            <p>{transaction.sender.entityType}</p>
                            <p className="pt-1">شماره کارت :</p>
                            <p>{((transaction.sender.bankAccount && transaction.sender.bankAccount) || "-")}</p>
                            <p className="pt-1">اطلاعات اضافه :</p>
                            <p>{((transaction.sender.additionalInfo && transaction.sender.additionalInfo) || "-")}</p>
                        </div>
                        <div className=" pb-2">
                            <p>گیرنده </p>
                            <p>نوع :</p>
                            <p>{transaction.receiver.entityType}</p>
                            <p className="pt-1">شماره کارت :</p>
                            <p>{((transaction.receiver.bankAccount && transaction.receiver.bankAccount) || "-")}</p>
                            <p className="pt-1">اطلاعات اضافه :</p>
                            <p>{((transaction.receiver.additionalInfo && transaction.receiver.additionalInfo) || "-")}</p>
                        </div>
                        <div className=" pb-2">
                            <p> تاریخ :</p>
                            <p>{transaction.date}</p>
                        </div>
                    </div>
                    <div className="my-4 flex justify-center">

                        <button
                            className="btn btn-warning mx-3"
                            type="button"
                            onClick={closeModal}
                        >
                            خروج
                        </button>

                    </div>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    );
};

export default TransactionPopUp;
