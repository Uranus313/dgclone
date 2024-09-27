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
            const result = await fetch("http://localhost:3005/users/employee/logIn", {
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
            setUser(savedUser);
            router.push('/employees');
        },
        onError: (error) => {
          console.log(error);
          setError(error.message)
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
    <h1>DigiMarket employee logIn</h1>
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