"use client";

import { Wallet } from "@/app/(Customer)/users/menu/layout";
import { User } from "@/app/components/Interfaces/interfaces";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";


export interface Props {
  user: User;
}
const UserPopUp = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
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
  async function getWallet(id: string) {
    if (!id) {
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
      user.isBanned = false;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    },
  });

  return (
    <div >
     
      <div onClick={() => {
        openModal();
        getWallet(user.walletID);
      }} className=" flex py-5 border-b-2 border-b-border-color-list text-center">

        <p className="w-1/4">{((user.firstName && user.firstName) || "-") + ((user.lastName && " " + user.lastName) || " -")}</p>
        <p className="w-1/4">{user.phoneNumber}</p>
        <p className="w-1/4">{((user.email && user.email) || "-")}</p>
        {user.isBanned ? (
          <p className="w-1/4 text-red-500">بن شده</p>
        ) : (
          <p className="w-1/4 text-red-500"> -</p>
        )}
        
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">
            {((user.firstName && user.firstName) || "") + ((user.lastName && " " + user.lastName) || "")}
          </h3>
          <div className="block">
            <div className=" flex justify-between pb-2">
              <p>ایمیل :</p>

              <p>{user.email}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>شماره تلفن :</p>

              <p>{user.phoneNumber}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کد ملی :</p>

              <p>{user.nationalID}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>تاریخ تولد :</p>

              <p>{user.birthDate}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>آیدی :</p>

              <p>{user._id}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کار :</p>

              <p>{user.job}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کد اقتصادی :</p>

              <p>{user.economicCode}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>موجودی کیف پول :</p>
              {(!wallet && !error) && <span className="loading loading-dots loading-lg"></span>}
              {wallet?.money && <p>{wallet?.money}</p>}
            </div>
            <div className=" flex-col">
              <h3>روش بازگشت پول</h3>
              <div className=" flex justify-between pb-2">
                <p>شیوه انتخابی :</p>

                <p>{user.moneyReturn.method}</p>
              </div>
              <div className=" flex justify-between pb-2">
                <p>شماره کارت بانکی :</p>
                <p>{user.moneyReturn.bankAccount}</p>
              </div>
            </div>
            <div className=" flex-col pb-2">
              <h3>آدرس ها</h3>
              {user.addresses.map((address, index) => {
                return (
                  <div className=' m-3' key={index}>
                    {address.additionalInfo && <p>{address.additionalInfo}</p>}
                    <p>{address.city}</p>
                    <p>{address.postalCode}</p>
                    <p>{address.receiver.firstName + " " + address.receiver.lastName}</p>
                    <p>{address.receiver.phoneNumber}</p>
                  </div>)
              })}
            </div>
          </div>
          <div className="my-4 flex justify-center">
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

export default UserPopUp;
