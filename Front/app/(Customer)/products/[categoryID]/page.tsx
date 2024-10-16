'use client'
import ProductCard from '@/app/components/ProductCar/ProductCard'
import React, { useEffect, useState } from 'react'
import { ProductCardInterface, SellerAddProdctCard } from '@/app/components/Interfaces/interfaces'
import Link from 'next/link'
import { getCategory } from '@/app/Functions/ServerFunctions'
import Filter from './Filter'
import Sort from './Sort'
import InfiniteScrollProducts from './InfiniteScrollProducts'
import useQueryNext from '@/app/hooks/useQueryNext'

interface Props {
    params: {categoryID: string} 
    searchParams:{sortOrder: string}
}

const ProductPage = ({params:{categoryID},searchParams:{sortOrder}}:Props) => {
  // let category = await getCategory(categoryID)
  const [sort , setSort] = useState(sortOrder)
  const {searchParams} = useQueryNext()
  
  


  // server
  // const res = await fetch(`https://localhost:8080/products/product/?limit=12&offset=0&&CateID=${categoryID}&&SortMethod=${sortOrder}`)
  // const temp  = await res.json()
  // const products : SellerAddProdctCard[]|undefined = await temp.products


  return (
    <div>
      
      {/* <h1 className='mt-10 mb-8 mx-5 text-3xl font-black'>{category?.Title}</h1> */}
      <div className='grid grid-cols-12 gap-2 mx-5'>
        <div className='col-span-3  bg-white rounded-md'>
          <Filter/>
        </div>
        <div className='col-span-9'>
          <div className='flex mx-2 gap-5 items-center'>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 font-bold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
            </svg>

            <p className='font-bold'>مرتب سازی :</p>
            <Sort/>
          </div>
          {/* <div className=' grid grid-cols-3 mt-4 place-items-center'>
              {products?.map((product)=>(
                <Link href={`/products/${categoryID}/${product?.ID}`} className='m-2 p-4 bg-white rounded-md flex flex-col' key={product.ID}>
                  <img className='w-2/3 self-center mb-10 mt-3' src={product?.Picture}/>
                  <p className='text-lg font-semibold '>{product.Title}</p>
                  <p className='pt-3 text-primary-color text-lg'>{product.UrbanPrice}</p>
                </Link>
              )

              )}
          </div> */}
              <InfiniteScrollProducts categoryID={categoryID} startFromBeg={1} sort={sort}/>
        </div>
      </div>
    </div>
  )
}

export default ProductPage