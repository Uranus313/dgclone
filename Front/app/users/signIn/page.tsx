"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<String | null>(null);
  const router = useRouter();
  const {data , status} = useSession();
  useEffect(() =>{
    console.log(status);
    console.log(data); 
  },[status,data])

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      phoneNumber : phoneNumberRef.current?.value.trim(),
      password : passwordRef.current?.value.trim(),
    });
    console.log(result)
    if (result?.error) {
        // console.log(result)
      setError(result.error);
    } else {
      router.push("/"); // Redirect to home or any other page on success
    }
  };

  return (
    <>
    <button onClick={() =>{
        signOut({callbackUrl: '/'})
    }}>sign out</button>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          PhoneNumber:
          <input type="number" ref={phoneNumberRef} className=" m-4" />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" ref={passwordRef} />
        </label>
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Sign In</button>
    </form>
    </>

  );
};

export default SignIn;