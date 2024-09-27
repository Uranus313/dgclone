'use client'
import { useUser } from "@/app/hooks/useUser";
import React, { useContext, useEffect, useState } from 'react'
import MapComponentShip from "./MapComponentShip";
import ModalButton from "@/app/(Seller)/sellers/addProducts/ModalButton";
import { useOrderCart } from "@/app/hooks/useOrderCart";

const UserAddress = () => {
    const {user , setUser}=useUser()
    const [selectedAddress , setSelectedAddress] = useState(user?.addresses[0])
    const {orderCart , setOrderCart} = useOrderCart()

    useEffect(()=>{
        setOrderCart({...orderCart , address:selectedAddress})
    },[])

    useEffect(()=>{
        setOrderCart({...orderCart , address:selectedAddress})
    },[selectedAddress])

    return (
        <div className="rounded-lg p-5 border border-grey-border bg-white">
        <div className=" grid grid-cols-5 ">
            <div className=" grid grid-cols-2 col-span-4">

                <p className="text-grey-dark">استان</p>
                <p>{selectedAddress?.province}</p>
                <hr className="text-grey-border col-span-2 my-2"></hr>

                <p className="text-grey-dark">شهر</p>
                <p>{selectedAddress?.city}</p>
                <hr className="text-grey-border col-span-2  my-2"></hr>
                
                <p className="text-grey-dark">کد پستی</p>
                <p>{selectedAddress?.postalCode}</p>
                <hr className="text-grey-border col-span-2  my-2"></hr>
                <p className="text-grey-dark">آدرس متنی</p>
                <p>{selectedAddress?.additionalInfo}</p>
                <hr className="text-grey-border col-span-2  my-2"></hr>
            </div>  
    
            <MapComponentShip coordinates={selectedAddress?.coordinates }/>
         


        </div>
            <ModalButton  title="تغییر آدرس >"  noMargin={true} additionalCss="text-primary-color text-md p-0 mt-3" id='changeAddress'/> 
            <dialog id="changeAddress" className="modal">
            <div className="modal-box w-11/12 max-w-5xl ">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg">انتخاب آدرس</h3>
                    <form method="dialog">
                    <button id='closeButtonThing' className="btn btn-sm btn-circle btn-ghost ">✕</button>
                    </form>
                </div>
                <hr className="text-grey-border  mt-2"></hr>
                <div className="h-96 overflow-auto">
                {user?.addresses.map(address=>(
                    <div className=" grid grid-cols-2 mb-5 p-3">
                        <input checked={address.coordinates == selectedAddress?.coordinates} type="radio" name="address" onClick={()=>{setSelectedAddress(address);document.getElementById('closeButtonThing')?.click()}} className="radio"/>
                        <p className="text-grey-dark">استان</p>
                        <p>{address?.province}</p>
                        <hr className="text-grey-border col-span-2 my-2"></hr>

                        <p className="text-grey-dark">شهر</p>
                        <p>{address?.city}</p>
                        <hr className="text-grey-border col-span-2  my-2"></hr>
                        
                        <p className="text-grey-dark">کد پستی</p>
                        <p>{address?.postalCode}</p>
                        <hr className="text-grey-border col-span-2  my-2"></hr>
                        <p className="text-grey-dark">آدرس متنی</p>
                        <p>{address?.additionalInfo}</p>
                        <hr className="text-grey-border col-span-2  my-2"></hr>

                    </div>  
                ))}
                </div>
            </div>
            </dialog>
        </div>
    )
}

export default UserAddress