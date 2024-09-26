'use client'
import { ProductInterface } from '@/app/components/Interfaces/interfaces'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'

interface Props {
    product: ProductInterface
}

const CommentList = ({ product }: Props) => {

    return (
        <div className='w-full p-10 border-b-2 border-border'>
            <div className='flex pb-5'>
                <p className='text-text-color'>آی دی محصول : </p>
                <p>{product.id}</p>
                <p className='text-text-color'>اسم: </p>
                <p>{product.title}</p>
                <p className='pr-20 pl-5 text-text-color'> آی دی فروشنده   : </p>
                <p>{product.sellers[0].sellerid}</p>
            </div>
            <div className='flex justify-center'>

                <button onClick={() => {
                }} className='text-green-box border-green-box border-2 py-5 pb-8 mx-3'>
                    تایید
                </button>
                <button onClick={() => {
                }} className='text-red-box border-red-box border-2 py-5 pb-8'>
                    رد
                </button>
            </div>

        </div>

    )
}

export default CommentList
