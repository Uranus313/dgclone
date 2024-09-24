'use client'
import React, { useEffect, useRef, useState } from 'react'
import SearchableDropdown from '@/app/components/SearchableDropDown/SeachableDropdown'
import { colorpallete } from './SellProductPopup'
import ModalButton from '../ModalButton'
import SearchableList from '@/app/components/SearchableList'
import { Color, SellerSetVarientOnProduct } from '@/app/components/Interfaces/interfaces'
import { guaranteeOptions } from './step1'
import { indexOf } from 'lodash'

interface Props {
    index: number,
    varient: SellerSetVarientOnProduct,
    update: (index: number, varient: SellerSetVarientOnProduct) => void,
}

const VarientCard = ({ index, varient, update }: Props) => {
    const [valueColor, setValueColor] = useState('رنگ')
    const [color, setColor] = useState<Color>(varient.color)
    const priceRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const [guarantee, setGuarantee] = useState<string>('گارانتی')
    const [updatedVarient, setUpdatedVarient] = useState<SellerSetVarientOnProduct>(varient)

    useEffect(() => {
        console.log('in')
        setUpdatedVarient({
            color: color,
            price: priceRef.current?.value ? parseFloat(priceRef.current.value) : varient.price,
            garante: guarantee,
            productID: varient.productID,
            productPicture: varient.productPicture,
            productTitle: varient.productTitle,
            quantity: quantityRef.current?.value ? parseInt(quantityRef.current.value) : varient.quantity,
            sellerID: varient.sellerID,
            shipmentMethod: varient.shipmentMethod
        })
        update(index , {
            color: color,
            price: priceRef.current?.value ? parseFloat(priceRef.current.value) : varient.price,
            garante: guarantee,
            productID: varient.productID,
            productPicture: varient.productPicture,
            productTitle: varient.productTitle,
            quantity: quantityRef.current?.value ? parseInt(quantityRef.current.value) : varient.quantity,
            sellerID: varient.sellerID,
            shipmentMethod: varient.shipmentMethod
        })
    }, [color, guarantee, priceRef, quantityRef])

    return (
        <div className='grid grid-cols-6 gap-4 my-4 border place-items-center border-grey-border py-4 rounded-lg overflow-x-hidden'>
            <img className='w-20' src={varient.productPicture} />
            <p className='line-clamp-1 h-fit '>{varient.productTitle}</p>

            <ModalButton title={valueColor} solid={false} id={'colorModal'+index} />
            <dialog id={"colorModal"+index} className="modal">
                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="font-bold inline text-lg mt-2">انتخاب رنگ</h3>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                        <SearchableList defaultValue={varient.color.title} items={colorpallete} showKey='title' setFunc={setColor} showFunc={setValueColor} />
                    </div>
                    <hr className='text-grey-border  my-2'></hr>
                </div>
            </dialog>

            <input type='number' defaultValue={varient.quantity} ref={quantityRef} className='w-32' placeholder={"تعداد"} />
            <input type='number'  defaultValue={varient.price} ref={priceRef} className='w-32' placeholder={"قیمت"} />

            <ModalButton  title={guarantee} solid={false} id={'gauranteeModal'+index} />
            <dialog id={"gauranteeModal"+index} className="modal">
                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="font-bold inline text-lg mt-2">انتخاب رنگ</h3>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                        <SearchableList defaultValue={varient.garante} items={guaranteeOptions} setFunc={setGuarantee} showFunc={setGuarantee} />
                    </div>
                    <hr className='text-grey-border  my-2'></hr>
                </div>
            </dialog>
        </div>
    )
}

export default VarientCard
