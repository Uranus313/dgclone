'use client'

import { ProductVariant } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { Comment } from "@/app/components/Interfaces/interfaces";
import Link from "next/link";


interface Props {
    product: ProductVariant
}
const ProductPopUp = ({ product }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
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
    const unbanProduct = useMutation({
        mutationFn: async () => {
            const result = await fetch("https://localhost:8080/products/validate-variant" + `?prodID=${product._id}&SellerID=${product.seller_id}&ColorID=${product.seller_quantity.color._id}&ValidationState=2`, {
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
            product.seller_quantity.validation_state = 2;
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    const banProduct = useMutation({
        mutationFn: async () => {
            const result = await fetch("https://localhost:8080/products/validate-variant" + `?prodID=${product._id}&SellerID=${product.seller_id}&ColorID=${product.seller_quantity.color._id}&ValidationState=3`, {
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
            product.seller_quantity.validation_state = 3;
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    return (
        <div>
            {product.seller_quantity.validation_state == 1 &&
                <div className='w-full p-10 border-b-2 border-border'>
                    <div className=' pb-5'>
                        <div className='flex pb-5'>
                            <p className='text-text-color'>آی دی محصول : </p>
                            <p className="pr-5">{product._id}</p>
                            <p className='text-text-color pr-10'> رنگ: </p>
                            <p className="pr-5">{product.seller_quantity.color.title}</p>
                        </div>
                        <div className='flex pb-5'>

                            <p className='text-text-color'>آی دی فروشنده: </p>
                            <p className="pr-5">{product.seller_id}</p>
                            <p className='text-text-color pr-10'>اسم فروشنده: </p>
                            <p className="pr-5">{product.seller_title}</p>
                        </div>

                    </div>
                    <Link className=' text-primary-color ' href={"/products/" + product.category_id + "/" + product._id + "/"}>دیدن صفحه محصول</Link>
                       
                    <div className='flex justify-center'>
                        {user &&
                            <div>
                                {user.roleID &&
                                    <div>
                                        {user.roleID.accessLevels &&
                                            <div>
                                                {user.roleID.accessLevels.some(accessLevel => accessLevel.level === "productManage" && accessLevel.writeAccess === true) &&
                                                    <div>
                                                        <button onClick={() => unbanProduct.mutate()} className='text-green-box border-green-box border-2 py-5 pb-8 mx-3'>
                                                            تایید
                                                        </button>
                                                        <button onClick={() => banProduct.mutate()} className='text-red-box border-red-box border-2 py-5 pb-8'>
                                                            رد
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        }


                    </div>

                </div>
            }
        </div>

    )
}

export default ProductPopUp
