'use client'
import React, { useContext, useEffect } from 'react'
import useGetAdmins from '../../hooks/useGetAdmins';
import userContext from '@/app/contexts/userContext';
import AdminPopUp from './AdminPopUp';
const AdminList = () => {
  let {data: admins,error,isLoading} = useGetAdmins();
  const { user} = useContext(userContext);
    useEffect(() =>{
        console.log(error)
    },[error])
  return (
    <>
        {isLoading? <span className="loading loading-dots loading-lg"></span> : 
        // error && <p>{error.message}</p>
        <ul>
            {admins?.map((admin,index) => {
                return(
                    admin._id == user._id? null : <AdminPopUp admin={admin}/>
                )
            })}
        </ul>
        }
        
    </>
  )
}

export default AdminList
