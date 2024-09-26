import { useSeller } from "@/app/hooks/useSeller";
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
    inputDefaultValue? : string|number,
    oneObjectChange? : string 
    isStoreOwner?:boolean
    isStoreInfo?:boolean
    islegalInfo?:boolean
}

const InputPopUp = ({islegalInfo,inputDetails,buttonMode,titleLabel,inputType,inputDefaultValue,mainText , oneObjectChange,isStoreOwner=false,isStoreInfo=false} : Props) => {
    
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
    const update = useMutation({
        mutationFn: async (formData : any) => {
          const { _id: storeOwnerId, id: storeOwnerOtherId, ...storeOwnerWithoutId } = seller?.storeOwner || {};
          const { _id: storeInfoId, id: storeInfoOtherId, ...storeInfoWithoutId } = seller?.storeInfo || {};
          const { _id: legalInfoID, id: legalInfoOtherID, ...legalInfoWithoutID } = seller?.legalInfo || {};
          
          let body 
           
           
          if(isStoreOwner){
            body = JSON.stringify({storeOwner:{ ...storeOwnerWithoutId, ...formData }})
          }
          else if(isStoreInfo){
            body = JSON.stringify({storeInfo:{ ...storeInfoWithoutId, ...formData }})
          }
          else if(islegalInfo){
            body = JSON.stringify({legalInfo:{ ...legalInfoWithoutID, ...formData }})
          }
          else{
            body = JSON.stringify(formData);
          }

            const result = await fetch("http://localhost:3005/users/seller/changeMyinfo", {
                  method: "PATCH",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: body
                 
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
            setSeller(savedUser);
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
            if (seller && currentValues[key] !== seller[key] ) {
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
        if(oneObjectChange && seller){
            const temp: any = {};
            temp[oneObjectChange] = {...seller[oneObjectChange] , ...changes}
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
                        detail.type === "date" && seller 
                          ? (seller[detail.name] ? new Date(seller[detail.name]).toISOString().split('T')[0] : "") 
                          : seller?.[detail.name] ?? ""
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
