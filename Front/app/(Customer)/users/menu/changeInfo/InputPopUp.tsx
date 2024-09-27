import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';

interface InputDetails{
    type: string,
    name: string,
    title: string,
    validator?: (value : string) => string | null
}
interface Props{
    inputDetails : InputDetails[],
    buttonMode : "input" | "button",
    titleLabel : string,
    mainText? : string ,
    inputType? : string ,
    inputDefaultValue? : string,
    oneObjectChange? : string 
}

const InputPopUp = ({inputDetails,buttonMode,titleLabel,inputType,inputDefaultValue,mainText , oneObjectChange} : Props) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    const {user , setUser , isLoading} = useUser();
  
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
          setError(error.message)
          // setError(error)
        }
    });
    const { register, handleSubmit, getValues} = useForm();
  const getChangedValues = () => {
    const currentValues = getValues();
    const changedValues : any = {};
        Object.keys(currentValues).forEach(key => {
            if (user && currentValues[key] !== user[key] ) {
                changedValues[key] = currentValues[key];
                changedValues[key] = changedValues[key].trim();
             }
        })
    return changedValues;
};
    const submit = async (formData : any) => {
        const changes = getChangedValues();
        console.log(changes);
        if(Object.keys(changes).length == 0){
            setError("هیچ مقداری تغییر نکرده است");
            return;
        }
        
        inputDetails.forEach(detail =>{
            if(detail.validator && changes[detail.name]){
                const validationError = detail.validator(changes[detail.name]);
                if(validationError){
                    setError(validationError);
                    return;
                }
            }
        })
        if(user && oneObjectChange){
            const temp: any = {};
            temp[oneObjectChange] = {...user[oneObjectChange] , ...changes}
            update.mutate(changes);
            return;
        }
        update.mutate(changes);
    };
    return (
      <div>
        
        {buttonMode == "button"? <button className="btn" onClick={openModal}>open modal</button>:
        <label className="block">
        {titleLabel}
        <input className='block' readOnly onClick={openModal} value={inputDefaultValue} type={inputType} />
</label>}

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">{titleLabel}</h3>
            {mainText && <p className="py-4">{mainText}</p>}
            <form onSubmit={handleSubmit(submit)}>
                {inputDetails.map((detail , index) => <label key={index} className="block">
                    {detail.title}
                    <input 
                    type={detail.type} 
                    defaultValue={
                      detail.type === "date" 
                        ? (user?.[detail.name] ? new Date(user[detail.name]).toISOString().split('T')[0] : "") 
                        : user?.[detail.name] ?? ""
                    } 
                    {...register(detail.name)} 
                    className="block" 
                  />

                </label>)}
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

export default InputPopUp
