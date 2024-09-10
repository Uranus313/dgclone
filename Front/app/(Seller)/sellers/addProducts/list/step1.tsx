'use client'
import { ProductCardSeller, SellerRequestOnProduct } from '@/app/components/Interfaces/interfaces'
import React, { useState } from 'react'

interface Props{
    productCard:ProductCardSeller
}
const Step1 = ({productCard}:Props) => {
  const [varients , setVarients] = useState<SellerRequestOnProduct[]>([])
  return (
    <div>
        {varients.map(varient=>(
            <div className='grid grid-cols-5'>
                <img src={productCard.picture}/>
                <p>{productCard.title}</p>
                {/* <p>{varient.}</p> */}
            </div>
        ))}
       
    </div>
  )
}

export default Step1