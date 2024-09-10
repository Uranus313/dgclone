import React from 'react'
import FilterButton from '../products/FilterButton'
import Link from 'next/link'
import { SellerOrderCard, State } from '@/app/components/Interfaces/interfaces'
import Checkbox from '../products/Checkbox'


const orderHistories:SellerOrderCard[]=[
    {
        title:"لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده",
        productID:"3",
        orderID:"1",
        orderDate:"2024/09/22 10:09:03",
        orderState:State.delivered,
        productPicture:"https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg",
        productCategorytitle:"لپتاپ",
        productCategoryID:"2",
        productFinalPrice:12100000,
    },
    {
        title:"لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده",
        productID:"3",
        orderID:"4",
        orderDate:"2024/09/22 10:09:03",
        orderState:State.delivered,
        productPicture:"https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg",
        productCategorytitle:"لپتاپ",
        productCategoryID:"2",
        productFinalPrice:12100000,
    },
    {
        title:"لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده",
        productID:"3",
        orderID:"3",
        orderDate:"2024/09/22 10:09:03",
        orderState:State.canceled,
        productPicture:"https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg",
        productCategorytitle:"لپتاپ",
        productCategoryID:"2",
        productFinalPrice:12100000,
    },
    {
        title:"لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده",
        productID:"3",
        orderID:"2",
        orderDate:"2024/09/22 10:09:03",
        orderState:State.returned,
        productPicture:"https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg",
        productCategorytitle:"لپتاپ",
        productCategoryID:"2",
        productFinalPrice:12100000,
    },
]

const OrderHistory = () => {
    return (
        <div className='bg-white mt-10 rounded-lg border border-grey-border p-5'>
          <h1 className='text-xl font-bold text-grey-dark'>مدیریت کالا ها</h1>
          <div className='py-5'>
            <label className="input w-full input-bordered flex items-center gap-2">
              <input type="text" className="grow " placeholder=" جستجو بر اساس نام یا شناسه ی کالا " />
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
          <div className='flex gap-3 mb border-b border-grey-border pb-5'>
            <div className='flex items-center mt-2 text-primary-seller'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <p className='mx-1'>فیلتر ها</p>
            </div>

            <div className="dropdown">
              <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">وضعیت تایید</div>
              <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <Checkbox index={0} id={State.canceled} title={State.canceled} query='state' />
                <Checkbox index={1} id={State.delivered} title={State.delivered} query='state' />
                <Checkbox index={2} id={State.returned} title={State.returned} query='state' />
                <Checkbox index={2} id={State.recivedInWareHouse} title={State.recivedInWareHouse} query='state' />
              </div>
            </div>
            
    
          </div>
    
          <div className='grid grid-cols-7 place-items-center gap-4 my-4 bg-primary-bg py-3 rounded-md'>
          <p className=''>عنوان کالا</p>
          <p>شناسه سفارش</p>
          <p>تاریخ سفارش</p>
          <p>وضعیت</p>
          <p>گروه کالایی</p>
          <p>قیمت نهایی</p>
          </div>
          {orderHistories.map(orderHistory=>(
            <div className='grid grid-cols-7 place-items-center gap-4 my-4 border border-grey-border py-4 rounded-lg;'>
              <div className='grid grid-cols-2 place-items-center'>
                <img className='w-20 mx-2' src={orderHistory.productPicture}/>
                <div>
                  <p className='line-clamp-2 h-fit text-sm'>{orderHistory.title}</p>
                  <p className='bg-propBubble-bg text-grey-dark my-2 w-fit px-2 py-1 rounded-full text-sm'>{orderHistory.productID}</p>
                </div>
              </div>
              <p>{orderHistory.orderID}</p>
              <p>{orderHistory.orderDate}</p>
              <p>{orderHistory.orderState}</p>
              <p>{orderHistory.productCategorytitle}</p>
              <p>{orderHistory.productFinalPrice}</p>
            </div>
          ))}
        </div>
      )
  
}

export default OrderHistory