'use client'
import React, { useEffect, useState } from 'react'
import Checkbox from '../../products/Checkbox'
import FilterButton from '../../products/FilterButton'
import Link from 'next/link'
import { SellerAddProdctCard } from '@/app/components/Interfaces/interfaces'
import ModalButton from '../ModalButton'
import SellProductPopup from './SellProductPopup'
import useQueryNext from '@/app/hooks/useQueryNext'
import AddProductButton from './AddProductButton'
import AddNew from './AddNew'
import { useSearchParams } from 'next/navigation'
import useGetProductCards from '@/app/(Customer)/users/useGetProductCards'
import useGetProducts from '@/app/hooks/useGetProducts'
import InfiniteScroll from 'react-infinite-scroll-component'


// const productsCard:SellerAddProdctCard[]=[
//     {
//     title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//     productID:'55',
//     sellerCount:2,
//     picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//     commission:2,
//     urbanPrice:22000000,
//     id:'1',
//   },
//   {
//     title:'لپ تاپ 15.6 اینچی ایسوس مدلSSD-TN - کاستوم شده',
//     productID:'58',
//     sellerCount:10,
//     picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//     commission:2,
//     urbanPrice:22000000,
//     id:'2',
//   },
//   {
//     title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//     productID:'56',
//     sellerCount:11,
//     picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//     commission:2,
//     urbanPrice:22000000,
//     id:'3',
//   },
//   {
//     title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//     productID:'57',
//     sellerCount:12,
//     picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//     commission:2,
//     urbanPrice:22000000,
//     id:'4',
//   },
//   ]
  
  interface Filterables{
    categories:{title:string , categoryid:string}[]
    brands:string[]
  }


  
  const filterables:Filterables={
    categories:[
      {title:'لپ تاپ',categoryid:'2'},
      {title:'موبایل',categoryid:'3'},
    ],
    brands:["اپل","ایسوس","لنوو"]
  }
  
  const AddProductList = () => { 
    const {searchParams}= useQueryNext()
    const category = searchParams.get("category")
    const {data , error , isLoading , fetchNextPage , isFetchingNextPage } = useGetProducts({categoryID:category??'' , limit:10 , pageParamm:1 , sort:false})
    
    const totalFetchedGames =
    data?.pages.reduce((total, page) => total + page?.products?.length, 0) ||
    0;

    return (
      <div className='bg-white mt-10 rounded-lg border border-grey-border p-5'>
        <h1 className='text-xl font-bold text-grey-dark'>فروش کالا</h1>
        <div className='py-5'>
          <label className="input w-full input-bordered flex items-center gap-2">
            <input type="text" className="grow " placeholder=" جستجو... " />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
        
        <ModalButton title='ثبت کالای جدید' id='addNewProduct'/>

        <AddNew/>
  
        <div className='grid grid-cols-5 place-items-center gap-4 my-4 bg-primary-bg py-3 rounded-md'>
        <p className=''>عنوان کالا</p>
        <p>کمیسیون</p>
        <p>قیمت مرجع</p>
        <p>تعداد فروشندگان</p>
        </div>
        <InfiniteScroll
            dataLength={totalFetchedGames} //This is important field to render the next data
            next={() => fetchNextPage()}
            hasMore={data?.pages[data?.pages.length-1].hasMore??false}
            loader={<span className="loading loading-dots loading-lg"></span>}
            endMessage={
            <p style={{ textAlign: "center" }}>
                {!isLoading ?<b>رسیدی به تهش</b> : <span className="loading loading-dots loading-lg"></span>}
            </p>
            }
        >
        {data?.pages.map((page , index)=>(
          <React.Fragment key={index}>
            {page?.products?.map(productCard=>(
              <div className='grid grid-cols-5 place-items-center gap-4 my-4 border border-grey-border py-4 rounded-lg;'>
                <div className='grid grid-cols-2 place-items-center'>
                  <img className='w-20 mx-2' src={productCard.Picture}/>
                  <div>
                    <p className='line-clamp-2 h-fit text-md'>{productCard.Title}</p>
                    <p className='bg-propBubble-bg text-grey-dark my-2 w-fit px-2 py-1 rounded-full text-xs'>{productCard.ID}</p>
                  </div>
                </div>
                <p>{productCard.Commission}</p>
                <p>{productCard.UrbanPrice}</p>
                <p>{productCard.SellerCount}</p>
                <ModalButton id={`sellProduct`+productCard.ID} title='فروش همین کالا'/>
                <SellProductPopup id={`sellProduct`+productCard.ID} productCard={productCard}/>
                
              </div>))}
          </React.Fragment>
        ))}
        </InfiniteScroll>
      </div>
    )
  }
  

export default AddProductList