'use client'

import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'

export interface Admin{
    firstName : string,
    lastName : string,
    isBanned : boolean | undefined,
    email : string,
    birthDate : string,
    nationalID : string,
    phoneNumber : string,
    _id : string

}
export interface Props{
    admin : Admin
}
const AdminPopUp = ({admin} : Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error , setError] = useState<string | null>(null);
    // const {user , setUser , isLoading} = useContext(userContext);
  
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
    const banAdmin = useMutation({
        mutationFn: async () => {
            const result = await fetch("http://localhost:3005/users/admin/banAdmin", {
                  method: "PATCH",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({adminID : admin._id}),
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
            admin.isBanned = true;
            closeModal();
            // router.push('/');
            // router.push('/');
        },
        onError: (error) => {
          console.log(error);
          setError(error.message)
          // setError(error)
        }
    });
    const unbanAdmin = useMutation({
        mutationFn: async () => {
            const result = await fetch("http://localhost:3005/users/admin/unbanAdmin", {
                  method: "PATCH",
                  credentials: 'include',
                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({adminID : admin._id}),
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
            admin.isBanned = false;
            closeModal();
            // router.push('/');
            // router.push('/');
        },
        onError: (error) => {
          console.log(error);
          setError(error.message)
          // setError(error)
        }
    });

    return (
      <div>
        <div onClick={openModal} className=' flex justify-between'>
            <p>{admin.firstName + ' ' + admin.lastName}</p>
            {admin.isBanned && <p className=' text-red-500'>بن شده</p>}
        </div>

        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            {error && <p>{error}</p>}
            <h3 className="font-bold text-lg">{admin.firstName + ' ' + admin.lastName}</h3>
            <div className='block'>
                <div className=' flex justify-between'>
                <p>ایمیل :</p>

                    <p>{admin.email}</p>
                </div>
                <div className=' flex justify-between'>
                <p>شماره تلفن :</p>

                    <p>{admin.phoneNumber}</p>
                </div>
                <div className=' flex justify-between'>
                <p>کد ملی :</p>

                    <p>{admin.nationalID}</p>
                </div>
                <div className=' flex justify-between'>
                <p>تاریخ تولد :</p>

                    <p>{admin.birthDate}</p>
                </div>
                <div className=' flex justify-between'>
                <p>آیدی :</p>

                    <p>{admin._id}</p>
                </div>
            </div>
            {admin.isBanned? <button className='btn btn-primary' type='button' onClick={() => unbanAdmin.mutate()}>لغو بن</button>:<button className='btn btn-error' type='button' onClick={() => banAdmin.mutate()}>بن</button>}
            
            <button className='btn btn-warning' type='button' onClick={closeModal}>خروج</button>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      </div>
    );
}

export default AdminPopUp
