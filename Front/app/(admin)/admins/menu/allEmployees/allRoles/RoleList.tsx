'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetRoles from '../../../hooks/useGetRoles';
import userContext from '@/app/contexts/userContext';
import RolePopUp from './RolePopUp';
import AddRolePopUp from './AddRolePopUp';
const RoleList = () => {
  let [pageSize,setPageSize] = useState<number>(2);
  let [page,setPage] = useState<number>(0);
  let [search,setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let {data: roles,error,isLoading} = useGetRoles();
    useEffect(() =>{
        console.log(error)
    },[error])

  return (
    <div className=' flex-col'>
        {isLoading? <span className="loading loading-dots loading-lg"></span> : 
        // error && <p>{error.message}</p>
          <div className=' flex-col'>
            
            
            <ul>
            {roles?.map((role,index) => {
                return(
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
