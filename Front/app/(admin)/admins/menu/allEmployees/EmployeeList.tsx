'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetEmployees from '../../hooks/useGetEmployees';
import userContext from '@/app/contexts/userContext';
import EmployeePopUp from './EmployeePopUp';
import useGetRoles from '../../hooks/useGetRoles';
const EmployeeList = () => {
  let [pageSize,setPageSize] = useState<number>(2);
  let [page,setPage] = useState<number>(0);
  let [search,setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let {data: employees,error,isLoading} = useGetEmployees({floor:page * pageSize,limit:pageSize , nameSearch : search });
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
            {employees?.data?.map((employee,index) => {
                return(
                    // employee._id == user._id? null : <li key={index}>
                    //   <EmployeePopUp employee={employee}/>
                    //   </li>
                      <li key={index}>
                      <EmployeePopUp employee={employee} />
                      </li>
                )
            })}
            </ul>
            <button disabled={page == 0} onClick={() => setPage(page-1)} className='btn btn-primary'>قبلی</button>
            <button disabled={!employees?.hasMore} onClick={() => setPage(page+1)} className='btn btn-primary'>بعدی</button>
          </div>
        
        }
        
    </div>
  )
}

export default EmployeeList
