'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import useGetProducts from '../../hooks/useGetProducts';
import ProductPopUp from './ProductPopUp';



const ProductList = () => {

  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<number>(1);
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: products, error, isLoading } = useGetProducts({ sort: typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });

  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' bg-white rounded-md'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <input className='bg-primary-bg placeholder-neutral-700 px-6 py-2 rounded-md w-5/6' type="text" placeholder='جست و جو بر حسب نام محصول'
          ref={searchRef}
          onBlur={() => handleSearch()} />
      </form>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :

        <div className=' flex-col'>
          <ul>
            <div className="flex justify-between py-8 text-center">
              <p className="w-1/2">نام </p>
              <p className="w-1/2">امتیاز </p>
            </div>
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
