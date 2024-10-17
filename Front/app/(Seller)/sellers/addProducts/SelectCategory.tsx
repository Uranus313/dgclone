'use client'
import { Category } from '@/app/components/Interfaces/interfaces';
import useGetCategories from '@/app/hooks/useGetCategories';
import Link from 'next/link';
import React, { useRef, useState } from 'react'

interface Props{
  Categories:Category[]
}

const SelectCategory =({Categories}:Props) => {

  console.log('hhhjjjj',Categories)
  // const {data:Categories=[]} = useGetCategories()
  const optionsStack  = useRef<Category[][]>([Categories])
  const [options,setOptions]= useState<Category[] | undefined>(Categories) 
  function HandleOptions(children:Category[]){
    optionsStack.current.push(children)
    setOptions(children)
  }

  {console.log(Categories,'cccc' , options)}

  return (
  
    <dialog id="categories" className="modal w-full">
        <div className="modal-box  w-11/12 max-w-5xl p-2 flex flex-col">
            <form method="dialog" className='inline'>
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-lg btn-circle btn-ghost" onClick={()=>{setOptions(Categories);optionsStack.current=[Categories]}}>✕</button>
            </form>
            <h3 className="font-bold inline text-lg mt-2">انتخاب دسته‌بندی</h3>
            <hr className='text-grey-border  my-2'></hr>

            <div className='p-10 h-96 overflow-auto'>
                <label className="input w-full input-bordered flex items-center gap-2 mb-12 bg-primary-bg">
                    <input type="text" className="grow" placeholder=" جستجو ی دسته " />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                        />
                    </svg>
                </label>
                <div className='grid grid-cols-2 gap-2'>


                    {options?.map(option=>(
                        option.Childs?.length != 0
                            ?   <button className='flex items-center justify-between py-5 border-b border-grey-border text-start' onClick={()=>HandleOptions(option.Childs ?? [])} id={option.ID}>
                                    <p>{option.Title}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>  
                                
                            :   <Link href={`/sellers/addProducts/list/?category=${option.ID}`} className='flex items-center justify-between py-5 border-b border-grey-border text-start' id={option.ID}>
                                    <p>{option.Title}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-10 text-primary-seller">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </Link> 
                    ))}
                </div>

            </div>
            <hr className='text-grey-border  my-2'></hr>

            {optionsStack.current.length>=2 && <button onClick={()=>{setOptions(optionsStack.current[optionsStack.current.length-2]); optionsStack.current.pop()}} className='p-3 rounded-md border border-primary-seller text-primary-seller text-xs my-3 mx-10 w-fit self-end'>بازگشت به مرحله ی قبل</button>}

        </div>
    </dialog>

  )
}

export default SelectCategory