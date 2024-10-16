'use client'

import { Category, ProductInterface } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
    product: ProductInterface
}
const ProductPopUp = ({ product }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState<Category | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

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
    async function getCategory(category_id: string) {
        if (!category_id) {
            return
        }
        const result = await fetch("https://localhost:8080/products/category/" + category_id, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonResult = await result.json();
        console.log(jsonResult);
        if (result.ok) {
            setCategory(jsonResult);
        } else {
            setError(jsonResult.error);
        }
    }
    const unbanProd = useMutation({
        mutationFn: async () => {
            const result = await fetch("https://localhost:8080/products/validate-prods" + `?ProdID=${product._id}&ValidationState=2`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },

            });
            const jsonResult = await result.json();
            console.log(jsonResult);
            if (result.ok) {
                return jsonResult
            } else {
                throw new Error(jsonResult.error);
            }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            product.validation_state = 2;
            closeModal();
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    const banProd = useMutation({
        mutationFn: async () => {
            const result = await fetch("https://localhost:8080/products/validate-prods" + `?ProdID=${product._id}&ValidationState=3`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },

            });
            const jsonResult = await result.json();
            console.log(jsonResult);
            if (result.ok) {
                return jsonResult
            } else {
                throw new Error(jsonResult.error);
            }
        },
        onSuccess: (savedUser) => {
            console.log(savedUser);
            product.validation_state = 3;
            closeModal();
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    return (
        <div>
            <div onClick={() => {
                openModal();
                getCategory(product.category_id);
            }} className=" flex py-5 border-b-2 border-b-border-color-list text-center">
                <p className="w-1/2">{product.title}</p>
                <p className="w-1/2">{product.rating.rate}</p>
            </div>
            <dialog ref={dialogRef} className="modal break-all">
                <div className="modal-box">
                    {error && <p>{error}</p>}
                    <h3 className="font-bold text-lg pb-2">{product.title}</h3>
                    <div className='block'>
                        <div className='text-right flex pb-2'>
                            <p className="pl-2"> برند :</p>
                            {(!category && !error) && <span className="loading loading-dots loading-lg"></span>}
                            {category?.title && <p>{category?.title}</p>}
                        </div>
                        <div className='flex pb-2'>
                            <p className="pl-2"> امتیاز :</p>
                            <p>{product.rating.rate}</p>
                        </div>
                        <div className='flex pb-2'>
                            <p className="pl-2"> تعداد فروش :</p>
                            <p>{product.sell_count}</p>
                        </div>

                        <div className='flex pb-2'>
                            <p className="pl-2"> تعداد ویزیت :</p>
                            <p>{product.visit_count}</p>
                        </div>

                        <div className=' flex justify-between pb-1'>
                            {product.is_from_iran ? (
                                <p> کالا ملی است</p>
                            ) : (
                                <p>کالا خارجی است</p>
                            )

                            }
                        </div>
                        <div className=' flex justify-between pb-2'>
                            {product.is_original ? (
                                <p>  اورجینال است</p>
                            ) : (
                                <p>غیر اورجینال است</p>
                            )

                            }
                        </div>
                        <div className=" flex-col">
                            <h3 >  ابعاد</h3>
                            <div className="flex">

                                <div className=" flex pb-2">
                                    <p className="pl-2"> طول :</p>

                                    <p>{(product.dimentions.length && product.dimentions.length) || "-"}</p>
                                </div>
                                <div className=" flex pb-2">
                                    <p className="pl-2 pr-4"> عرض  :</p>
                                    <p>{(product.dimentions.width && product.dimentions.width) || "-"}</p>
                                </div>
                                <div className=" flex pb-2">
                                    <p className="pl-2 pr-4"> ارتفاع  :</p>
                                    <p>{(product.dimentions.height && product.dimentions.height) || "-"}</p>
                                </div>
                            </div>
                        </div>
                        <div className=' flex pb-2'>
                            <p className="pl-2"> وزن  :</p>
                            <p>{(product.weight_KG && product.weight_KG) || "-"}</p>
                        </div>
                        <div className=' flex justify-between pb-2'>
                            <p>تاریخ اضافه شدن :</p>

                            <p>{product.date_added}</p>
                        </div>
                        <div className='text-right justify-between pb-2 '>
                            <p>توضیحات :</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                    {user &&
                        <div>
                            {user.roleID &&
                                <div>
                                    {user.roleID.accessLevels &&
                                        <div>
                                            {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "productManage" && accessLevel.writeAccess === true) &&
                                                <div className="my-4 flex justify-center">
                                                    {product.validation_state != 3 ? (

                                                        <div>
                                                            <button className='btn btn-error' type='button' onClick={() => banProd.mutate()}>بن</button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <button className='btn btn-error' type='button' onClick={() => unbanProd.mutate()}>لغو بن </button>
                                                        </div>
                                                    )
                                                    }
                                                    <div>
                                                        <button className='btn btn-warning mx-3' type='button' onClick={closeModal}>خروج</button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button type="button">close</button>
                </form>
            </dialog>
        </div>

    )
}

export default ProductPopUp
