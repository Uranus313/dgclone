'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetOrders from '../../hooks/useGetOrders';
import OrderPopUp from './OrderPopUp';



const OrderList = () => {

  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<number>(1);
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let [state, setState] = useState<string>('2');
  let searchRef = useRef<any>('');
  let { data: orders, error, isLoading } = useGetOrders({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search, state: state });

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
    <div className=' bg-white rounded-md'>
      <div className='md:flex'>

      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}  className=' md:w-7/12 '>
        <input className='bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md' type="text" placeholder='جست و جو بر حسب نام محصول'
          ref={searchRef}
          onBlur={() => handleSearch()} />
      </form>
      <button onClick={() => { openModal() }} className=' md:w-4/12 bg-purple-box px-6 py-2 rounded-md mr-5 my-3 md:my-0'>انتخاب وضعیت</button>
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex justify-center">
          <div className="my-4 flex flex-col justify-center w-1/2">
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              setState('2');
            }}>در انتظار</button>
            <button className="rounded-md bg-purple-box px-6 py-3 " type="button" onClick={() => {
              closeModal();
              setState('4');
            }}>  برگشت خورده</button>
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              setState('1');
            }}> تحویل داده</button>
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              setState('5');
            }}> در انبار</button>
            <button className="rounded-md bg-purple-box px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              setState('3');
            }}> کنسل شده</button>
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
            <div className="flex justify-between py-8 text-center">
              <p className="w-1/2">  محصول </p>
              <p className="w-1/2"> امتیاز</p>
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
