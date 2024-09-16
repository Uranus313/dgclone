"use client";

import { Wallet } from "@/app/(Customer)/users/menu/layout";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";

export interface User {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  isBanned: boolean | undefined;
  email: string | null | undefined;
  birthDate: string | null | undefined;
  nationalID: string | null | undefined;
  phoneNumber: string;
  _id: string;
  job: string | null | undefined;
  economicCode: string | null | undefined;
  walletID: string;
  moneyReturn: {
    method: "bankAccount" | "wallet";
    bankAccount: string | null | undefined;
  };
  addresses: [
    {
      country: string;
      province: string;
      city: string;
      postalCode: string;
      additionalInfo: string | null | undefined;
      number: string;
      unit: string | null | undefined;
      coordinates: {
        x: string;
        y: string;
      };
      receiver: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
      };
    }
  ];
}
export interface Props {
  user: User;
}
const UserPopUp = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  // const { user} = useContext(userContext);

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
  async function getWallet(id: string){
    if(!id){
        return
    }
    const result = await fetch("http://localhost:3005/users/admin/getWallet/" + id, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResult = await result.json();
      if (result.ok) {
        setWallet(jsonResult);
      } else {
        setError(jsonResult.error);
      }
  }
  const banUser = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/banUser", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ userID: user._id }),
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
      // queryClient.invalidateQueries(["user"]);
      // setUser(savedUser);
      user.isBanned = true;
      closeModal();
      // router.push('/');
      // router.push('/');
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
      // setError(error)
    },
  });
  const unbanUser = useMutation({
    mutationFn: async () => {
      const result = await fetch(
        "http://localhost:3005/users/admin/unbanUser",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ userID: user._id }),
        }
      );
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
      // queryClient.invalidateQueries(["user"]);
      // setUser(savedUser);
      user.isBanned = false;
      closeModal();
      // router.push('/');
      // router.push('/');
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
      // setError(error)
    },
  });

  return (
    <div>
      <div onClick={() => {openModal();
        getWallet(user.walletID);
      }} className=" flex justify-between">
        <p>{((user.firstName && user.firstName) || "") + ((user.lastName && " " + user.lastName) || "")}</p>
        <p>{user.phoneNumber}</p>
        {user.isBanned && <p className=" text-red-500">بن شده</p>}
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg">
          {((user.firstName && user.firstName) || "") + ((user.lastName && " " + user.lastName) || "")}
          </h3>
          <div className="block">
            <div className=" flex justify-between">
              <p>ایمیل :</p>

              <p>{user.email}</p>
            </div>
            <div className=" flex justify-between">
              <p>شماره تلفن :</p>

              <p>{user.phoneNumber}</p>
            </div>
            <div className=" flex justify-between">
              <p>کد ملی :</p>

              <p>{user.nationalID}</p>
            </div>
            <div className=" flex justify-between">
              <p>تاریخ تولد :</p>

              <p>{user.birthDate}</p>
            </div>
            <div className=" flex justify-between">
              <p>آیدی :</p>

              <p>{user._id}</p>
            </div>
            <div className=" flex justify-between">
              <p>کار :</p>

              <p>{user.job}</p>
            </div>
            <div className=" flex justify-between">
              <p>کد اقتصادی :</p>

              <p>{user.economicCode}</p>
            </div>
            <div className=" flex justify-between">
              <p>موجودی کیف پول :</p>
               {(!wallet && !error) && <span className="loading loading-dots loading-lg"></span>} 
               {wallet?.money && <p>{wallet?.money}</p>}
            </div>
            <div className=" flex-col">
              <h3>روش بازگشت پول</h3>
              <div className=" flex justify-between">
                <p>شیوه انتخابی :</p>

                <p>{user.moneyReturn.method}</p>
              </div>
              <div className=" flex justify-between">
                <p>شماره کارت بانکی :</p>
                <p>{user.moneyReturn.bankAccount}</p>
              </div>
            </div>
            <div className=" flex-col">
                <h3>آدرس ها</h3>
                {user.addresses.map((address , index) =>{
                    return (
                    <div className=' m-3' key={index}>
                        {address.additionalInfo && <p>{address.additionalInfo}</p>}
                        <p>{address.city}</p>
                        <p>{address.postalCode}</p>
                        <p>{address.receiver.firstName+ " " + address.receiver.lastName}</p>
                        <p>{address.receiver.phoneNumber}</p>
                      </div>)
                })}
            </div>
          </div>
          {
            user.isBanned ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => unbanUser.mutate()}
              >
                لغو بن
              </button>
            ) : (
              <button
                className="btn btn-error"
                type="button"
                onClick={() => banUser.mutate()}
              >
                بن
              </button>
            )}
          <button
            className="btn btn-warning"
            type="button"
            onClick={closeModal}
          >
            خروج
          </button>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default UserPopUp;
