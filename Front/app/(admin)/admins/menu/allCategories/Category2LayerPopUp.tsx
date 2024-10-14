'use client'

import { useState } from 'react';
import { Category } from "@/app/components/Interfaces/interfaces";
import useGetChildCategory from "../../hooks/useGetChildCategory";
import AddCategoryPopUp from "./AddCategoryPopUp";

export interface Props {
    category: Category
}

const Category2LayerPopUp = ({ category }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    let { data: categories, isLoading } = useGetChildCategory(category._id);

    return (
        <div className="border-b-2 border-b-border-color-list w-full pt-6 pb-8 px-8">
            <div className="flex">
                <AddCategoryPopUp cateId={category._id} size="28px" color="#b36f9d" />
                <button className="pr-1 pb-1" onClick={() => setIsOpen(!isOpen)}>{category.title}</button>
            </div>

            {isOpen && (
                <div className="bg-base-200 pt-2 px-16">
                    {isLoading ? (
                        <span className="loading loading-dots loading-lg"></span>
                    ) : (
                        <div className='flex-col'>
                            <ul>
                                {categories && categories.map((category: Category, index: React.Key | null | undefined) => (
                                    <li key={index} className="border-b-2 border-b-border-color-list py-4 px-8">
                                        <p className="pr-1 pb-2.5">{category.title}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Category2LayerPopUp;
