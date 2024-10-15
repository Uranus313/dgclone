'use client'
import React from 'react'
import ModalButton from '../addProducts/ModalButton'
import { productSaleAnalyseCard } from '@/app/components/Interfaces/interfaces'
import RadioOptions from './RadioOptions'
import useGetSellerAnalyseProducts from '@/app/hooks/useGetSellerAnalyseProducts'

// const productsCard:productSaleAnalyseCard[]=[
//     {
//         picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//         productCategoryID:'1',
//         productCategoryTitle:'لپتاپ',
//         productID:'3',
//         productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//         saleCount:20,
//         saleValue:30000000,
//         visits:312,

//     },
//     {
//         picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//         productCategoryID:'1',
//         productCategoryTitle:'لپتاپ',
//         productID:'3',
//         productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//         saleCount:20,
//         saleValue:30000000,
//         visits:312,

//     },
//     {
//         picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//         productCategoryID:'1',
//         productCategoryTitle:'لپتاپ',
//         productID:'3',
//         productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//         saleCount:20,
//         saleValue:30000000,
//         visits:312,

//     },
//     {
//         picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
//         productCategoryID:'1',
//         productCategoryTitle:'لپتاپ',
//         productID:'3',
//         productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
//         saleCount:20,
//         saleValue:30000000,
//         visits:312,

//     },
// ]

const SaleAnalyse = () => {
  const {data:productsCard} = useGetSellerAnalyseProducts()
  return (
<div className='bg-white mt-10 rounded-lg border border-grey-border p-5'>
        <h1 className='text-xl font-bold text-grey-dark'>فروش کالا</h1>
        <div className='py-5'>
          <label className="input w-full input-bordered flex items-center gap-2">
            <input type="text" className="grow " placeholder=" جستجو بر اساس نام یا شناسه کالا " />
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
        
        <div className='flex items-center border-b border-grey-border pb-4 mb-5'>


            <div className="dropdown mx-3">
            <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">مرتب سازی بر اساس</div>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                <RadioOptions name='saleAnalyseSortby' defaultChecked={true} id={"saleCount"} title={"تعداد فروش"} query='saleAnalyseSortby' />
                <RadioOptions name='saleAnalyseSortby' id={'saleValue'} title={"مبلغ فروش"} query='saleAnalyseSortby' />
                <RadioOptions name='saleAnalyseSortby' id={'visits'} title={"بازدید"} query='saleAnalyseSortby' />
            </div>
            </div>

            <div className="dropdown mx-3">
            <div tabIndex={1} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">ترتیب نمایش</div>
            <div tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                <RadioOptions name='showOrder' defaultChecked={true} id={"asc"} title={"صعودی"} query='showOrder' />
                <RadioOptions name='showOrder' id={'desc'} title={"نزولی"} query='showOrder' />

            </div>
            </div>
        </div>
  
        <div className='grid grid-cols-5 place-items-center gap-4 my-4 bg-primary-bg py-3 rounded-md'>
        <p className=''>نام کالا</p>
        <p>گروه کالایی</p>
        <p>مبلغ فروش </p>
        <p>تعداد فروش</p>
        <p>تعداد بازدید</p>
        </div>
        {productsCard?.map(productCard=>(
          <div className='grid grid-cols-5 place-items-center gap-4 my-4 border border-grey-border py-4 rounded-lg;'>
            <div className='grid grid-cols-2 place-items-center'>
              <img className='w-20 mx-2' src={productCard.picture}/>
              <div>
                <p className='line-clamp-2 h-fit text-sm'>{productCard.productTitle}</p>
                <p className='bg-propBubble-bg text-grey-dark my-2 w-fit px-2 py-1 rounded-full text-sm'>{productCard.productID}</p>
              </div>
            </div>
            <p>{productCard.categoryTitle}</p>
            <p>{productCard.totalSellPrice}</p>
            <p>{productCard.totalSellCount}</p>
            <p>{productCard.viewCount}</p>
          </div>
        ))}
      </div>
  )
}

export default SaleAnalyse