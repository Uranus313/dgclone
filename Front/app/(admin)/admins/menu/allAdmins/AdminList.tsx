'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetAdmins from '../../hooks/useGetAdmins';
import userContext from '@/app/contexts/userContext';
import AdminPopUp from './AdminPopUp';
const AdminList = () => {
  let [pageSize,setPageSize] = useState<number>(2);
  let [page,setPage] = useState<number>(0);
  let [search,setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let {data: admins,error,isLoading} = useGetAdmins({floor:page * pageSize,limit:pageSize , nameSearch : search });
    useEffect(() =>{
        console.log(error)
    },[error])
  function handleSearch(){
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }  
  return (
    <div className=' flex-col'>
      <form onSubmit={ (e) => {
              e.preventDefault();
              handleSearch();
            }} >
            <input type="text" placeholder='جست و جو بر حسب نام خانوادگی'
            ref={searchRef}
            onBlur={() => handleSearch() } />
            </form>
        {isLoading? <span className="loading loading-dots loading-lg"></span> : 
        // error && <p>{error.message}</p>
          <div className=' flex-col'>
            
            
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
            <button disabled={page == 0} onClick={() => setPage(page-1)} className='btn btn-primary'>قبلی</button>
            <button disabled={!admins?.hasMore} onClick={() => setPage(page+1)} className='btn btn-primary'>بعدی</button>
          </div>
        
        }
        
    </div>
  )
}

export default AdminList
