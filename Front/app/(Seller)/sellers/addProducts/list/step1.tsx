'use client'
import {  Color, SellerAddProdctCard, SellerSetVarientOnProduct, shipmentMethod } from '@/app/components/Interfaces/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import VarientCard from './VarientCard'




export const guaranteeOptions=[
  'گارانتی خوب',
  'بگارانتی خوب',
  'گارانتی خوبب',
  'گارانتی خوبل',
  'گارانتی خوبتع',
]


interface Props{
    productCard:SellerAddProdctCard
    prevVarients?:SellerSetVarientOnProduct[]
}
const Step1 = ({productCard , prevVarients}:Props) => {
  const [varients , setVarients] = useState<SellerSetVarientOnProduct[]>([])
  
  useEffect(() => {
    if(prevVarients){
      setVarients(prevVarients)
    } 
  }, []);


  function AddNewVarient(){
    setVarients(varients => [...varients , {color:{hex:'',title:''},price:productCard.urbanPrice , garante:'',productID:productCard.productID,productPicture:productCard.picture,productTitle:productCard.title,quantity:0,sellerID:'1',shipmentMethod:shipmentMethod.option1}])
  }

  function UpdateVarient(index: number, varient: SellerSetVarientOnProduct) {
    setVarients(varients => {
      const newVarients = [...varients]; // Create a copy of the state array
      newVarients[index] = varient; // Update the specific item
      return newVarients; // Return the new state
    });
  }
  

  return (
    <div className='m-5 overflow-y-hidden'>
        <button className='p-3 text-sm rounded-md  bg-primary-seller text-white' onClick={AddNewVarient}>ثبت تنوع جدید</button>
        <div className='grid grid-cols-6  gap-4 my-4 place-items-center bg-primary-bg p-5 rounded-md'>
          <p className='col-span-2'>عنوان کالا</p>
          <p>رنگ</p>
          <p>تعداد</p>
          <p>قیمت</p>
          <p>گارانتی</p>
        </div>
    
        <div className='h-60 overflow-auto'>
          {varients.map((varient,index)=>(
            <div key={index}>  
             <VarientCard varient={varient} index={index} update={UpdateVarient}/>
            </div>
          ))}

        </div>
       
    </div>
  )
}

export default Step1