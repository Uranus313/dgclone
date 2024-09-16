'use client'
import React, { useContext, useEffect, useState } from 'react'
import useGetAdmins from '../../hooks/useGetAdmins';
import userContext from '@/app/contexts/userContext';
import AdminPopUp from './AdminPopUp';
const AdminList = () => {
  let [pageSize,setPageSize] = useState<number>(2);
  let [page,setPage] = useState<number>(0);
  let {data: admins,error,isLoading} = useGetAdmins({floor:page * pageSize,limit:pageSize});
    useEffect(() =>{
        console.log(error)
    },[error])
  return (
    <div className=' flex-col'>
        {isLoading? <span className="loading loading-dots loading-lg"></span> : 
        // error && <p>{error.message}</p>
        <ul>
            {admins?.data?.map((admin,index) => {
                return(
                    // admin._id == user._id? null : <li key={index}>
                    //   <AdminPopUp admin={admin}/>
                    //   </li>
                      <li key={index}>
                      <AdminPopUp admin={admin}/>
                      </li>
                )
            })}
        </ul>
        }
        <button disabled={page == 0} onClick={() => setPage(page-1)} className='btn btn-primary'>قبلی</button>
        <button disabled={!admins?.hasMore} onClick={() => setPage(page+1)} className='btn btn-primary'>بعدی</button>
    </div>
  )
}

export default AdminList
