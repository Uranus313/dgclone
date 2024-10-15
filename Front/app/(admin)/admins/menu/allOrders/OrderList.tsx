'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetOrders from '../../hooks/useGetOrders';
import OrderPopUp from './OrderPopUp';
interface Props {
  changeList: (list: string) => void
}

const OrderList = ({ changeList }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<number>(1);
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: orders, error, isLoading } = useGetOrders({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });

  function handleSort(type: number) {
    setTypeSort(type);
  }
  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white my-10 md:m-20 rounded-md '>
      <div className='flex border-b-2 shadow-md border-white p-7 px-13 w-full'>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className='w-8/12'>
          <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black'>
            <option value="users">کاربران</option>
            <option value="employees">کارمندان</option>
            <option value="admins" > ادمین ها</option>
            <option value="orders" defaultChecked>سفارش ها</option>
            <option value="sellers" >فروشندگان</option>
            <option value="products">محصولات</option>
            <option value="transactions"> تراکنش ها</option>
          </select>
          <input className='mt-6 mr-6 lg:mt-0 lg:mr-0 lg:w-4/6 bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md' type="text" placeholder='جست و جو بر حسب نام محصول  '
            ref={searchRef}
            onBlur={() => handleSearch()} />
        </form>
          <button onClick={() => { openModal() }} className='w-0 h-0 lg:w-auto lg:h-auto bg-purple-box lg:px-8 lg:py-2 rounded-md lg:mx-20 invisible lg:visible'>مرتب سازی</button>
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex justify-center">
          <div className="my-4 flex flex-col justify-center w-1/2">
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              handleSort(1);
            }}>اسم محصول</button>
            <button className="rounded-md bg-purple-box px-6 py-3 " type="button" onClick={() => {
              closeModal();
              handleSort(2);
            }}>  امتیاز</button>
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              handleSort(3);
            }}> تاریخ سفارش</button>
            <button className="btn btn-warning  " type="button" onClick={closeModal}>خروج</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        <div className=' flex-col'>

          <ul>
            <div className="flex md:justify-between py-8 text-center">
              <p className="w-1/2 md:w-1/3"> نام محصول </p>
              <p className="w-1/2 md:w-1/3"> امتیاز</p>
              <p className="w-0 md:w-1/3 invisible md:visible">تاریخ سفارش </p>
            </div>
            {orders?.orders?.map((order, index) => {
              return (
                <li key={index}>
                  <OrderPopUp order={order} />
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center pb-5'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!orders?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default OrderList
