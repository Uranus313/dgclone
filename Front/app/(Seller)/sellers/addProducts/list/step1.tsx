'use client'
import {  Color, SellerAddProdctCard, SellerSetVarientOnProduct, shipmentMethod } from '@/app/components/Interfaces/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import VarientCard from './VarientCard'
import useGetSellerVarients from '@/app/hooks/useGetSellerVarients'




export const guaranteeOptions=[
  'گارانتی خوب',
  'بگارانتی خوب',
  'گارانتی خوبب',
  'گارانتی خوبل',
  'گارانتی خوبتع',
]

 //if seller doesnt exist return the urban price otherwise returns that seller price


interface Props{
    productCard:SellerAddProdctCard
    prevVarients?:SellerSetVarientOnProduct[]
}
const Step1 = ({productCard , prevVarients}:Props) => {
  const {data:vars} = useGetSellerVarients()
  const {data:price} = useGetSellerVarients()
  const [varients , setVarients] = useState<SellerSetVarientOnProduct[]>(vars??[])
  const priceRef = useRef<HTMLInputElement>(null);
  let [productPrice , setProductPrice] = useState<number>()
  
  // useEffect(() => {
  //   if(prevVarients){
  //     setVarients(prevVarients)
  //     setProductPrice(0)

  //   } 
  //   setProductPrice(productCard.UrbanPrice)
  // }, []);


  function AddNewVarient(){
    setVarients(varients => [...varients , {color:{hex:'',title:''},price:productCard.UrbanPrice , garante:'',productID:productCard.ID,productPicture:productCard.Picture,productTitle:productCard.Title,quantity:0,sellerID:'1',shipmentMethod:shipmentMethod.option1}])
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
        <div className='flex gap-4 items-center'>
          <button className='p-3 mx-3 text-sm rounded-md  bg-primary-seller text-white' onClick={AddNewVarient}>ثبت تنوع جدید</button>
          <p className='mx-3'>قیمت</p>
          <input type='number'  defaultValue={productPrice} ref={priceRef} className=' p-2 rounded-lg border border-grey-border' placeholder={"قیمت"} />
        </div>
        <div className='grid grid-cols-5  gap-4 my-4 place-items-center bg-primary-bg p-5 rounded-md'>
          <p className='col-span-2'>عنوان کالا</p>
          <p>رنگ</p>
          <p>تعداد</p>
          {/* <p>قیمت</p> */}
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