'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import SellerPopUp from './SellerPopUp';
import useGetSellers from '../../hooks/useGetSellers';

const SellerList = () => {
  let [typeSort, setTypeSort] = useState<string>("none");
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: sellers, error, isLoading } = useGetSellers({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });


  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white my-20  rounded-md'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <input className='bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md w-5/6' type="text" placeholder='جست و جو بر حسب نام و نام خانوادگی'
          ref={searchRef}
          onBlur={() => handleSearch()} />
      </form>
      
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        <div className=' flex-col'>
          <ul>
            <div className="flex justify-between py-8 text-center">
              <p className="w-1/3">نام و نام خانوادگی</p>
              <p className="w-1/3">تاییدیه </p>
              <p className="w-1/3">وضعیت</p>
            </div>
            {sellers?.data?.map((seller, index) => {
              return (
                <li key={index}>
                  <SellerPopUp seller={seller} />
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center pb-5'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!sellers?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default SellerList
