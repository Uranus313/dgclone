import { useState } from 'react';
import { Category } from "@/app/components/Interfaces/interfaces";
import useGetChildCategory from "../../hooks/useGetChildCategory";
import Category2LayerPopUp from "./Category2LayerPopUp";
import AddCategoryPopUp from "./AddCategoryPopUp";

export interface Props {
    category: Category
}

const Category1LayerPopUp = ({ category }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    let { data: categories, isLoading } = useGetChildCategory(category._id);

    return (
        <div className="border-b-2 border-b-border-color-list w-full pt-6 pb-8 px-8">
            <div className="flex">
                <AddCategoryPopUp cateId={category._id} size="38px" color="#b94b94" hasDetail={false} picNum={false} />
                <button className='pb-1' onClick={() => setIsOpen(!isOpen)}>{category.title}</button>
            </div>

            {isOpen && (
                <div className="pt-2 ">
                    {isLoading ? (
                        <span className="loading loading-dots loading-lg"></span>
                    ) : (
                        <div className='flex-col'>
                            <ul>
                                {categories && categories.map((category: Category, index: React.Key | null | undefined) => (
                                    <li key={index}>
                                        <Category2LayerPopUp category={category} />
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

export default Category1LayerPopUp;
