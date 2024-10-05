'use client'

import { User } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
  admin: User
}
const AdminPopUp = ({ admin }: Props) => {
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
  const banAdmin = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/banAdmin", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ adminID: admin._id }),
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      admin.isBanned = true;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });
  const unbanAdmin = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/unbanAdmin", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ adminID: admin._id }),
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      admin.isBanned = false;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });

  return (
    <div>
      <div onClick={openModal} className=" flex py-5 border-b-2 border-b-border-color-list text-center">
        <p className="w-1/2 md:w-1/4">{admin.firstName + ' ' + admin.lastName}</p>
        <p className="w-0 md:w-1/4 invisible md:visible">{admin.phoneNumber}</p>
        <p className="w-0 md:w-1/4 invisible md:visible">{((admin.email && admin.email) || "-")}</p>
        {admin.isBanned ? (
          <p className="w-1/2 md:w-1/4 text-red-500">بن شده</p>
        ) : (
          <p className="w-1/2 md:w-1/4 text-red-500"> -</p>
        )}
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">{admin.firstName + ' ' + admin.lastName}</h3>
          <div className='block'>
            <div className=' flex justify-between pb-2'>
              <p>ایمیل :</p>

              <p>{admin.email}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>شماره تلفن :</p>

              <p>{admin.phoneNumber}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>کد ملی :</p>

              <p>{admin.nationalID}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>تاریخ تولد :</p>

              <p>{admin.birthDate}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>آیدی :</p>

              <p>{admin._id}</p>
            </div>
          </div>

          <div className="my-4 flex justify-center">
            {user &&
              <div>
                {admin._id != user._id && (admin.isBanned ? <button className='btn btn-primary' type='button' onClick={() => unbanAdmin.mutate()}>لغو بن</button> : <button className='btn btn-error' type='button' onClick={() => banAdmin.mutate()}>بن</button>)}
                <button className='btn btn-warning mx-3' type='button' onClick={closeModal}>خروج</button>
              </div>
            }

          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
}

export default AdminPopUp
