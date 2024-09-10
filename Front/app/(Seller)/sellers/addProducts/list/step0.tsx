import { SellerAddProdctCard } from '@/app/components/Interfaces/interfaces'
import React from 'react'

interface Props{
    productCard:SellerAddProdctCard
}
const Step0 = ({productCard}:Props) => {
  return (
    <div>
        <h3 className="font-bold inline text-lg mt-2">همین کالا را می‌فروشید؟</h3>
            <hr className='text-grey-border  my-2'></hr>

            <p className='m-5'>اگر مشخصات این کالا با کالای شما منطبق است، می‌توانید این کالا را بفروشید</p>

            <div className='px-10 m-5 py-5 rounded-lg border border-grey-border overflow-auto'>
                
                <div className='grid grid-cols-3 gap-2'>
                    <img className='row-span-10 w-52' src={productCard.picture}/>

                    <p className=''>عنوان کالا</p>
                    <p className='line-clamp-1 text-grey-dark'>{productCard.title}</p>

                    <p>شناسه کالا</p>
                    <p className='text-primary-seller'>{productCard.productID}</p>

                    <p>کمیسیون</p>
                    <p className='text-grey-dark'>{productCard.commission}%</p>
                    
                    <p>قیمت مرجع</p>
                    <p className='text-grey-dark'>{productCard.urbanPrice}</p>

                    <p>تعداد فروشندگان</p>
                    <p className='text-grey-dark'>{productCard.sellerCount}</p>
                </div>
            </div>
    </div>
  )
}

export default Step0