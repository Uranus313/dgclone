'use client'
import useQueryNext from '@/app/hooks/useQueryNext'
import Link from 'next/link'
import React from 'react'

const AddProductButton = () => {
    const {searchParams} = useQueryNext()
    return (
        <Link href={`/sellers/addProducts/NewProduct?category=${searchParams.get('category')}`} className='p-3 rounded-md bg-primary-seller text-white my-4'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline me-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        ثبت کالای جدید</Link>
    )
}

export default AddProductButton