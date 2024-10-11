'use client'

import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import useGetRoles from '../../hooks/useGetRoles';
import ChangeRolePopUp from './ChangeRolePopUp';
import { User } from "@/app/components/Interfaces/interfaces";

export interface Props {
  employee: User
}

const EmployeePopUp = ({ employee }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  // let {data: roleList,error : roleError,isLoading : roleIsLoading} = useGetRoles(); 

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
  const banEmployee = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/banEmployee", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ employeeID: employee._id }),
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
      employee.isBanned = true;
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message);
    }
  });
  const unbanEmployee = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/unbanEmployee", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ employeeID: employee._id }),
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
      // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
      // queryClient.invalidateQueries(["user"]);
      // setUser(savedUser);
      employee.isBanned = false;
      closeModal();
      // router.push('/');
      // router.push('/');
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
      // setError(error)
    }
  });

  return (
    <div>
      <div onClick={openModal}
        className=" flex py-5 border-b-2 border-b-border-color-list text-center">
        <p className="w-1/2 md:w-1/4">{employee.firstName + ' ' + employee.lastName}</p>
        <p className="w-0 md:w-1/4 invisible md:visible">{employee.phoneNumber}</p>
        <p className="w-0 md:w-1/4 invisible md:visible">{employee.roleID?.name}</p>
        {employee.isBanned ? (
          <p className="w-1/2 md:w-1/4 text-red-500">بن شده</p>
        ) : (
          <p className="w-1/2 md:w-1/4 text-red-500"> -</p>
        )}
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">{employee.firstName + ' ' + employee.lastName}</h3>
          <div className='block'>
            <div className=' flex justify-between pb-2'>
              <p>ایمیل :</p>

              <p>{employee.email}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>شماره تلفن :</p>

              <p>{employee.phoneNumber}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>کد ملی :</p>

              <p>{employee.nationalID}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>تاریخ تولد :</p>

              <p>{employee.birthDate}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>آیدی :</p>
              <p>{employee._id}</p>
            </div>
            <div className=' flex justify-between pb-2'>
              <p>شغل :</p>
              <p>{employee.roleID?.name}</p>
            </div>
          </div>
          <div className='my-4 flex justify-center'>
            {user && 
            <div>
              {employee._id != user._id && (employee.isBanned ? <button className='btn btn-primary' type='button' onClick={() => unbanEmployee.mutate()}>لغو بن</button> : 
              <button className='btn btn-error' type='button' onClick={() => banEmployee.mutate()}>بن</button>)}
            </div>
            }
          <div onClick={closeModal}>
            <ChangeRolePopUp employee={employee} />
          </div>
          <button className='btn btn-warning' type='button' onClick={closeModal}>خروج</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
}

export default EmployeePopUp
