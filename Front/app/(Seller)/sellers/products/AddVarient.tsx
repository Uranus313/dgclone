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

    </div>
  </dialog>
  )
}

export default AddVarient