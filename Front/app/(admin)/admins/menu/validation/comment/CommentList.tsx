'use client'
import React, { ChangeEvent, use, useContext, useEffect, useRef, useState } from 'react'
import useGetPendingComments from '../../../hooks/useGetPendingComments';
import CommentPopUp from './CommentPopUp';

interface Props {
  changeList: (list: string) => void
}

const CommentList = ({ changeList }: Props) => {

  const dialogRef = useRef<HTMLDialogElement>(null);
  let [typeSort, setTypeSort] = useState<string>("none");
  let [pageSize, setPageSize] = useState<number>(8);
  let [page, setPage] = useState<number>(0);
  let [search, setSearch] = useState<string | null>('');
  let searchRef = useRef<any>('');
  let { data: comments, error, isLoading } = useGetPendingComments({sort:typeSort, floor: page * pageSize, limit: pageSize, nameSearch: search });
  
  function handleSearch() {
    console.log(searchRef.current.value.trim());
    setSearch(searchRef.current.value.trim());
  }
  return (
    <div className=' flex-col bg-white my-10 md:m-10 rounded-md'>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }} className='border-b-2 shadow-md border-white p-7 px-13' >
        <select onChange={(e) => { changeList(e.target.value) }} className='bg-white ml-16 text-black'>
          <option value="comments" selected>کامنت ها</option>
          <option value="products">محصولات</option>
          
        </select>
        </form>
      {isLoading ? <span className="loading loading-dots loading-lg"></span> :
       
        <div className=' flex-col'>
          <ul>
            {comments?.pendingComments?.map((comment, index) => {
              return (
                <li key={index}>
                  <CommentPopUp comment={comment} />
                </li>
              )
            })}
          </ul>

          <div className='my-4 flex justify-center pb-5'>
            <button disabled={page == 0} onClick={() => setPage(page - 1)} className='btn btn-primary mx-3'>قبلی</button>
            <button disabled={!comments?.hasMore} onClick={() => setPage(page + 1)} className='btn btn-primary'>بعدی</button>
          </div>

        </div>
       } 
    </div>
  )
}

export default CommentList
