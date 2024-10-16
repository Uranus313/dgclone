import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';


const ChangeEmail = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const [next , setNext]=useState(false)
  
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
    const sendEmail = useMutation({
        mutationFn: async (formData : any) => {
            const result = await fetch("http://localhost:3005/users/seller/changeEmail", {
                  method: "PATCH",
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
        onSuccess: (savedUser) =>{
            console.log(savedUser);
            setNext(true)
            // closeModal();
        },
        onError: (error) => {
          console.log(error);
          setError(error.message)
        }
    });

    const verify = useMutation({
      mutationFn: async (formData : any) => {
          const result = await fetch("http://localhost:3005/users/seller/verifyChangeEmail", {
                method: "PATCH",
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
      onSuccess: (savedUser) =>{
          console.log(savedUser);
          closeModal();
      },
      onError: (error) => {
        console.log(error);
        setError(error.message)
      }
  });

    const { register, handleSubmit, getValues} = useForm();

    const submit = async (formData : any) => {
        console.log("aaaaaaaaaa")
        console.log(formData.email.trim())
        console.log("aaaaaaaaaa")
        if(!next){
          
          sendEmail.mutate({
              email : formData.email.trim(),
          });
        }else{
          verify.mutate({
            email : formData.email.trim(),
            verificationCode : formData.verificationCode.trim()
          })
        }
    };
    return (
      <div>
        
        
        <label className="block">
        ثبت ایمیل
        <input className='block' readOnly onClick={openModal} placeholder="ایمیل" type="text" />
        </label>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">ثبت ایمیل</h3>
            <p className="py-4">سلام</p>
            <form onSubmit={handleSubmit(submit)}>
              {!next && <label className="block">
              ایمیل
              <input placeholder='ایمیل' className='block' {...register("email")}/>
            
              </label>}

              {next && <label className="block">
              کد
              <input placeholder='کذ' className='block' {...register("verificationCode")}/>
            
              </label>}
               
                
                
            <button className='btn btn-primary' type='submit'>تایید</button>

            </form>

            
            <button className='btn btn-warning' type='button' onClick={closeModal}>لغو</button>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    );
}

export default ChangeEmail
