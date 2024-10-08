'use client'

import { useUser } from "@/app/hooks/useUser";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react';
import useGetAccessLevels from '../../../hooks/useGetAccessLevels';
import useGetRoleEmployeeCount from '../../../hooks/useGetRoleEmployeeCount';
import RoleEmployeePopUp from './RoleEmployeeListPopUp';
import { Role } from "@/app/components/Interfaces/interfaces";


export interface Props {
  role: Role
}
const RolePopUp = ({ role }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  let { data: accessLevelList, error: accessLevelError, isLoading: accessLevelIsLoading } = useGetAccessLevels();
  let { data: count, error: reError, isLoading } = useGetRoleEmployeeCount(role);


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
  const deleteRole = useMutation({
    mutationFn: async (roleID: string) => {
      const result = await fetch("http://localhost:3005/users/employee/roles/" + roleID, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        }
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
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
      // setUser(savedUser);
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
      <div onClick={openModal} className='px-20 flex border-b-2 border-border-color-list text-center'>
        <p className=' my-8 w-1/2 md:w-1/4 ml-14 md:mx-0'>{role.name}</p>
        <p className=' my-8 w-0 md:w-2/4 invisible md:visible'>{role._id}</p>

        {isLoading && <span className="loading loading-dots loading-lg my-8"></span>}
        {count?.count && <p className=' my-8 w-1/2 md:w-1/4'>{count?.count}</p>}

      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg">{role.name}</h3>

          <div className='block'>
            {accessLevelIsLoading && <span className="loading loading-dots loading-lg"></span>}
            {accessLevelList && role.accessLevels.map((accessLevel, index) =>
              <div className=' flex m-3' key={index}>
                {accessLevelList?.map((accessLevel2, index) => {
                  return accessLevel2.name == accessLevel.level && <p key={index}>{accessLevel2.title}</p>
                })}
                {accessLevel.writeAccess ? <p>&nbsp;: اجازه تغییر دارد </p> :
                  <p>&nbsp;: اجازه تغییر ندارد </p>
                }
              </div>)}
          </div>
          <div className="mt-5 flex justify-center ">
            <button className='btn  btn-error' type='button' onClick={() => deleteRole.mutate(role._id)}>حذف نقش</button>
            <div onClick={closeModal}>
              <RoleEmployeePopUp role={role} />
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

export default RolePopUp
