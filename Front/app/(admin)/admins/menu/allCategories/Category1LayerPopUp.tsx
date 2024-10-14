'use client'

import { Category, Order } from "@/app/components/Interfaces/interfaces";
import { useUser } from "@/app/hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import React, { useContext, useRef, useState } from 'react'


export interface Props {
    category: Category
}
const Category1LayerPopUp = ({ category }: Props) => {
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

    return (

        <div className="collapse ">
            <input type="checkbox" name="my-accordion-1" />
            <div onClick={openModal} className="collapse-title flex border-b-2 border-b-border-color-list w-full pt-6 pb-8 px-16 ">
                <p>{category.title}</p>
            </div>
            <div className="collapse">
                    
                <div className="collapse-content  bg-base-200 pt-2 px-16">
                    <input type="checkbox" name="my-accordion-2" />
                    <p className="collapse-title">hello</p>
                </div>
                <div className="collapse-content bg-base-200 pt-2 px-16">
                    <p>hello</p>
                </div>
            </div>
        </div>

    );
}

export default Category1LayerPopUp
