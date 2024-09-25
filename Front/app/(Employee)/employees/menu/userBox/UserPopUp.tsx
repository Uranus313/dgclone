"use client";

import { Wallet } from "@/app/(Customer)/users/menu/layout";
import userContext from "@/app/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { Employee } from "../../page";

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
  oneUser: User;
}
const UserPopUp = ({ oneUser }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, isLoading } = useContext(userContext) as { user: Employee; setUser: (user: Employee) => void; isLoading: boolean };


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

        body: JSON.stringify({ userID: oneUser._id }),
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
      oneUser.isBanned = true;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
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

          body: JSON.stringify({ userID: oneUser._id }),
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
      oneUser.isBanned = false;
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
        getWallet(oneUser.walletID);
      }} className=" flex py-5 border-b-2 border-b-border-color-list text-center">

        <p className="w-1/3">{((oneUser.firstName && oneUser.firstName) || "-") + ((oneUser.lastName && " " + oneUser.lastName) || " -")}</p>
        <p className="w-1/3">{oneUser.phoneNumber}</p>
        {oneUser.isBanned ? (
          <p className="w-1/3 text-red-500">بن شده</p>
        ) : (
          <p className="w-1/3 text-red-500"> -</p>
        )}

      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">
            {((oneUser.firstName && oneUser.firstName) || "") + ((oneUser.lastName && " " + oneUser.lastName) || "")}
          </h3>
          <div className="block">
            <div className=" flex justify-between pb-2">
              <p>ایمیل :</p>

              <p>{oneUser.email}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>شماره تلفن :</p>

              <p>{oneUser.phoneNumber}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کد ملی :</p>

              <p>{oneUser.nationalID}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>تاریخ تولد :</p>

              <p>{oneUser.birthDate}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>آیدی :</p>

              <p>{oneUser._id}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کار :</p>

              <p>{oneUser.job}</p>
            </div>
            <div className=" flex justify-between pb-2">
              <p>کد اقتصادی :</p>

              <p>{oneUser.economicCode}</p>
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

                <p>{oneUser.moneyReturn.method}</p>
              </div>
              <div className=" flex justify-between pb-2">
                <p>شماره کارت بانکی :</p>
                <p>{oneUser.moneyReturn.bankAccount}</p>
              </div>
            </div>
            <div className=" flex-col pb-2 text-right">
              <h3>آدرس ها</h3>
              {oneUser.addresses.map((address, index) => {
                return (
                  <div className=' m-3' key={index}>
                    <p>{index + 1}.</p>
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
            {user.roleID.accessLevels && user.roleID.accessLevels.some(accessLevel => accessLevel.level === "userManage" && accessLevel.writeAccess === true) &&
              <div>
                {
                  oneUser.isBanned ? (
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
                  )
                }
              </div>

            }

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
