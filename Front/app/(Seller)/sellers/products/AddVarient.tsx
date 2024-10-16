import React from 'react'
import Step1 from '../addProducts/list/step1'
import { productSaleAnalyseCard, SellerAddProdctCard, SellerSetVarientOnProduct, shipmentMethod } from '@/app/components/Interfaces/interfaces'


interface Props{
    productCard:productSaleAnalyseCard
}
const AddVarient = ({productCard}:Props) => {
  return (
    <dialog id='addNewVarient' className="modal w-full">
    <div className="modal-box w-11/12 max-w-5xl p-2 flex-col flex">

        <Step1 productCard={productCard}/>
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