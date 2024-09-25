"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userContext from "@/app/contexts/userContext";
import { useUser } from "@/app/hooks/useUser";

interface LoginInfo{
  phoneNumber : string,
  password : string
}

const SignIn = () => {
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();

  const {user , setUser , isLoading} = useUser();
    const login = useMutation({
        mutationFn: async (formData : LoginInfo) => {
            const result = await fetch("http://localhost:3005/users/admin/logIn", {
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
            router.push('/admins');
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
  const handleSignInSubmit = async () => {
    login.mutate({
      phoneNumber : phoneNumberRef.current?.value.trim() || "",
      password : passwordRef.current?.value.trim() || "",
    });
  };
  return (
  <>
    <h1>DigiMarket admin logIn</h1>
    {error && <p>{error}</p>}
    <div className={"flex flex-col"}>
        <label className=" block" >
          PhoneNumber:
          <input type="number" ref={phoneNumberRef} className=" m-4" />
        </label>
        <label className=" block">
          Password:
          <input type="password" ref={passwordRef}/>
        </label>
        <button onClick={handleSignInSubmit} className="btn btn-primary">enter</button>
    </div>
    
  </>

  );
};

export default SignIn;