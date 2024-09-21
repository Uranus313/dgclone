'use client'

import userContext from '@/app/contexts/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import useGetRoles from '../../hooks/useGetRoles';
import { Employee } from './EmployeePopUp';


export interface Props {
  employee: Employee
}
const ChangeRolePopUp = ({ employee }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);

  const [showAcceptButton, setShowAcceptButton] = useState<boolean>(false);
  let { data: roleList, error: roleError, isLoading: roleIsLoading } = useGetRoles();

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
  const changeRole = useMutation({
    mutationFn: async () => {
      const result = await fetch("http://localhost:3005/users/admin/changeEmployeeRole", {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ employeeID: employee._id, roleID: selectedRole }),
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
      queryClient.invalidateQueries({ queryKey: ["employeeList"] });

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
    <div className='mx-3'>
      <button onClick={openModal} className='btn btn-primary'>تغییر نقش</button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg pb-2">{employee.firstName + ' ' + employee.lastName}</h3>
          <div className='block'>
            <div className='flex pb-3'>
              <p className='w-1/4'>نقش فعلی :</p>

              <p>{employee.roleID?.name}</p>
            </div>
            {roleIsLoading && (
              <span className="loading loading-dots loading-lg"></span>
            )}
            {!roleIsLoading && (
              <select className="select w-full max-w-xs mb-3" onChange={(e) => {
                if (e.target.value == "null######") {
                  setSelectedRole(undefined);
                } else {
                  setSelectedRole(e.target.value);
                }
                setShowAcceptButton(true);
              }}>
                <option disabled selected>
                  نقش
                </option>
                <option value={"null######"}>بدون نقش</option>
                {roleList?.map((role, index) => <option key={index} value={role._id}>{role.name}</option>)}
              </select>
            )}
          </div>
          {showAcceptButton && <button className='btn btn-warning' type='button' onClick={() => {
            if (employee.roleID?._id == selectedRole) {
              closeModal();
              return;
            }
            changeRole.mutate()
          }}>تایید</button>}
          <button className='btn btn-warning mx-1' type='button' onClick={closeModal}>خروج</button>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ChangeRolePopUp
