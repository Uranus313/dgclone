import userContext from '@/app/contexts/userContext';
import { useMutation } from '@tanstack/react-query';
import _, { method } from 'lodash';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';


const MoneyReturnPopUp = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const {user , setUser } = useContext(userContext);
    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
    const [showBankNumberPage , setShowBankNumberPage] = useState<boolean>(false);
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
    const handleOptionChange = (event : any) => {
        setSelectedOption(event.target.value);
      };
    const update = useMutation({
        mutationFn: async (formData : any) => {
          console.log(formData)
            const result = await fetch("http://localhost:3005/users/user/changeMyinfo", {
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
            // queryClient.invalidateQueries(["user"]);
            setUser(savedUser);
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

    const firstSubmit = async () => {
        if(selectedOption == "wallet"){
            if (user?.moneyReturn?.method != "wallet"){
                const moneyReturn = {...user?.moneyReturn , method: "wallet"};
                delete moneyReturn._id;
                update.mutate({
                    moneyReturn : moneyReturn
                });
                return
            }
            closeModal();
            return
        }
        setShowBankNumberPage(true);
    };
    const secondSubmit = async (formData : any) => {
        console.log(formData)
        if(formData.bankAccountNumber.trim().length != 16){
            setError("شماره کارت باید برابر با 16 رقم باشد");
            return;
        }
        if(_.isEqual(user?.moneyReturn,{method : "bankAccount" ,bankAccount: formData.bankAccountNumber.trim()})){
            closeModal();
        }
        update.mutate({
            moneyReturn : {method : "bankAccount" ,bankAccount: formData.bankAccountNumber.trim()}
        });
        return;
    };
    return (
      <div>
        
        
        <label className="block">
        روش بازگشت پول
        <input className='block' readOnly onClick={openModal} value={user?.moneyReturn?.method} type="text" />
        </label>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">روش بازگشت پول</h3>
            <p className="py-4">سلام</p>
            <div className={showBankNumberPage? "hidden" : "block"}>
            <input
        type="radio"
        name="options"
        value="wallet"
        id="option1"
        // checked={selectedOption === 'option1'}
        onChange={handleOptionChange}
      />
      <label htmlFor="option1">کیف پول دیجیمارکت</label>

      <input
        type="radio"
        name="options"
        value="bankAccount"
        id="option2"
        // checked={selectedOption === 'option2'}
        onChange={handleOptionChange}
      />
      <label htmlFor="option2">حساب بانکی</label>
            <button className='btn btn-primary' type='button' onClick={firstSubmit}>تایید</button>
        </div>
        <form onSubmit={handleSubmit(secondSubmit)} className={showBankNumberPage? "block" : "hidden"}>
        <label className="block">
            شماره کارت بانکی متصل به حساب
            <input type="number" defaultValue={user?.moneyReturn?.bankAccount} className='block' {...register("bankAccountNumber")}/>
           
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

export default MoneyReturnPopUp
