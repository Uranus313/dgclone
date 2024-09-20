'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetSellers from '../../hooks/useGetSellers';
import SellerPopUp from './SellerPopUp';
interface Props{
  changeList: ( list: string) => void
}

const SellerList = ({changeList}:Props) => {
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: sellers, error, isLoading } = useGetSellers({ floor: page * pageSize, limit: pageSize, nameSearch: search });
  // useEffect(() =>{
  //     console.log(error)
  // },[error])
  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white m-20 p-5 px-13 rounded-md'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }} >
        <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black'>
          <option value="users">کاربران</option>
          <option value="employees">کارمندان</option>
          <option value="admins" > ادمین ها</option>
          <option value="orders">سفارش ها</option>
          <option value="sellers" selected>فروشندگان</option>
          <option value="products">محصولات</option>
          <option value="transactions"> تراکنش ها</option>
        </select>
        <input className='w-3/6 bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md' type="text" placeholder='جست و جو بر حسب نام و نام خانوادگی'
          ref={searchRef}
          onBlur={() => handleSearch()} />
        <button className='bg-blue-box px-8 py-2 rounded-md mx-20'>مرتب سازی</button>
      </form>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        // error && <p>{error.message}</p>
        <div className=' flex-col'>

          <ul>
            <div className="flex justify-between py-8">
              <p className="w-1/4">نام و نام خانوادگی</p>
              <p className="w-1/4">شماره تلفن</p>
              <p className="w-1/4">تاییدیه </p>
              <p className="w-1/4">وضعیت</p>
            </div>
            {sellers?.data?.map((seller, index) => {
              return (
                // admin._id == seller._id? null : <li key={index}>
                //   <AdminPopUp admin={admin}/>
                //   </li>
                <li key={index}>
                  <SellerPopUp seller={seller} />
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!sellers?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default SellerList
