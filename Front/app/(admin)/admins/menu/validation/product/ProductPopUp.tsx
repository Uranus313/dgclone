'use client'

import { ProductInterface } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'
import { Comment } from "@/app/components/Interfaces/interfaces";
import Link from "next/link";


interface Props {
    product: ProductInterface
}
const ProductPopUp = ({ product }: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();


    const unbanProduct = useMutation({
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
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });

    const banProduct = useMutation({
        mutationFn: async () => {
            const result = await fetch("http://localhost:8080/products/validate-prods" + `?ProdID=${product._id}&ValidationState=3`, {
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
        },
        onError: (error) => {
            console.log(error);
            setError(error.message)
        }
    });



    return (

        <div>
            {product.validation_state == 1 &&

                <div className='w-full pt-10 lg:p-10 border-b-2 border-border'>
                    <div className='flex pb-5 '>
                        <p className='pr-10 text-text-color break-all'>اسم محصول: {product.title}</p>
                        <p className='w-0 h-0 lg:w-auto lg:h-auto pr-10 pl-5 text-text-color invisible lg:visible'> آی دی فروشنده   : {product.sellers[0] && product.sellers[0].seller_id || "-"}</p>
                    </div>
                    <div className='lg:flex px-10'>
                        <img className='border-0 ml-56' src={product.images[0]} width='70' height='90' />
                        <Link className='lg:w-0 lg:h-0 text-primary-color pt-2 lg:invisible' href={"/products/" + product.category_id + "/" + product._id + "/"}>دیدن صفحه محصول</Link>
                        <div>
                            <button onClick={() => unbanProduct.mutate()} className='text-green-box border-green-box border-2 my-5 mb-8 ml-3 py-2 px-5 rounded-md'>
                                تایید
                            </button>
                            <button onClick={() => banProduct.mutate()} className='text-red-box border-red-box border-2 rounded-md my-5 mb-8 py-2 px-5'>
                                رد
                            </button>

                        </div>
                    </div>
                    <Link className='w-0 h-0 lg:w-auto lg:h-auto text-primary-color px-10 pt-2 invisible lg:visible' href={"/products/" + product.category_id + "/" + product._id + "/"}>دیدن صفحه محصول</Link>

                </div>
            }
        </div>

    )
}

export default ProductPopUp
