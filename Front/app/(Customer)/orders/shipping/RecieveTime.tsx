'use client'
import { useOrderCart } from '@/app/hooks/useOrderCart';
import React, { useEffect, useState } from 'react'

const RecieveTime = () => {
    const today = new Date();
    const nextFiveDays = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const {orderCart , setOrderCart} = useOrderCart()
    
    for (let i = 0; i < 5; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        const dayName = dayNames[nextDay.getDay()];
        nextFiveDays.push({ date: nextDay, dayName });
    }

    const [selectedDate , setSelectedDate] = useState<{date: Date; dayName: string;}>(nextFiveDays[0])
    
    useEffect(()=>{
        setOrderCart({...orderCart ,recievedate:selectedDate?.date.toISOString().split('T')[0]??'' })
    },[selectedDate])
  

  return (
    <div className='mt-5 p-5 bg-white border border-grey-border rounded-lg'>
        <h2 className='text-lg'>انتخاب زمان تحویل</h2>
        {selectedDate? <p className='my-3'> بسته ی شما در تاریخ  {selectedDate?.date.toISOString().split('T')[0]} روز {selectedDate?.dayName} تحویل خواهد شد</p>
         : <p className='my-3'>تاریخی انتخاب نشده‌ است</p>}
        <div className='flex mt-5'>
            {nextFiveDays.map((day)=>(
                <div className={`border ${selectedDate?.date.getDate()===day.date.getDate() ? 'border-primary-color':'border-grey-border'}  rounded-lg p-4 ml-2 flex flex-col items-center w-20`}>
                    <p className='mb-3'>{day.dayName}</p>
                    <p className='text-primary-color'>{day.date.getDate()}</p>
                    <button onClick={()=>{setSelectedDate(day)}} className='bg-primary-color text-white px-2 py-1 rounded-sm mt-3 text-xs'>انتخاب</button>
                </div>
            ))}  
        </div>

        

    </div>

  )
}

export default RecieveTime