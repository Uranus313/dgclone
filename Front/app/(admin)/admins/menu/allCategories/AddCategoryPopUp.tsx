"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useGetRoles from "../../hooks/useGetRoles";

const AddCategoryPopUp = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
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
        }
    };
    const queryClient = useQueryClient();
    const addCategory = useMutation({
        mutationFn: async (formData: any) => {
            const result = await fetch("https://localhost:8080/products/category", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),
            });
            const jsonResult = await result.json();
            if (result.ok) {
                return jsonResult;
            } else {
                throw new Error(jsonResult.error);
            }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            // queryClient.invalidateQueries({ queryKey: ["employeeList"] });
            closeModal();

        },
        onError: (error) => {
            console.log(error);
            setError(error.message);
        },
    });
    async function submit(formData: any) {
        addCategory.mutate(formData);
    }
    return (
        <div>
            <div className="flex border-b-2 shadow-md border-white w-full p-7 ">
                <button className=' ' onClick={() => { openModal() }}>
                    <svg
                        fill="#BD1684"
                        height="47px"
                        width="47px"
                        version="1.1"
                        viewBox="-3.08 -3.08 34.12 34.12"
                        stroke="#000000"
                        stroke-width="0.00027963">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_traerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981 C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z "></path>

                        </g>
                    </svg>
                </button>
                <p className='text-primary-color pt-3'>اضافه کردن دسته بندی</p>
            </div>
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    <h3 className="font-bold text-lg mr-3">اضافه کردن دسته بندی</h3>
                    <form >
                        {/* onSubmit={handleSubmit(submit)} */}
                        <label className="p-2 block ">
                            <input type="text" className="bg-primary-bg rounded-md" placeholder=' نام'  {...register("title")} />
                        </label>
                        <label className="p-2 block">
                            <textarea className="bg-primary-bg rounded-md h-24" placeholder='توضیحات' {...register("description")} />
                        </label>
                        <label className="p-2 block">
                            <input type="url" className="bg-primary-bg rounded-md" placeholder=' لینک ' {...register("link")} />
                        </label>
                        <div className=" my-4">
                            <button className="btn btn-success mx-3" type="submit">
                                تایید
                            </button>
                            <button
                                className="btn btn-warning"
                                type="button"
                                onClick={closeModal}
                            >
                                خروج
                            </button>

                        </div>

                    </form>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>
    );
};

export default AddCategoryPopUp;
