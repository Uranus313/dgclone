import { colorpallete } from '@/app/(Seller)/sellers/addProducts/list/SellProductPopup'
import { guaranteeOptions } from '@/app/(Seller)/sellers/addProducts/list/step1'
import { Order, State } from '@/app/components/Interfaces/interfaces'
import { forEach } from 'lodash'
import React from 'react'


const orders: Order[]=[
  {
    _id:'1' ,
    product:{
        productID:'2',
        productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل TUF Gaming F15 FX506HE-HN393W-i7 11800H 32GB 1SSD RTX3050Ti - کاستوم شده',
        price:19000000,
        color:{title:'قرمز' , hex:'#ad2432'},
        garantee:'گارانتی خوب',
        sellerid:'2',
        sellerTitle:'فروشگاه خوب',
        picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
    },
    quantity:1,
    userid:'1',
    state:State.pending,  
    ReciveDate:'',
  },
]

const OrderCart = () => {
  let finalPrice=0
  orders.forEach(order=>{
    finalPrice+= order.product.price
  })

  
  return (
    <div className='p-5'>
      <h1 className='text-2xl my-5' >سبد خرید</h1>
      <div className=' grid grid-cols-4 gap-4'>
        <div className='col-span-3'>
          {orders.map(order=>(
            <div className='grid gap-4 grid-cols-6 bg-white rounded-xl border border-grey-border p-5'>
              <div className='col-span-1'>
                <img src={order.product.picture}/>
              </div>

              <div className='col-span-5 mt-8'>
                <p>{order.product.productTitle}</p>
                <div className='flex mt-5'>
                  <div className='w-5 h-5 rounded-full border border-grey-border ml-3' style={{backgroundColor:order.product.color.hex}} />
                  <p className='text-sm text-grey-dark font-medium'>{order.product.color.title}</p>
                </div>
                <div className='flex mt-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-grey-dark ml-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>

                  <p className='text-sm text-grey-dark font-medium'>{order.product.garantee}</p>
                </div>
                <div className='flex mt-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-grey-dark ml-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>

                  <p className='text-sm text-grey-dark font-medium'>{order.product.sellerTitle}</p>
                </div> 
              </div>

              <div className='col-span-1 justify-self-center'>
                <button className='border rounded-lg flex items-center gap-3 p-3 border-grey-border'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-color">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                  <p className='text-xl text-primary-color'>{order.quantity}</p>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-color">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>

                </button>
              </div>

              <div className='col-span-5  self-center'>
                <p className='text-3xl'>{order.product.price} <span className='text-sm text-primary-color'>تومان</span> </p>
              </div>
            </div>
          ))}
        </div>

        <div className='col-span-1'>
          <div className='bg-white p-5 rounded-lg border border-grey-border'>
            <p>قیمت کل</p>
            <p>{finalPrice}تومان</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OrderCart