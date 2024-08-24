'use client'
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import userContext from '@/app/contexts/userContext';
import { useMutation } from '@tanstack/react-query';
import InputPopUp from './InputPopUp';
import PasswordPopUp from './PasswordPopUp';
import MoneyReturnPopUp from './MoneyReturnPopUp';
// type FormValues = {
//   phoneNumber?: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string ;
//   birthDate?: string;
//   job?: string;
//   password?: string;
//   economicCode?: string;
// };


const MyFormComponent = () => {
    const [error , setError] = useState<string | null>(null);
    const {user , setUser , isLoading} = useContext(userContext);
//     const update = useMutation({
//         mutationFn: async (formData : any) => {
//             const result = await fetch("http://localhost:3005/users/user/changeMyinfo", {
//                   method: "PATCH",
//                   credentials: 'include',
//                   headers: {
//                     "Content-Type": "application/json",
//                   },

//                   body: JSON.stringify(formData),
//             });
//             const jsonResult = await result.json();
//             if(result.ok){
//                 return jsonResult
//             }else{
//                 throw new Error(jsonResult.error);
//             }    
//         },
//         onSuccess: (savedUser) =>{
//             console.log(savedUser);
//             // localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
//             // queryClient.invalidateQueries(["user"]);
//             setUser(savedUser);
//             // router.push('/');
//             // router.push('/');
//         },
//         onError: (error) => {
//           // Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})// navigate("/");
//           //   console.log(error)
//           //   console.log(error.response?.data.detail)
//           console.log(error);
//           if(error.message.error){

//           }          
//           setError(error.message)
//           // setError(error)
//         }
//     });
//     const { register, handleSubmit, getValues} = useForm();
//   const getChangedValues = () => {
//     const defaultValues : FormValues= {
//         phoneNumber: user?.phoneNumber || "",
//         firstName: user?.firstName || "",
//         lastName: user?.lastName || "",
//         email: user?.email || "",
//         birthDate: user?.birthDate || "",
//         job: user?.job || "",
//         economicCode: user?.economicCode || "",
//     }
//     const currentValues = getValues();
//     const changedValues: Partial<FormValues> = {};
//       for (const key in currentValues) {

//         if (currentValues[key as keyof FormValues] !== defaultValues[key as keyof FormValues]) {
//            changedValues[key as keyof FormValues] = currentValues[key as keyof FormValues];
//         }
      
//     }
    

//     return changedValues;
// };
//     const onSubmit = async (formData : any) => {
//         const changes = getChangedValues();
//         console.log(changes);
//         if(Object.keys(changes).length == 0){
//             setError("هیچ مقداری تغییر نکرده است");
//             return;
//         }
//         update.mutate(changes)
        
//     };

    return (
        <div>
            <InputPopUp inputDetails={[{title : "نام" , type: "text" , name: "firstName"},{title : "نام خانوادگی" , type: "text" , name: "lastName"}]} buttonMode='input' titleLabel='نام و نام خانوادگی' inputDefaultValue={"" + (user?.firstName? user?.firstName : "") + (user?.lastName? " " + user?.lastName : "") } inputType='text' mainText='سلام'  />
            <InputPopUp inputDetails={[{title : "شماره تلفن همراه" , type: "text" , name: "phoneNumber"}]} buttonMode='input' titleLabel='شماره تلفن همراه' inputDefaultValue={user?.phoneNumber } inputType='number' mainText='سلام'  />
            <InputPopUp inputDetails={[{title : "ایمیل" , type: "email" , name: "email"}]} buttonMode='input' titleLabel='پست الکترونیکی' inputDefaultValue={user?.email} inputType='text' mainText='سلام'  />
            <InputPopUp inputDetails={[{title : "تاریخ تولد" , type: "date" , name: "birthDate"}]} buttonMode='input' titleLabel='تاریخ تولد' inputDefaultValue={user?.birthDate? new Date(user?.birthDate).toISOString().split('T')[0] : ""} inputType='date' mainText='سلام'  />
            <InputPopUp inputDetails={[{title : "شماره اقتصادی" , type: "text" , name: "economicCode"}]} buttonMode='input' titleLabel='شماره اقتصادی' inputDefaultValue={user?.economicCode } inputType='number' mainText='سلام'  />
            <InputPopUp inputDetails={[{title : "شغل" , type: "text" , name: "job"}]} buttonMode='input' titleLabel='شغل' inputDefaultValue={user?.job} inputType='text' mainText='سلام'  />
            <PasswordPopUp />
            <MoneyReturnPopUp />

        </div>
    
        //         <label className="block">
        //             روش برگشت پول:
        //             <input type="text" readOnly defaultValue={user?.moneyReturn?.method}  className="block" />
        //         </label>
// password
        //     <div className="block">
        //         <label className="block">
        //             آدرس:
        //             <input type="text" readOnly defaultValue={user?.addresses[0]?.city}  className="block" />
        //         </label>
        //     </div>
        //     <button type='submit'>اعمال تغییرات</button>
        // </form>
    );
};

export default MyFormComponent;
