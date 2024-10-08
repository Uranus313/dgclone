'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetVerifyRequests from '../../../hooks/useGetVerifyRequests';
import { useUser } from "@/app/hooks/useUser";
import VerifyRequestPopUp from './VerifyRequestPopUp';
const VerifyRequestList = () => {
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let [state, setState] = useState<"pending" | "accepted" | "rejected">("pending");
  let { data: verifyRequests, error, isLoading } = useGetVerifyRequests({ floor: page * pageSize, limit: pageSize, nameSearch: search, state: state });
  useEffect(() => {
    console.log(error)
  }, [error])
  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white my-10 md:m-20 rounded-md '>

      {/* <button onClick={() => setState("pending")} className={state == "pending"? " btn btn-primary" : "btn btn-secondary"}>در انتظار</button>
            <button onClick={() => setState("accepted")} className={state == "accepted"? " btn btn-primary" : "btn btn-secondary"}>قبول شده</button>
            <button onClick={() => setState("rejected")} className={state == "rejected"? " btn btn-primary" : "btn btn-secondary"}>رد شده</button> */}

      <div className=' border-b-2 shadow-md border-white p-7 px-15 w-full' >
        <p> درخواست های تایید</p>
      </div>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        <div className=' flex-col'>


          <ul>
            <div className="flex justify-between py-8 text-center w-full">
              <p className="w-1/2 md:w-1/3">آی دی فروشنده</p>
              <p className="w-0 md:w-1/3 invisible md:visible ">تاریخ درخواست</p>
              <p className="w-1/2 md:w-1/3">وضعیت </p>
            </div>
            {verifyRequests?.data?.map((verifyRequest, index) => {
              return (
                <li key={index}>
                  <VerifyRequestPopUp verifyRequest={verifyRequest} />
                </li>
              )
            })}
          </ul>
          <div className='pb-4 flex justify-center'>

            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!verifyRequests?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default VerifyRequestList
