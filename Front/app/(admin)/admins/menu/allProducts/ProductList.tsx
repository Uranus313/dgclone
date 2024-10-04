'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetProducts from '../../hooks/useGetProducts';
interface Props {
  changeList: (list: string) => void
}

const ProductList = ({ changeList }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<string>("none");
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: products, error, isLoading } = useGetProducts({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });

  function handleSort(type: string) {
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
    <div className=' flex-col bg-white m-20  rounded-md'>
      <div className='flex border-b-2 shadow-md border-white p-7 px-13 w-full'>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className='w-8/12'>
          <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black text-center'>
            <option value="users">کاربران</option>
            <option value="employees">کارمندان</option>
            <option value="admins" > ادمین ها</option>
            <option value="orders">سفارش ها</option>
            <option value="sellers" >فروشندگان</option>
            <option value="products" selected>محصولات</option>
            <option value="transactions"> تراکنش ها</option>
          </select>
          <input className='w-4/6 bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md' type="text" placeholder='جست و جو بر حسب نام و نام خانوادگی'
            ref={searchRef}
            onBlur={() => handleSearch()} />
        </form>
          <button onClick={() => { openModal() }} className='bg-primary-color px-8 py-2 rounded-md mx-20'>مرتب سازی</button>
      </div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex justify-center">
          <div className="my-4 flex flex-col justify-center w-1/2">
            <button className="rounded-md bg-primary-color px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              handleSort("lastName");
            }}>نام</button>
            <button className="rounded-md bg-primary-color px-6 py-3 " type="button" onClick={() => {
              closeModal();
              handleSort("phoneNumber");
            }}> برند</button>
            <button className="rounded-md bg-primary-color px-6 py-3 my-3" type="button" onClick={() => {
              closeModal();
              handleSort("phoneNumber");
            }}> امتیاز</button>
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
              <p className="w-1/4">نام </p>
              <p className="w-1/4"> برند</p>
              <p className="w-1/4">وزن </p>
              <p className="w-1/4">امتیاز </p>
            </div>
            {products?.data?.map((product, index) => {
              return (
                <li key={index}>
                  yes
                  {/* <ProductPopUp product={product} /> */}
                </li>
              )
            })}
          </ul>
          <div className='my-4 flex justify-center pb-5'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!products?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>
        </div>

      }

    </div>
  )
}

export default ProductList
