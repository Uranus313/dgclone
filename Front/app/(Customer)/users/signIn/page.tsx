"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userContext from "@/app/contexts/userContext";

interface LoginInfo{
  phoneNumber : string,
  password : string
}

const SignIn = () => {
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();
  const [showPhoneNumberPage, setShowPhoneNumberPage] = useState<Boolean>(true); 
  const [showPasswordPage, setShowPasswordPage] = useState<Boolean>(false); 
  const [showCompleteInfoPage, setShowCompleteInfoPage] = useState<Boolean>(false); 

  // useEffect(() =>{
  //   console.log(status);
  //   console.log(data); 
  // },[status,data])
  const {user , setUser , isLoading} = useUser();
  const queryClient = useQueryClient();
    const login = useMutation({
        mutationFn: async (formData : LoginInfo) => {
            const result = await fetch("http://localhost:3005/users/user/logIn", {
                  method: "POST",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                  }),
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
            router.push('/');
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
    const signUp = useMutation({
      mutationFn: async (phoneNumber : string) => {
          const result = await fetch("http://localhost:3005/users/user/signUp", {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  phoneNumber: phoneNumber               
                }),
          });
          const jsonResult = await result.json();
          console.log(jsonResult)
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
          // router.push('/');
          setShowPhoneNumberPage(false);
          setShowCompleteInfoPage(true);
      },
      onError: (error) => {
        // Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})// navigate("/");
        //   console.log(error)
        //   console.log(error.response?.data.detail)
        console.log(error)

        if(error.message == 'an account with this phone number already exists (phoneNumber)'){
          setShowPhoneNumberPage(false);
          setShowPasswordPage(true);
        }else{
          setError(error.message)
        }
        // setError(error)
      }
  });
  const handleSignInSubmit = async () => {
    
    login.mutate({
      phoneNumber : phoneNumberRef.current?.value.trim() || "",
      password : passwordRef.current?.value.trim() || "",
    });
    // console.log(result)
    // if (result?.error) {
    //     // console.log(result)
    //   console.log(result.error);
    //   setError(result.error);
    // } else {
    //   router.push("/"); // Redirect to home or any other page on success
    // }
  };
  const handlePhoneNumberSubmit = () => {
    //validate
    signUp.mutate(phoneNumberRef.current?.value.trim() || "");
    // console.log("hello")
    // const result = await fetch("http://localhost:3005/users/user/signUp", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     phoneNumber: phoneNumberRef.current?.value.trim()
    //   }),
    // }); 
    // console.log(result)
    // const jsonResult = await result.json()
    // if (result.ok){
    //   // await handleSignInSubmit(phoneNumberRef.current?.value.trim(),"123456789");
    //   setShowPhoneNumberPage(false);
    //   setShowCompleteInfoPage(true);
    // }else if (jsonResult.error) {
    //   if(jsonResult.error == 'an account with this phone number already exists (phoneNumber)'){
    //     setShowPhoneNumberPage(false);
    //     setShowPasswordPage(true);
    //   }else{
    //     setError(jsonResult.error);
    //   }
    // }
  };
  return (
  <>
    <h1>DigiMarket</h1>
    {error && <p>{error}</p>}
    <div className={showPhoneNumberPage? "flex flex-col" : "hidden"}>
        <label className=" block" >
          PhoneNumber:
          <input type="number" ref={phoneNumberRef} className=" m-4" />
        </label>
        <button onClick={handlePhoneNumberSubmit} className="btn btn-primary">enter</button>
    </div>
    <div className={showPasswordPage? "flex flex-col" : "hidden"}>
        <label className=" block">
          Password:
          <input type="password" ref={passwordRef}/>
        </label>
        <button onClick={handleSignInSubmit} className="btn btn-primary">enter</button>
    </div>
    <div className={showCompleteInfoPage? "flex" : "hidden"}>
        <Link className="btn btn-primary" href={"/"}>ورود به دیجیمارکت</Link>
        <Link className="btn btn-primary" href={"/users/menu/changeInfo"}>کامل کردن اکانت</Link>
    </div>
    
  </>

  );
};

export default SignIn;