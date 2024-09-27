'use client'
import { useUser } from '@/app/hooks/useUser'
import React, { useEffect, useState } from 'react'
import OrderCart from '../page'
import { useOrderCart } from '@/app/hooks/useOrderCart'

const CheckOut = () => {
    const {orderCart} = useOrderCart()
    let [finalPrice , setFinalPrice ]= useState(orderCart.price)

 
  return (
    <div className='p-5'>
        <h1 className=' mb-5 text-2xl '>پرداخت</h1>
        <div className=' grid grid-cols-4 gap-4'>
            <div className='col-span-3'>

                <div className='bg-white rounded-lg border border-grey-border p-5 pb-8 mb-4'>
                    <p className='text-lg font-semibold mb-10'>انتخاب روش پرداخت</p>

                    <div className="form-control mb-10">
                        <label className="flex gap-2 items-center">
                            <input type="radio" name="paymentMethod" className="radio checked:bg-primary-color" defaultChecked />
                            <div className='flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                                <div>
                                    <p className="text-lg mb-2">پرداخت اینترنتی</p>
                                    <p className='text-grey-dark'>پرداخت آنلاین با تمامی کارت‌های بانکی</p>
                                </div>
            
                            </div>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="flex gap-2 items-center">
                            <input type="radio" name="paymentMethod" className="radio checked:bg-primary-color"  />
                            <div className='flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                                <div>
                                    <p className="text-lg mb-2">پرداخت از کیف پول</p>
                                    <p className='text-grey-dark'>الان بخر، بعدا پرداخت کن</p>
                                </div>
            
                            </div>
                        </label>
                    </div>

                </div>

                <div className='bg-white rounded-lg border border-grey-border p-5 mb-4'>
                    <p className='text-lg font-semibold mb-10'>کد تخفیف</p>
                    <input type="text" placeholder="وارد کردن کد تخفیف" className="input input-bordered w-full max-w-96" />
                    <button className='text-white bg-primary-color px-8 py-2 rounded-md mr-4'>ثبت</button>

                </div>

                <div className='bg-white rounded-lg border border-grey-border p-5 mb-4'>
                    <p className='text-lg font-semibold mb-10'>کارت هدیه</p>
                    <input type="text" placeholder="وارد کردن کد کارت هدیه" className="input input-bordered w-full max-w-96" />
                    <button className='text-white bg-primary-color px-8 py-2 rounded-md mr-4'>ثبت</button>

                </div>
                <div className='bg-white rounded-lg border border-grey-border p-5 mb-4'>
                    <p className='text-lg font-semibold mb-10'>خلاصه ی سفارش</p>
                    <p>{orderCart.recievedate}</p>
                    <p>{orderCart.price}</p>
                    <p>{orderCart.address?.additionalInfo}</p>
                    {orderCart.orders.map(order=>(
                        <div>
                            {order.product.productTitle}
                        </div>
                    ))}

                </div>
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

            <button  className='mt-10 bg-primary-color w-full text-white rounded-lg p-3'>
                  <p>تایید و تکمیل سفارش</p>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOut