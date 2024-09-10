'use client'
import Link from 'next/link';
import React, { useRef, useState } from 'react'


export interface detail{
    title: string,
    keys: string[]
  }
  export interface Category {
    title: string;
    children?: Category[];
    details: detail[]; //fix
    parentID?: string;
    id: string;
    pictures: string[];
    desc?:string;
    link?:string;
    theme?:string;
  }
  
  
  //#region Categories
  
  
  export const Categories: Category[] = [
    {
      title: "کالای دیجیتال",
      children: [
        {
          title: "لپتاپ",
          children: [
            {
              title: "لپتاپ اپل",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "2",
              id: "8",
              pictures: ["" , ''],
            },
            {
              title: "لپتاپ ایسوس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "2",
              id: "9",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
          parentID: "1",
          id: "2",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/dcb735863856217c8f64d891269b876c621772d7_1672570805.jpg'],
        },
        {
          title: "موبایل",
          children: [
            {
              title: "موبایل اپل",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "3",
              id: "30",
              pictures: ["" , ''],
            },
            {
              title: "موبایل سامسونگ",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "3",
              id: "31",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "3",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/40026b18c2b053ac4a68c3288556dc899a77aecd_1673784561.jpg'],
        },
  
        {
          title: "کنسول بازی",
          children: [
            {
              title: "پلی استیشن",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "41",
              pictures: ["" , ''],
            },
            {
              title: "ایکس باکس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "42",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "40",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        },
  
        {
          title: "کنسول بازی",
          children: [
            {
              title: "پلی استیشن",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "43",
              pictures: ["" , ''],
            },
            {
              title: "ایکس باکس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "44",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "40",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        },
  
        {
          title: "کنسول بازی",
          children: [
            {
              title: "پلی استیشن",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "45",
              pictures: ["" , ''],
            },
            {
              title: "ایکس باکس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "42",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "40",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        },
  
        {
          title: "کنسول بازی",
          children: [
            {
              title: "پلی استیشن",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "41",
              pictures: ["" , ''],
            },
            {
              title: "ایکس باکس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "42",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "40",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        },
  
        {
          title: "کنسول بازی",
          children: [
            {
              title: "پلی استیشن",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "41",
              pictures: ["" , ''],
            },
            {
              title: "ایکس باکس",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "40",
              id: "42",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "40",
          pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        },
    
      ],
      details: [{ title: "specs", keys: ["brand", "sth"] }],
      parentID: "",
      id: "1",
      theme:'#492885',
      desc:'تکنولوژی انقلابی / بهترین قیمت ها / همین حالا سفارش بده',
      pictures: ["https://i.postimg.cc/L6Wbd2K9/Digital-Productss.png" , 'https://dkstatics-public.digikala.com/digikala-mega-menu/aba1e5dca8958ac1176e25cd194ff8ac622cd383_1692600155.png'],
    },
  
    {
      title: "لوازم برقی خانه",
      children: [
        {
          title: "یخچال",
          children: [
            {
              title: "یخچال ساید بای ساید",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "2",
              id: "8",
              pictures: ['' , ''],
            },
            {
              title: "یخچال کمپی",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "2",
              id: "9",
              pictures: ["" , ''],
            },
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
          parentID: "1",
          id: "60",
          pictures: [""  , ''],
        },
        {
          title: "پخت و پز",
          children: [
            {
              title: "ماکروویو",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "3",
              id: "30",
              pictures: ["" , ''],
            },
            {
              title: "توستر",
              details: [{ title: "specs", keys: ["brand", "sth"] }],
              parentID: "3",
              id: "31",
              pictures: ["" , ''],
            },
            
          ],
          details: [{ title: "specs", keys: ["brand", "sth"] }],
       
          id: "3",
          pictures: ["" , ''],
        },
    
      ],
      details: [{ title: "specs", keys: ["brand", "sth"] }],
      parentID: "",
      id: "1",
      pictures: ["" , 'https://dkstatics-public.digikala.com/digikala-mega-menu/c16b7dff700a9d99880174c32ec233d20ddb531c_1703057953.png'],
    },  
  
    { 
      title: 'کتاب و لوازم تحریر',
      details: [{ title: 'sth' , keys: ["brand", "sth"] }],
      id: '40',
      pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/3582bbed0a53318c2332d2c79b051b226f02a3bb_1692600677.png'],
    },
    { 
      title: 'مد و پوشاک',
      details: [{ title: 'sth' , keys: ["brand", "sth"] }],
      id: '40',
      pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/5795b31a635f1e23df96a908c009f31744ede38f_1692600481.png'],
    },
    { 
      title: 'کارت هدیه',
      details: [{ title: 'sth' , keys: ["brand", "sth"] }],
      id: '40',
      pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/20c179dff5c513104599d33858b6b11e77ced9b4_1692601532.png'],
    },
    { 
      title: 'اسباب بازی',
      details: [{ title: 'sth' , keys: ["brand", "sth"] }],
      id: '40',
      pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/0c46d2532d61dd3a5b6a3afc17552c23c1b4d39e_1692600773.png'],
    },
    
  ];
  
  //#endregion



const SelectCategory = () => {
  const optionsStack  = useRef<Category[][]>([Categories])
  const [options,setOptions]= useState<Category[] | undefined>(Categories) 
  function HandleOptions(children:Category[]){
    optionsStack.current.push(children)
    setOptions(children)
  }

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
                        option.children 
                            ?   <button className='flex items-center justify-between py-5 border-b border-grey-border text-start' onClick={()=>HandleOptions(option.children ?? [])} id={option.id}>
                                    <p>{option.title}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>  
                                
                            :   <Link href={`/sellers/addProducts/list/?category=${option.id}`} className='flex items-center justify-between py-5 border-b border-grey-border text-start' id={option.id}>
                                    <p>{option.title}</p>
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