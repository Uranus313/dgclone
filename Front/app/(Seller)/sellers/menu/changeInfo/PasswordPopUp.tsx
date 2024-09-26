import { useSeller } from "@/app/hooks/useSeller";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';


const PasswordPopUp = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const {seller , setSeller} = useSeller()
  
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
    const update = useMutation({
        mutationFn: async (formData : any) => {
          const {oldPassword	, ...storeOwnerWithoutId } = formData || {};
          // const body = seller?.password
          // ? JSON.stringify(formData)
          // : JSON.stringify({storeOwner:{ ...storeOwnerWithoutId, ...formData }});

            const result = await fetch("http://localhost:3005/users/seller/changePassword", {
                  method: "PATCH",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body:JSON.stringify(formData)
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
            // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            // queryClient.invalidateQueries(["user"]);
            // setUser(savedUser);
            closeModal();
            // router.push('/');
            // router.push('/');
        },
        onError: (error) => {
          // Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})// navigate("/");
          //   console.log(error)
          //   console.log(error.response?.data.detail)
          console.log(error);
        //   console.log(error.message);
          setError(error.message)
          // setError(error)
        }
    });
    const { register, handleSubmit, getValues} = useForm();

    const submit = async (formData : any) => {
        console.log("aaaaaaaaaa")
        // console.log(formData?.oldPassword.trim()??'')
        console.log("aaaaaaaaaa")
        if(formData.newPassword.trim().length<8 || (formData?.oldPassword?.trim() != "" && formData?.oldPassword?.trim().length < 8)){
            setError("رمز عبور باید برابر یا بیشتر از 8 حرف باشد");
            return;
        }
        if(formData.newPassword.trim().length>50 || (formData?.oldPassword?.trim() != "" && formData?.oldPassword?.trim().length >50 )){
            setError("رمز عبور باید برابر یا بیشتر از 8 حرف باشد");
            return;
        }
        if(formData.newPassword.trim() != formData.newPasswordRepeat.trim()){
            setError("تکرار رمز عبور مطابقت ندارد");
            return;
        }
        update.mutate({
            newPassword : formData.newPassword.trim(),
            oldPassword : formData?.oldPassword?.trim()
        });
    };
    return (
      <div>
        
        
        <label className="block">
        تغییر رمز عبور
        <input className='block' readOnly onClick={openModal} placeholder="رمز عبور" type="text" />
        </label>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">تغییر رمز عبور</h3>
            <p className="py-4">سلام</p>
            <form onSubmit={handleSubmit(submit)}>
            <>
              <label className="block">
                رمز عبور قبلی
                <input type="password" placeholder='رمز عبور قبلی' className='block' {...register("oldPassword")}/>
              </label>
              </>
            
           
            
            <label className="block">
            رمز عبور جدید
            <input type="password" placeholder='رمز عبور جدید' className='block' {...register("newPassword")}/>
            </label>
            <label className="block">
            تکرار رمز عبور جدید
            <input type="password" placeholder='تکرار رمز عبور جدید' className='block' {...register("newPasswordRepeat")}/>
           
            </label>
               
                
                
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

export default PasswordPopUp
