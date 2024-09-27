'use client'
import { useUser } from "@/app/hooks/useUser";
import React, { useContext, useRef, useState } from 'react'
import AddAddress from './AddAddress';
import { useForm } from 'react-hook-form';
import { useSeller } from "@/app/hooks/useSeller";

const AddAddressPopUp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const {seller , setSeller , isLoading} = useSeller();
  
    const openModal = () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
        setIsOpen(true);
      }
    };
  
    const closeModal = () => {
      if (dialogRef.current) {
        dialogRef.current.close();
        setIsOpen(false);
      }
    };
  return (
    <div>
       <div>
        <h1>hello</h1>
        <button className="btn" onClick={openModal}>اضافه کردن آدرس</button>
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            
            <AddAddress afterCancel={closeModal} afterSuccess={closeModal}/>
           
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    </div>
  )
}

export default AddAddressPopUp
