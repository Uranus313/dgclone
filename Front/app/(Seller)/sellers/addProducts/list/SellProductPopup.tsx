'use client'
import { Color, SellerAddProdctCard } from '@/app/components/Interfaces/interfaces';
import Link from 'next/link';
import React, { useRef, useState } from 'react'
import Step0 from './step0';
import Step1 from './step1';


export const colorpallete:Color[]=[
    {
        hex:'#ffffff',
        _id:'1',
        title:'سفید'
    },
    {
        hex:'#000000',
        _id:'2',
        title:'سیاه'
    },
    {
        hex:'#C03131',
        _id:'3',
        title:'قرمز'
    },
    {
        hex:'#4A90E2',
        _id:'4',
        title:'آبی'
    },
    {
        hex:'#4BAA45',
        _id:'5',
        title:'سبز'
    },
]

interface Props{
    id:string,
    productCard:SellerAddProdctCard
}

const SellProductPopup = ({id,productCard}:Props) => {
  const [next , setNext]= useState(false)
  const [selectedVarients , setSelectedVarients] = useState([])
  return (
  
    <dialog id={id} className="modal w-full">
        <div className="modal-box w-11/12 max-w-5xl p-2 flex-col flex">
            <form method="dialog" className='inline'>
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-lg btn-circle btn-ghost" onClick={()=>{setNext(false)}}>✕</button>
            </form>
            {!next ? <Step0 productCard={productCard}/>
                   : <Step1 productCard={productCard}/>
            }
            
            <hr className='text-grey-border  my-2'></hr>
            <button className='px-6 py-2 mx-5 my-3 rounded-md bg-primary-seller text-white w-fit self-end' onClick={()=>setNext(true)}>بعدی</button>
        </div>
    </dialog>

  )
}

export default SellProductPopup