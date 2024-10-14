import React from 'react'
import ModalButton from './ModalButton'
import SelectCategory from './SelectCategory'

const AddProduct = async() => {
  const res = await fetch("https://localhost:8080/products/category")
  const categories  = await res.json()
  return (
    <div className='flex justify-center'>

      <div className='bg-white flex flex-col rounded-lg w-7/12 px-24 py-14 mt-16'>
        <h1 className='text-2xl mb-14'>ثبت کالا برای فروش</h1>
        <p className='mb-6'>:ابتدا کالای مد نظر را در دیجیمارکت جستجو کنید</p>

        <label className="input w-full input-bordered flex items-center gap-2 bg-primary-bg">
          <input type="text" className="grow " placeholder=" جستجو ی کالا " />
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
        
        <hr className='text-grey-border border border-grey-border my-6'></hr>
        
        <p>اگر کالا پیدا نشد، دسته‌بندی کالا را مشخص کنید</p>

        <ModalButton id={"categories"} title='کالای مورد نظر را پیدا نکردم'/>

       <SelectCategory Categories={categories}/>
        

        <button className='border w-fit self-end px-3 py-1 rounded-md  border-primary-seller text-primary-seller'>بازگشت</button>
      </div>
    </div>
  )
}

export default AddProduct