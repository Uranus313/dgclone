import { useUser } from "@/app/hooks/useUser";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';


const addMoney = () => {
    
    const [error , setError] = useState<string | null>(null);
    const [success , setSuccess] = useState<string | null>(null);
   const queryClient = useQueryClient()
    const update = useMutation({
        mutationFn: async (formData : any) => {
            const result = await fetch("http://localhost:3005/users/user/increaseWallet", {
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
            // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            queryClient.invalidateQueries({queryKey:["userWallet"]});
            // setUser(savedUser);
            setSuccess("کیف پول شما با موفقیت اضافه شد")
            // closeModal();
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
        if(formData.amount<10000 ||  formData.amount> 1000000000){
            setError(" مقدار باید بیشتر از 10000 و کمتر از 1000000000 باشد");
            return;
        update.mutate({
            amount : formData.amount
        });
    };
    return (
      <div>
        
        <h1>
        افزایش اعتبار

        </h1>
        
            {success && <p>{success}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit(submit)}>
            <label className="block">
            افزایش اعتبار
            <input type="number" placeholder="افزایش اعتبار" className='block' {...register("amount")}/>
           </label>

               
                
                
            <button className='btn btn-primary' type='submit'>تایید</button>

            </form>
            
      </div>
    );
}
}

export default addMoney
