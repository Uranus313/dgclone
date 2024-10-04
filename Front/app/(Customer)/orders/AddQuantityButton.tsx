'use client'
import { useOrderCart } from '@/app/hooks/useOrderCart'
import React from 'react'

interface Props{
    index:number
}
const AddQuantityButton = ({index}:Props) => {
  const {orderCart , setOrderCart}= useOrderCart()

  return (
    
    <div className='border rounded-lg flex items-center gap-3 p-3 border-grey-border'>
        {orderCart.orders[index].quantity == 1 
        
        ? <button onClick={()=>setOrderCart({...orderCart, orders:orderCart.orders.filter((_, i) => i !== index)})      
        }>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-color">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>

        :   <button onClick={()=>setOrderCart(
                prevOrders => {
                    const newOrders = [...prevOrders.orders];
                    newOrders[index] = { ...newOrders[index], quantity:newOrders[index]?.quantity-1 };
                    return { ...prevOrders, orders: newOrders };
                    })      
                }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-color">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>

            </button>
        }

        <p className='text-xl text-primary-color'>{orderCart.orders[index]?.quantity}</p>

        <button onClick={()=>setOrderCart(
                  prevOrders => {
                    const newOrders = [...prevOrders.orders];
                    newOrders[index] = { ...newOrders[index], quantity:newOrders[index]?.quantity+1 };
                    return { ...prevOrders, orders: newOrders };
                })      
        }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-color">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </button>
  </div>
  )
}

export default AddQuantityButton