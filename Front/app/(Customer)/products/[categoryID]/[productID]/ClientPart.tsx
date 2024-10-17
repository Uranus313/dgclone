'use client'
import { Color, ProductInterface, SellerInfosOnProduct } from '@/app/components/Interfaces/interfaces'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import f from '../../../../assets/images/tomann.png'
import Gallery from './Gallery'
import SeeMore from '@/app/components/SeeMore/SeeMore'
interface Props{
    product : ProductInterface
}

const ClientPart = ({product}:Props) => {
    
    const jsonString = JSON.stringify(product);
    console.log('prod',jsonString , 'prod');
    let ColorsWithSellers:{color:Color,sellers:SellerInfosOnProduct[]}[] = []
    const [selectedColor , setSelectedColor] = useState(product?.sellers[0]?.seller_quantity[0]?.color ?? {hex:'#000000',title:'N/A',_id:'0'})
    const [selectedSeller , setSelectedSeller] = useState<SellerInfosOnProduct>()
    

    product.sellers.forEach(seller => {
        seller.seller_quantity.forEach(colorQuantity=>{
            if (colorQuantity.quantity != 0 ){
                const foundColor:{color:Color,sellers:SellerInfosOnProduct[]}|undefined = ColorsWithSellers.find((item)=> item.color.title === colorQuantity.color.title)

                if(foundColor){
                    foundColor.sellers.push(seller)
                }
                else{
                    ColorsWithSellers.push({color:colorQuantity.color , sellers:[seller]})
                }
            }
        })
    });


    let otherSellersCount = (ColorsWithSellers.find(item => item.color === selectedColor)?.sellers.length ?? 0) - 1
    useEffect(()=>{
        const sellers = product.sellers.filter(seller=>seller.seller_quantity.some(color=>color.color==selectedColor))
        const bestSellerman = sellers.reduce((prevSeller, currentSeller) => {
            return currentSeller?.seller_rating > prevSeller?.seller_rating ? currentSeller : prevSeller;
        });
        setSelectedSeller(bestSellerman)
    },[selectedColor])
    
  console.log('len',otherSellersCount)

  async function AddToList(){
        try {
          const response = await fetch('http://localhost:3005/users/user/addToFavoriteList', {
            credentials:'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({productID:product._id})
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
  return (
    <div className='grid grid-cols-12 gap-4 overflow-hidden'>
        <div className='col-span-4'>
            <Gallery images={product.images} />
            
        </div>
        {/* <button onClick={AddToList} className='btn text-lg p-5 bg-black text-white'>giiii</button> */}

        <div className='col-span-8'>
            <h1 className='text-lg font-black'>{product.title}</h1>
            <div className='my-3 flex'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-primary-color">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <p className='mx-1 text-lg'>{product.rating.rate}</p>
                <p className='mx-2 text-grey-light'>(خریدار {product?.rating?.rate_num} امتیاز)</p>
                <p className='mx-2 text-grey-light'>بازخورد</p>
                <p className='mx-2 text-grey-light'>پرسش</p>
            </div>

            <div className='grid grid-cols-2'>

                <div className='col-span-1'>
                    <p className='text-xl mt-4 mb-3'>رنگ:</p>
                    <div className='flex'>    
                        {ColorsWithSellers.map((color)=>{
                            return <button onClick={()=>setSelectedColor(color.color)} className={`${selectedColor == color.color ? 'border-primary-color border-4':'border-grey-dark'} h-10 w-10 ml-2 rounded-full  border`} style={{backgroundColor:color.color.hex}}></button>
                        })}
                    </div>

                    <p className='text-xl mt-10 mb-3'>ویژگی ها:</p>
                    <div className='grid grid-cols-3 gap-2'>    
                        {Object.entries(product.details[0].map).slice(0, 5).map(([key, value]) => (
                        <div className='mb-1 rounded-lg text-sm bg-propBubble-bg py-3 px-5' key={key}>
                            <p className='line-clamp-1 mb-2 text-grey-dark'>{key}</p>
                            <p className='line-clamp-1'>{value}</p>
                        </div>
                        ))}


                        <div className='mb-1 rounded-lg border border-primary-color flex justify-center items-center py-3 px-5'>
                            <p className='line-clamp-1 text-center text-lg text-primary-color'>بیشتر</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mx-1 mt-1 text-primary-color">
                                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                            </svg>

                        </div>

                    </div>

                </div>

                <div className='col-span-1'>
                    <div className='bg-primary-bg rounded-lg border-grey-border border p-5 mx-auto w-10/12'>
                        <div className='flex justify-between '>
                            <h2 className='text-lg font-bold'>فروشنده</h2>
                            
                            {otherSellersCount > 0 && <h2 className='text-sm text-primary-color'>{otherSellersCount} فروشنده دیگر</h2>}
                        </div>
                        <div className='flex my-2 justify-between border-b pb-3 border-grey-border'>
                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                </svg>

                                <h2 className='text-sm mx-2 mt-1 '>{selectedSeller?.seller_title}</h2>
                            </div>

                            <div className='flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mt-1 text-primary-color">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>

                                <h2 className='mx-1 mt-1 '>{selectedSeller?.seller_rating}</h2>
                            </div>

                        </div>

                        <div className='flex justify-between mt-4'>
                            <div className='flex'>
                                <h2 className='text-3xl'>{selectedSeller?.price}</h2>
                                <Image className='mx-1 object-contain' objectFit='contain' src={f} width='30' height='100' alt='تومان'/>
                            </div>
                            <div className="tooltip" data-tip={`این کالا توسط فروشنده ی آن ${selectedSeller?.seller_title} قیمت گذاری شده `}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mt-1 text-grey-dark">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                            </div>
                        </div>
                        <button className='bg-primary-color text-white rounded-lg flex px-4 py-3 mt-4 w-full justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            <p>ثبت سفارش</p>
                        </button>

                        <div className='flex mt-10 '>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-grey-dark">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                            <p className='text-grey-dark mx-2'>{selectedSeller?.seller_quantity.find(quantity=>quantity.color==selectedColor)?.guarantee.title}</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>

        {otherSellersCount > 0 && <div className='mt-20 col-span-full'>
            <SeeMore minItemsCount={3}>
  {[
    ...(ColorsWithSellers.find(item => item.color === selectedColor)?.sellers || []).map(seller => (
      <div className='w-full border grid grid-cols-4 border-primary-color py-5 rounded-md mb-5' key={seller.seller_id}>
        <div className='flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mx-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          <div>
            <p className='mb-4 text-xl'>{seller.seller_title}</p>
            <div className='flex'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-primary-color">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              <p className='text-lg'>{seller.seller_rating}</p>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mx-2 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          <p className=''>{seller.seller_quantity.find(quantity=>quantity.color==selectedColor)?.guarantee.title}</p>
        </div>
        <div className='flex items-center justify-center'>
          <p className='text-3xl'>{seller?.price}</p>
          <Image className='mx-1 object-contain' objectFit='contain' src={f} width='30' height='100' alt='تومان'/>
        </div>
        <div className='flex items-center justify-end'>
          <button className='bg-primary-color text-white w-9/12 py-3 mx-4 rounded-md'>افزودن به سبد</button>
        </div>
      </div>
    ))
  ]}
</SeeMore>

        </div>}
            
    </div>
  )
}

export default ClientPart