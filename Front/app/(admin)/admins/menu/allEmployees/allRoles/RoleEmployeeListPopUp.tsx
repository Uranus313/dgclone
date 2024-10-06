'use client'

import userContext from '@/app/contexts/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react';
import useGetAccessLevels from '../../../hooks/useGetAccessLevels';
import useGetRoleEmployee from '../../../hooks/useGetRoleEmployee';
import { Role } from '@/app/components/Interfaces/interfaces';
import EmployeePopUp from '../EmployeePopUp';


export interface Props {
  role: Role
}
const RoleEmployeeListPopUp = ({ role }: Props) => {
  let [pageSize, setPageSize] = useState<number>(4);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  let { data: employees, error:eError, isLoading } = useGetRoleEmployee({roleID:role._id , floor: page * pageSize, limit: pageSize, nameSearch: search });
 


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
      <div onClick={openModal} >
        <button className='btn btn-primary text-black mx-3' type='button'>کارمندان</button>
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg">کارمندان {role.name}</h3>

          {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        // error && <p>{error.message}</p>
        <div className=' flex-col'>


          <ul>
            <div className="flex justify-between py-8 text-center">
              <p className="w-1/4">نام و نام خانوادگی</p>
              <p className="w-1/4">شماره تلفن</p>
              <p className="w-1/4">شغل </p>
              <p className="w-1/4">وضعیت</p>
            </div>
            {employees?.data?.map((employee, index) => {
              return (
                <li key={index}>
                  <EmployeePopUp employee={employee} />
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary '>قبلی</button>
            <button disabled={!employees?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary mx-3'>بعدی</button>
          <button className='btn btn-error' type='button' onClick={closeModal}>خروج</button>
          </div>
        </div>

      }
          <div className="mt-5 flex justify-center ">

          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
}

export default RoleEmployeeListPopUp
