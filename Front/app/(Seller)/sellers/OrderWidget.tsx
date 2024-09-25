import { Seller } from '@/app/components/Interfaces/interfaces'
import React from 'react'


interface Props{
  seller:Seller|null
}
const OrderWidget = ({seller}:Props) => {
  const options = [{title:'تعهد ارسال گذشته و امروز',value:seller?.ordersInfo?.pastAndTodayShipmentCommitment},
    {title:'تعهد ارسال فردا به بعد',value:seller?.ordersInfo?.tomorrowAndFutureShipmentCommitment},
    {title:'سفارش‌های امروز',value:seller?.ordersInfo?.todaysOrders},
    {title:'سفارش‌های لغوشده',value:seller?.ordersInfo?.canceledOrders}
  ]
  return (
    <div>
        <h2 className='mt-2 font-semibold'>سفارش و تعهد ارسال</h2>
        <hr className='my-4 text-grey-border'></hr>
            {options.map(option=>(
              <div key={option.title} className='grid grid-cols-4 place-items-stretch'>
                <p className='mb-4 col-span-2'>{option.title}</p>
                <p>{option.value}</p>
                <button className='flex justify-end'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary-seller">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>

                </button>
              </div>
            ))}
    </div>
  )
}

export default OrderWidget