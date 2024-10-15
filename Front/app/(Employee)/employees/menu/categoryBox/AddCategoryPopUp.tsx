"use client";

import { Category } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { title } from "process";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
export interface Props {
    cateId: string
    size: string
    color: string
    hasDetail: Boolean
}
const AddCategoryPopUp = ({ cateId, size, color, hasDetail }: Props) => {
    const [theme, setTheme] = useState('#BD1684');
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState([{ title: '', keys: [''] }]);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit } = useForm();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const { user, setUser, isLoading } = useUser();

    const handleChangeTitle = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newDetails = [...details];
        newDetails[index].title = event.target.value;
        setDetails(newDetails);
    };

    const handleChangeCount = (detailIndex: number, countIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newDetails = [...details];
        newDetails[detailIndex].keys[countIndex] = event.target.value;
        setDetails(newDetails);
    };
    const addDetail = () => {
        setDetails([...details, { title: '', keys: [''] }]);
    };

    const addCount = (index: number) => {
        const newDetails = [...details];
        newDetails[index].keys.push('');
        setDetails(newDetails);
    };
    const handleChangeColor = (e: any) => {
        setTheme(e.target.value);
    };

    const handleChangeTitleCategory = (e: any) => {
        setTitle(e.target.value);
    };

    const handleChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };
    const handleChangeLink = (e: any) => {
        setLink(e.target.value);
    };

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
            queryClient.invalidateQueries({ queryKey: ["categoryList"] });
            queryClient.invalidateQueries({ queryKey: ['childCategoryList' + cateId] });
            closeModal();

        },
        onError: (error) => {
            console.log(error);
            setError(error.message);
        },
    });
    async function submit() {
        addCategory.mutate({ title: title, description: description, link: link, parent_id: cateId, theme: theme, details: details });
    }
    return (
        <div>
            {user &&
                <div>
                    {user.roleID &&
                        <div>
                            {user.roleID.accessLevels &&
                                <div>
                                    {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "categoryManage" && accessLevel.writeAccess === true) &&
                                        <div>
                                            <button onClick={() => { openModal() }}>
                                                <svg
                                                    fill={color}
                                                    height={size}
                                                    width={size}
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
                                            <dialog ref={dialogRef} className="modal">
                                                <div className="modal-box">
                                                    {error && <p>{error}</p>}
                                                    <h3 className="font-bold text-lg mr-3">اضافه کردن دسته بندی</h3>
                                                    <form onSubmit={handleSubmit(submit)}>
                                                        <label className="p-2 block ">
                                                            <input type="text" className="bg-primary-bg rounded-md" placeholder=' نام' value={title} onChange={handleChangeTitleCategory} required />
                                                        </label>
                                                        <label className="p-2 block">
                                                            <textarea className="bg-primary-bg rounded-md h-24" placeholder='توضیحات' value={description} onChange={handleChangeDescription} required />
                                                        </label>
                                                        {hasDetail &&
                                                            <div>
                                                                <button className="flex p-2" onClick={addDetail}>
                                                                    <svg
                                                                        fill="#696969"
                                                                        height="30px"
                                                                        width="30px"
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
                                                                    <p className='pt-1  text-text-color' >اضافه کردن خصوصیات</p>

                                                                </button>
                                                                {details.map((detail, detailIndex) => (
                                                                    <div key={detailIndex} className=" border-b-2 border-border-color-list py-2 w-full">
                                                                        <label className="p-2 block ">
                                                                            <input type="text" className="bg-primary-bg rounded-md" placeholder=' عنوان' name="title" value={detail.title} onChange={(e) => handleChangeTitle(detailIndex, e)} />
                                                                        </label>
                                                                        <div>
                                                                            {detail.keys.map((keys, keysIndex) => (
                                                                                <label key={keysIndex} className="p-2 block ">
                                                                                    <input type="text" className="bg-primary-bg rounded-md" placeholder=' کلید' name="title" value={keys}
                                                                                        onChange={(e) => handleChangeCount(detailIndex, keysIndex, e)} />
                                                                                </label>
                                                                            ))}
                                                                        </div>

                                                                        <button className='py-1 px-3  text-border-color-list' onClick={() => addCount(detailIndex)}>اضافه کردن کلید</button>

                                                                    </div>

                                                                ))}
                                                            </div>
                                                        }
                                                        <label className="p-2 block">
                                                            <input type="url" className="bg-primary-bg rounded-md" placeholder=' لینک ' value={link} onChange={handleChangeLink} required />
                                                        </label>
                                                        <label className="p-2 block">
                                                            <p>
                                                                تم دسته بندی :
                                                            </p>
                                                            <input type="color" className="w-1/3 border-2 rounded-md border-border-color-list" value={theme} onChange={handleChangeColor} color={theme} />
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
                                    
                                    }
                                </div>

                            }
                        </div>
                    }
                </div>

            }
        </div>
    );
};

export default AddCategoryPopUp;
