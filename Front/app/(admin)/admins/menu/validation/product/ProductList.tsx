'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetPendingProducts from '../../../hooks/useGetPendingProducts';
import ProductPopUp from './ProductPopUp';

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
  let { data: products, error, isLoading } = useGetPendingProducts({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });


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


  return (
    <div className=' flex-col bg-white my-10 md:m-20 rounded-md'>
      <form onSubmit={(e) => {
        e.preventDefault();
      }} className='border-b-2 shadow-md border-white p-7 px-13' >
        <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black'>
          <option value="comments">کامنت ها</option>
          <option value="products" selected>محصولات</option>

        </select>
      </form>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
        <div className=' flex-col'>

          <ul>
            {products?.products?.map((product, index) => {
              return (
                <li key={index}>
                  <ProductPopUp product={product} />
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
