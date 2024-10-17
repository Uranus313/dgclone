'use client'
import {  Color, productSaleAnalyseCard, Quantity, SellerAddProdctCard, SellerSetVarientOnProduct, shipmentMethod } from '@/app/components/Interfaces/interfaces'
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

 async function AddVarients(varients:Quantity[] , prodID:string) {
  console.log(JSON.stringify(varients))
  try {
    const response = await fetch(`https://localhost:8080/products/seller/addVariant?prodID=${prodID}`, {
      credentials:'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(varients)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function UpdatePrice(price:number , prodID:string){

    console.log(JSON.stringify(price))
    try {
      const response = await fetch(`https://localhost:8080/products/seller/setNewPrice?prodID=${prodID}&NewPrice=${price}`, {
        credentials:'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  
  
}


interface Props{
    productCard:productSaleAnalyseCard
}
const Step1 = ({productCard}:Props) => {
  // const {data:price} = useGetSellerVarients()
  const [varients , setVarients] = useState<Quantity[]>(productCard?.sellerCart?.seller_quantity??[])
  const priceRef = useRef<HTMLInputElement>(null);
  let [productPrice , setProductPrice] = useState<number>()
  
  // useEffect(() => {
  //   console.log('prrrr',productCard)
  //    setVarients(productCard?.sellerCart?.seller_quantity)
  // }, [productCard]);


  function AddNewVarient(){
    setVarients(varients => [...varients ,{color:{hex:'',title:''},quantity:0,guarantee:{_id:'0',title:''},}])
  }

  function UpdateVarient(index: number, varient: Quantity) {
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
          <div className='grid sm:grid-cols-3 grid-cols-1 w-1/2'>
            <input type='number '  defaultValue={productCard.sellerCart.price} ref={priceRef} className=' p-2 rounded-lg border  sm:col-span-2 border-grey-border' placeholder={"قیمت"} />
            <button onClick={()=>{UpdatePrice(Number(priceRef.current?.value),productCard.productID)}}  className='p-3 mx-3 text-sm rounded-md border border-grey-dark'>بروزرسانی قیمت</button>
          </div>
        </div>
        <div className='grid grid-cols-3 sm:grid-cols-5  gap-4 my-4 place-items-center bg-primary-bg p-5 rounded-md'>
          <p className='col-span-2 sm:block hidden'>عنوان کالا</p>
          <p>رنگ</p>
          <p>تعداد</p>
          {/* <p>قیمت</p> */}
          <p>گارانتی</p>
        </div>
    
        <div className='h-60 overflow-auto'>
          {varients.map((varient,index)=>(
            <div key={index}>  
             <VarientCard varient={varient} product={productCard} index={index} update={UpdateVarient}/>
            </div>
          ))}

        </div>

        <hr className='text-grey-border  my-2'></hr>
        <div className='flex self-end'>
          <form method="dialog" className=''>
              <button className="px-6 py-2  my-3 rounded-md text-primary-seller bg-white w-fit border border-primary-seller " >بستن</button>
          </form>
          <button onClick={()=>{AddVarients(varients , productCard.productID)}} className='px-6 py-2 mx-2 my-3 rounded-md bg-primary-seller text-white w-fit '>بعدی</button>

        </div>
       
    </div>
  )
}

export default Step1