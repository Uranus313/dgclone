'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import AddCategoryPopUp from './AddCategoryPopUp';
import useGetCategories from '../../hooks/useGetCategories';
import { Category } from '@/app/components/Interfaces/interfaces';
import Category1LayerPopUp from './Category1LayerPopUp';


const CategoryList = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    let [typeSort, setTypeSort] = useState<string>("none");
    let [pageSize, setPageSize] = useState<number>(8);
    let [page, setPage] = useState<number>(0);
    let [search, setSearch] = useState<string | null>('');
    let searchRef = useRef<any>('');
    let { data: category, error, isLoading } = useGetCategories();

    return (
        <div className=' flex-col bg-white my-10  rounded-md '>
            <div className='flex w-full '>
                <AddCategoryPopUp cateId="000000000000000000000000" size="47px" color="#BD1684" hasDetail={false} picNum={true} />
                <p className='text-primary-color pt-3'>اضافه کردن دسته بندی</p>
            </div>
            {isLoading ? <span className="loading loading-dots loading-lg"></span> :
                <div className=' flex-col'>
                    {category &&

                        <ul>
                            {category.map((category: Category, index: React.Key | null | undefined) => {
                                return (
                                    <li key={index}>
                                        <Category1LayerPopUp category={category} />
                                    </li>
                                )
                            })}
                        </ul>
                    }
                   
                </div>
            }
        </div>
    )
}

export default CategoryList
