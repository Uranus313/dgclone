import React from 'react'
import Step1 from '../addProducts/list/step1'
import { SellerAddProdctCard, SellerSetVarientOnProduct, shipmentMethod } from '@/app/components/Interfaces/interfaces'

const productCard:SellerAddProdctCard={
        title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
        productID:'55',
        sellerCount:2,
        picture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
        commission:2,
        urbanPrice:22000000,
        id:'1',
}


const thisSellerVarients : SellerSetVarientOnProduct[]=[
  {
  sellerID:'1',
  productID:'3',
  productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
  productPicture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
  color:{title:"سیاه",hex:"#000000"},  
  quantity:3,
  garante:'گارانتی خوب',
  shipmentMethod:shipmentMethod.option1,
},

{
  sellerID:'1',
  productID:'3',
  productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
  productPicture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
  color:{title:"سیاه",hex:"#000000"},  
  quantity:3, 
  garante:'گارانتی خوب',
  shipmentMethod:shipmentMethod.option1,
},

{
  sellerID:'1',
  productID:'3',
  productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
  productPicture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
  color:{title:"سیاه",hex:"#000000"},  
  quantity:3,
  garante:'گارانتی خوب',
  shipmentMethod:shipmentMethod.option1,
},

{
  sellerID:'1',
  productID:'3',
  productTitle:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook 15 F1504VA-NJ821-i5 1335U-16GB DDR4-512GB SSD-TN - کاستوم شده',
  productPicture:'https://dkstatics-public.digikala.com/digikala-products/8479fd06b020790ab474a7b6b66b3ca4b646fd63_1713796697.jpg',
  color:{title:"سیاه",hex:"#000000"},  
  quantity:3,
  garante:'گارانتی خوب',
  shipmentMethod:shipmentMethod.option1,
},
]

interface Props{
    productID:string
}
const AddVarient = ({productID}:Props) => {
  return (
    <dialog id='addNewVarient' className="modal w-full">
    <div className="modal-box w-11/12 max-w-5xl p-2 flex-col flex">

        <Step1 prevVarients={thisSellerVarients} productCard={productCard}/>
        <hr className='text-grey-border  my-2'></hr>
        <div className='flex self-end'>
          <form method="dialog" className=''>
              <button className="px-6 py-2  my-3 rounded-md text-primary-seller bg-white w-fit border border-primary-seller " >بستن</button>
          </form>
          <button className='px-6 py-2 mx-2 my-3 rounded-md bg-primary-seller text-white w-fit '>بعدی</button>

        </div>
    </div>
  </dialog>
  )
}

export default AddVarient