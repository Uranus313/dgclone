'use client'
import userContext from '@/app/contexts/userContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';

const RegisterGiftCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const {user , setUser , isLoading} = useContext(userContext);
    const { register, handleSubmit, getValues } = useForm();
    
    const queryClient = useQueryClient();
    const update = useMutation({
        mutationFn: async (formData : any) => {
            const result = await fetch("http://localhost:3005/users/user/useGiftCard", {
                  method: "POST",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },
    
                  body: JSON.stringify(formData),
            });
            const jsonResult = await result.json();
            if(result.ok){
                return jsonResult
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        onSuccess: (savedUser ) =>{
            console.log(savedUser);
            // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            queryClient.invalidateQueries({ queryKey: ["userWallet"] });
            queryClient.invalidateQueries({ queryKey: ["giftCards"] });

            setUser(savedUser);
            closeModal();
            // closeModal();
            // router.push('/');
            // router.push('/');
        },
        onError: (error ) => {
          
          console.log(error);
        //   console.log(error.message);
          setError(error.message)
          // setError(error)
        }
    });
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
    async function formSubmit(formData : any){
        if(formData.code.trim().length != 16){
            setError("کد باید 16 حرف باشد");
            return;
        }
        await update.mutate(formData);
    }
  return (
    <div>
       <div>
        <h1>hello</h1>
        <button className="btn" onClick={openModal}>استفاده از کارت هدیه</button>
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit(formSubmit)}>
                <input type="text" placeholder='کد کارت هدیه' {...register('code')} />
                <button type='submit'>تایید</button>
                <button type='button' onClick={closeModal}>لغو</button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    </div>
  )
}

export default RegisterGiftCard
