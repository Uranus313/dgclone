'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import AddCategoryPopUp from './AddCategoryPopUp';


const CategoryList = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    let [typeSort, setTypeSort] = useState<string>("none");
    let [pageSize, setPageSize] = useState<number>(8);
    let [page, setPage] = useState<number>(0);
    let [search, setSearch] = useState<string | null>('');
    let searchRef = useRef<any>('');
    //   let { data: users, error, isLoading } = useGetUsers({sort:typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });

    return (
        <div className=' flex-col bg-white my-10 md:m-10 rounded-md '>
            {/* <div className='flex border-b-2 shadow-md border-white p-7 px-13 w-full'> */}
               <AddCategoryPopUp />
            {/* </div> */}
            {/* {isLoading ? <span className="loading loading-dots loading-lg"></span> : */}
            <div className=' flex-col'>
                <ul>
                    {/* {users?.data?.map((user, index) => {
              return (
                <li key={index}>
                  <UserPopUp user={user} />
                </li>
              )
            })} */}
                </ul>

                <div className='my-4 flex justify-center pb-5'>
                    <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
                    {/* <button disabled={!users?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button> */}
                </div>

            </div>
            {/* }  */}
        </div>
    )
}

export default CategoryList
