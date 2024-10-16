'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';

const AddAdminPopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  // const {user , setUser , isLoading} = useUser();
  const { register, handleSubmit, getValues } = useForm();

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
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };
  const queryClient = useQueryClient();
  const addAdmin = useMutation({
    mutationFn: async (formData: any) => {
      const result = await fetch("http://localhost:3005/users/admin/signUp", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });
      const jsonResult = await result.json();
      if (result.ok) {
        return jsonResult
      } else {
        throw new Error(jsonResult.error);
      }
    },
    onSuccess: (savedUser) => {
      console.log(savedUser);
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
      closeModal();
    },
    onError: (error) => {
      console.log(error);
      setError(error.message)
    }
  });
  async function submit(formData: any) {
    addAdmin.mutate(formData);
  }
  return (
    <div>
      <button onClick={openModal} className='btn btn-error mr-5 mt-12 lg:mr-0 lg:mt-0 '>اضافه کردن ادمین </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {error && <p>{error}</p>}
          <h3 className="font-bold text-lg">اضافه کردن ادمین</h3>
          <form ref={formRef} onSubmit={handleSubmit(submit)}>
            <label className='p-2 block'>
              <input type="text" className="bg-primary-bg rounded-md" placeholder=' نام' {...register("firstName")} />
            </label>
            <label className='p-2 block'>
              <input type="text" className="bg-primary-bg rounded-md" placeholder='  نام خانوادگی' {...register("lastName")} />
            </label>
            <label className='p-2 block'>
              <input type="number" className="bg-primary-bg rounded-md" placeholder=' شماره تلفن' {...register("phoneNumber")} />
            </label>
            <label className='p-2 block'>
              <input type="email" className="bg-primary-bg rounded-md" placeholder=' ایمیل' {...register("email")} />
            </label>
            <label className='p-2 block'>
              <input type="number" className="bg-primary-bg rounded-md" placeholder=' کد ملی' {...register("nationalID")} />
            </label>
            <label className='p-2 block'>
              <p> تاریخ تولد:</p>
              <input type="date" className="bg-primary-bg rounded-md" {...register("birthDate")} />
            </label>
            <label className='p-2 block'>
              <input type="password" className="bg-primary-bg rounded-md" placeholder='  رمز عبور' {...register("password")} />
            </label>

            <div className=" my-4">
              <button className='btn btn-warning mx-3' type='button' onClick={closeModal}>خروج</button>
              <button className='btn btn-success' type='submit' >تایید</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={closeModal}>
          <button type="button">close</button>
        </form>
      </dialog>
    </div>
  );
}

export default AddAdminPopUp
