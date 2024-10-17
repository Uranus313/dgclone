'use client'
import React, { useEffect, useRef, useState } from 'react'
import SearchableDropdown from '@/app/components/SearchableDropDown/SeachableDropdown'
import { colorpallete } from './SellProductPopup'
import ModalButton from '../ModalButton'
import SearchableList from '@/app/components/SearchableList'
import { Color, productSaleAnalyseCard, Quantity, SellerSetVarientOnProduct } from '@/app/components/Interfaces/interfaces'
import { indexOf } from 'lodash'
import useGetColors from '@/app/hooks/useGetColors'
import useGetGaurantees from '@/app/hooks/useGetGaurantees'

interface Props {
    index: number,
    varient: Quantity,
    update: (index: number, varient: Quantity) => void,
    product:productSaleAnalyseCard
}

const VarientCard = ({ index, varient, update,product }: Props) => {
    const [valueColor, setValueColor] = useState('رنگ')
    const [valueGaurantee , setValueGuarantee] = useState('گارانتی')
    const [color, setColor] = useState<Color>(varient.color)
    const {data:colorpallete} = useGetColors()
    const quantityRef = useRef<HTMLInputElement>(null);
    const [guarantee, setGuarantee] = useState<{_id:string,title:string}>({_id:'',title:'گارانتی'})
    const [updatedVarient, setUpdatedVarient] = useState<Quantity>(varient)
    const {data:guaranteeOptions , isLoading} = useGetGaurantees()
    const {data:colorOptions}=useGetColors()
    const [g,setG]=useState<{_id:string,title:string}[]>()

    useEffect(()=>{
        setG(guaranteeOptions)
        console.log('gggg',guaranteeOptions)
        console.log('gggg',colorOptions)
    },[guaranteeOptions , colorOptions])

    useEffect(() => {
        console.log('in')
        setUpdatedVarient({
            color: color,
            guarantee:guarantee,
            quantity:quantityRef.current?.value ? parseInt(quantityRef.current.value) : varient.quantity
        })
        update(index , {
            color: color,
            // price: priceRef.current?.value ? parseFloat(priceRef.current.value) : varient.price,
            guarantee: guarantee,
            quantity: quantityRef.current?.value ? parseInt(quantityRef.current.value) : varient.quantity,
        })
    }, [color, guarantee, quantityRef])


    useEffect(()=>{
        if(varient.color.title!='' && varient.guarantee.title!=''){
            setValueColor(varient.color.title)
            setValueGuarantee(varient.guarantee.title)
            
        }
    },[])
    
    console.log('varrr',varient)
    return (
        <div className='grid sm:grid-cols-5 grid-cols-3 gap-4 my-4 border place-items-center border-grey-border py-4 rounded-lg overflow-x-hidden'>
            <img className='w-20 sm:block hidden' src={product.picture} />
            <p className='line-clamp-1 h-fit sm:block hidden'>{product.title}</p>

            <ModalButton title={valueColor} solid={false} id={'colorModal'+index} />
            <dialog id={"colorModal"+index} className="modal">
                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="font-bold inline text-lg mt-2">انتخاب رنگ</h3>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                        <SearchableList defaultValue={varient.color.title} items={colorpallete??[]} showKey='title' setFunc={setColor} showFunc={setValueColor} />
                    </div>
                    <hr className='text-grey-border  my-2'></hr>
                </div>
            </dialog>

            <input type='number' defaultValue={varient.quantity} ref={quantityRef} className='w-32' placeholder={"تعداد"} />

            <ModalButton  title={valueGaurantee} solid={false} id={'gauranteeModal'+index} />
            <dialog id={"gauranteeModal"+index} className="modal">
                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="font-bold inline text-lg mt-2">انتخاب رنگ</h3>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                        <SearchableList defaultValue={varient.guarantee.title} showKey='title' items={guaranteeOptions??[]} setFunc={setGuarantee} showFunc={setValueGuarantee} />
                    </div>
                    <hr className='text-grey-border  my-2'></hr>
                </div>
            </dialog>
        </div>
    )
}

export default VarientCard
