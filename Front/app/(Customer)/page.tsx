// 'use client'
import Image from 'next/image'
import Incredibles from '../components/Incredibles/Incredibles'
import BestProducts from '../components/BestProducts/BestProducts'
import useGetCategories from '../hooks/useGetCategories'
import { useState, useEffect } from 'react'
import useGetColors from '../hooks/useGetColors'

export interface detail {
  title: string,
  keys: string[]
}

export interface Category {
  ID?: string,
  Title: string,
  Childs?: Category[],
  Detail: detail[],
  CommisionPercentage: number,
  ParentID?: string,
  Pictures: string[],
  Description?: string,
  Link?: string,
  Theme?: string
}

export  let categories : Category[]

export default async function Home() {
  // const { data: Cate } = useGetCategories()
  // const [categories, setCategories] = useState<Category[]>([])

  // useEffect(() => {
  //   if (Cate) {
  //     setCategories(Cate)
  //   }
  // }, [Cate])

  
  //server
  const res = await fetch("https://localhost:8080/products/category")
  categories  = await res.json()

  // const res2 = await fetch("https://localhost:8080/products/salediscount/MostDiscounts")
  // const mostProducts  = await res2.json()
  // const res2 = await fetch("https://localhost:8080/products/salediscount/MostDiscounts")
  // const mostProducts  = await res2.json()


  // const rest = await fetch("https://localhost:8080/products/color")
  // const categoriets  = await res.json()




  return (
    <main className='overflow-auto h-fit'>
      <Image className='' src='/banner.png' width='2000' height='1000' alt='banner' />
      <div className='p-5 mt-10'>
        <Incredibles />
      </div>

      {/* <h1>{JSON.stringify(mostProducts)}</h1> */}
      <div className='p5 my-5'>
        <h1 className='text-black text-center text-xl pb-10'>خرید بر اساس دسته بندی</h1>

        <div className='flex justify-center'>
          {categories.map((category) => (
            <div className='mx-5' key={category.ID}>
              { category.Pictures.length>0 &&<img width='100px' src={category.Pictures[1]} alt={category.Title} />}
              <p className='text-center text-xs mt-3 font-semibold'>{category.Title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='p5 mb-5 mt-14'>
        <div className='flex justify-center my-5'>
          <h1 className='text-black text-xl'>پرفروش ترین ها</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-center mx-1 text-primary-color">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
          </svg>
        </div>
        <BestProducts filter='best-sellers' />
      </div>

      <div className='p5 mb-5 mt-14'>
        <div className='flex justify-center my-5'>
          <h1 className='text-black text-xl'>پرتخفیف ترین ها</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-center mx-1 text-primary-color">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <BestProducts filter='most-discounts' />
      </div>
    </main>
  )
}
