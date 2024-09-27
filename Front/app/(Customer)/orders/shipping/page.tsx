'use client'
import React, { useEffect, useState } from 'react'
import UserAddress from './UserAddress'
import Link from 'next/link'
import RecieveTime from './RecieveTime'
import { useOrderCart } from '@/app/hooks/useOrderCart'


const Shipping = () => {
  let [finalPrice , setFinalPrice ]= useState(0)
  const {orderCart , setOrderCart}=useOrderCart()
  useEffect(()=>{
    let tempFinalPrice=0
    orderCart.orders.forEach(order=>{
      tempFinalPrice += order.product.price * order.quantity
    })
    setFinalPrice(tempFinalPrice)
  },[orderCart])

  return (
    <div className='p-5 grid grid-cols-4 gap-4'>
        <h1 className='col-span-4 text-xl my-3'>آدرس و زمان ارسال</h1>
        <div className='col-span-3'>
          <UserAddress/>
          <RecieveTime/>
        </div>

        <div className='col-span-1'>
          <div className='bg-white p-5 rounded-lg border border-grey-border'>
            <div className='flex justify-between'>
              <p className='mb-3 text-xl'>قیمت کل</p>
              <p className='text-2xl'>{finalPrice}<span className='text-primary-color text-sm mx-2'>تومان</span></p>
            </div>
            <hr className='text-grey-border mb-7'></hr>
            <p className='mb-5 text-grey-dark'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline text-primary-color ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند
            </p>

            <Link href='/orders/checkout'>
              <button className='mt-10 bg-primary-color w-full text-white rounded-lg p-3'>
                    <p>ثبت سفارش</p>
              </button>
            </Link>

          </div>
        </div>  
      </div>  
  )
}

export default Shipping