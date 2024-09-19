'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetRoles from '../../../hooks/useGetRoles';
import userContext from '@/app/contexts/userContext';
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
          <div className="flex justify-between py-8 font-bold px-20  border-b-2 border-border-color-list">
              <p className="w-1/3">شغل </p>
              <p className="w-1/3"> آی دی</p>
              <p className="w-1/3">تعداد </p>
            </div>
            {roles?.map((role, index) => {
              return (
                // role._id == user._id? null : <li key={index}>
                //   <RolePopUp role={role}/>
                //   </li>
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
