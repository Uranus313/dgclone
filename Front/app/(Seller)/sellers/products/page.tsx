'use client'
import { ProductCardSeller, productSaleAnalyseCard, SellerAddProdctCard, StateProduct } from '@/app/components/Interfaces/interfaces'
import ProductCard from '@/app/components/ProductCar/ProductCard'
import { updateQueries } from '@/app/Functions/ServerFunctions'
import useQueryNext from '@/app/hooks/useQueryNext'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import Checkbox from './Checkbox'
import FilterButton from './FilterButton'
import ModalButton from '../addProducts/ModalButton'
import Step1 from '../addProducts/list/step1'
import AddVarient from './AddVarient'
import EditProduct from './EditProduct'
import AddNew from '../addProducts/list/AddNew'
import useGetSellerProducts from '@/app/hooks/useGetSellerProducts'


interface Filterables{
  categories:{title:string , categoryid:string}[]
  brands:string[]
}

const filterables:Filterables={
  categories:[
    {title:'لپ تاپ',categoryid:'2'},
    {title:'موبایل',categoryid:'3'},
  ],
  brands:["اپل","ایسوس","لنوو"]
}

const Products = () => {  

  //server
  // const res = await fetch("https://localhost:8080/products/seller/allProds",{credentials:'include'})
  // const productsCard = await res.json()
  const {data:productsCard} = useGetSellerProducts()
  return (
    <div className='bg-white mt-10 rounded-lg border border-grey-border p-5'>
      <h1 className='text-xl font-bold text-grey-dark'>مدیریت کالا ها</h1>
      {/* <h1>{JSON.stringify(productsCard)}</h1> */}
      <div className='py-5'>
        <label className="input w-full input-bordered flex items-center gap-2">
          <input type="text" className="grow " placeholder=" جستجو بر اساس نام یا شناسه ی کالا " />
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
      </div>
      <div className='flex gap-3 mb border-b border-grey-border pb-5'>
        {/* <div className='flex items-center mt-2 text-primary-seller'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <p className='mx-1'>فیلتر ها</p>
        </div> */}
        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm ">گروه کالایی</div>
          <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {filterables.categories.map((category,index)=>(
              <Checkbox index={index} id={category.categoryid} title={category.title} query='category'/>

            ))}
          </div>
        </div> */}

        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">برند کالا</div>
          <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            {filterables.brands.map((brand,index)=>(
              <Checkbox index={index} id={brand} title={brand} query='brand' />

            ))}
          </div>
        </div> */}

        {/* <div className="dropdown">
          <div tabIndex={0} role="button" className="bg-primary-bg border border-primary-seller text-primary-seller rounded-xl px-4 py-2 m-1 text-sm">وضعیت تایید</div>
          <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <Checkbox index={0} id={StateProduct.accepted} title={StateProduct.accepted} query='state' />
            <Checkbox index={1} id={StateProduct.inCheckingOrder} title={StateProduct.inCheckingOrder} query='state' />
            <Checkbox index={2} id={StateProduct.rejected} title={StateProduct.rejected} query='state' />
          </div>
        </div> */}
        

      </div>

      <div className='grid md:grid-cols-6 grid-cols-3 sm:grid-cols-4 place-items-center gap-4 my-4 bg-primary-bg py-3 rounded-md'>
      <p className=''>عنوان کالا</p>
      <p className='hidden md:block'>گروه کالایی</p>
      <p className='hidden md:block'>برند کالا</p>
      <p className='hidden sm:block'>وضعیت</p>
      <p>تعداد تنوع</p>
      </div>
      {productsCard?.map(productCard=>(
        <div className='grid md:grid-cols-6 sm:grid-cols-4  grid-cols-3 place-items-center gap-4 my-4 border border-grey-border py-4 rounded-lg;'>
          <div className='grid grid-cols-2 place-items-center'>
            <img className='w-20 mx-2' src={productCard.picture}/>
            <div>
              <p className='line-clamp-2 h-fit text-md text-end'>{productCard.title}</p>
              {/* <p className='bg-propBubble-bg text-grey-dark my-2 w-fit px-2 py-1 rounded-full text-sm'>{productCard.productID}</p> */}
            </div>
          </div>
          <p className='line-clamp-2 h-fit text-md text-end hidden md:block'>{productCard.categoryTitle}</p>
          <p className='line-clamp-2 h-fit text-md text-end hidden md:block'>{productCard.brand}</p>
          <p>{productCard.state}</p>
          <p className='hidden sm:block'>{productCard.varientCount}</p>
          {productCard.state==2 &&
          <div className='flex gap-4 '>
            <ModalButton noMargin={true} additionalCss='bg-primary-seller text-white rounded-md px-4 py-2' title='مدیریت تنوع' id='addNewVarient'/>

            {/* <ModalButton noMargin={true} additionalCss='border border-grey-border rounded-md px-4 py-2 bg-white  rounded-md px-4 py-2' title='ویرایش کالا' id='addNewProduct'/> */}
            <Link href='' className=''>
              <p></p>
            </Link>
            

              
              <AddVarient productCard={productCard}/>
              <AddNew productID={productCard.productID}/>
          </div>
          }
        </div>
       ))}
    </div>
  )
}

export default Products