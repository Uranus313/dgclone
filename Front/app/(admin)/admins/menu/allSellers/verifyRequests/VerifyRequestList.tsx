'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetVerifyRequests from '../../../hooks/useGetVerifyRequests';
import { useUser } from "@/app/hooks/useUser";
import VerifyRequestPopUp from './VerifyRequestPopUp';
const VerifyRequestList = () => {
  let [pageSize,setPageSize] = useState<number>(2);
  let [page,setPage] = useState<number>(0);
  let [search,setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let [state, setState] = useState<"pending" | "accepted" | "rejected" >("pending");
  let {data: verifyRequests,error,isLoading} = useGetVerifyRequests({floor:page * pageSize,limit:pageSize , nameSearch : search , state : state });
    useEffect(() =>{
        console.log(error)
    },[error])
  function handleSearch(){
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }  
  return (
    <div className=' flex-col'>
        <div className='flex'>
            <button onClick={() => setState("pending")} className={state == "pending"? " btn btn-primary" : "btn btn-secondary"}>در انتظار</button>
            <button onClick={() => setState("accepted")} className={state == "accepted"? " btn btn-primary" : "btn btn-secondary"}>قبول شده</button>
            <button onClick={() => setState("rejected")} className={state == "rejected"? " btn btn-primary" : "btn btn-secondary"}>رد شده</button>

        </div>
        {isLoading? <span className="loading loading-dots loading-lg"></span> : 
        // error && <p>{error.message}</p>
          <div className=' flex-col'>
            
            
            <ul>
            {verifyRequests?.data?.map((verifyRequest,index) => {
                return(
                    // verifyRequest._id == user._id? null : <li key={index}>
                    //   <VerifyRequestPopUp verifyRequest={verifyRequest}/>
                    //   </li>
                      <li key={index}>
                      <VerifyRequestPopUp verifyRequest={verifyRequest}/>
                      </li>
                )
            })}
            </ul>
            <button disabled={page == 0} onClick={() => setPage(page-1)} className='btn btn-primary'>قبلی</button>
            <button disabled={!verifyRequests?.hasMore} onClick={() => setPage(page+1)} className='btn btn-primary'>بعدی</button>
          </div>
        
        }
        
    </div>
  )
}

export default VerifyRequestList
