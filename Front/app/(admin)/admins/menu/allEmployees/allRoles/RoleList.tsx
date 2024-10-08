'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetRoles from '../../../hooks/useGetRoles';
import { useUser } from "@/app/hooks/useUser";
import RolePopUp from './RolePopUp';
import AddRolePopUp from './AddRolePopUp';

const RoleList = () => {
  let [pageSize, setPageSize] = useState<number>(2);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: roles, error, isLoading } = useGetRoles();
  
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div className=' flex-col '>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        // error && <p>{error.message}</p>
        <div className=' flex-col my-8'>
          <ul>
          <div className="flex md:justify-between py-8 font-bold px-20  border-b-2 border-border-color-list text-center">
              <p className="w-1/2 md:w-1/4 ml-14 md:mx-0">شغل </p>
              <p className="w-0 md:w-2/4 invisible md:visible"> آی دی</p>
              <p className="w-1/2 md:w-1/4 ">تعداد </p>
            </div>
            {roles?.map((role, index) => {
              return (
                <li key={index}>
                  <RolePopUp role={role} />
                </li>
              )
            })}
          </ul>
        </div>

      }

    </div>
  )
}

export default RoleList
