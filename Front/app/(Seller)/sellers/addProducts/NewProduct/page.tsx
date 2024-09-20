'use client'
import { Brand, ProductInterface } from '@/app/components/Interfaces/interfaces'
import useQueryNext from '@/app/hooks/useQueryNext'
import React, { useRef, useState } from 'react'
import ModalButton from '../ModalButton'
import SearchableList from '@/app/components/SearchableList'


const Brands : Brand[]=[
  {
    title:'اپل',
    id:'1'
  },
  {
    title:'سامسونگ',
    id:'2'
  },
  {
    title:'شیاومی',
    id:'3'
  },
  {
    title:'ایسوس',
    id:'4'
  },
  {
    title:'لنوو',
    id:'5'
  },
]

const detailKeys=
      [
      {title:'پردازنده',
      keys : [
      'سازنده پردازنده' ,
      'سری پردازنده' ,
      'سازنده پردازنده گرافیکی' ,
      'پردازنده گرافیکی' ,
      ]},

      {title:'حافظه',
      keys : [
        'ظرفیت حافظه RAM' ,
        'مدل پردازنده' , 
        'نوع حافظه RAM' , 
        'ظرفیت حافظه داخلی' , 
        'نوع حافظه داخلی' ,    
      ]}
    ]

const AddNewProduct = () => {
  const {searchParams} = useQueryNext()
  // const [product , setProduct] = useState<ProductInterface>(
  //   {
  //     categoryID:searchParams.get('category')??'',
  //     brand:'',
  //     details:[{title:'' , map:[{key:'',value:''}]}],
  //     dimentions:{length:0 , width:0 , height:0},
  //     images:[],
  //     madeInIran:false,
  //     original:false,
  //     rating:{rate:0 , rateNum:0},
  //     recentComments:[],
  //     sellcount:0,
  //     sellers:[{
  //       quantity:[],
  //       sellerid:'1', //remember to put the actual seller
  //       sellerRating:4,
  //       sellerTitle:'2',
  //     }],
  //     title:'',
  //     visitCount:0,
  //     visits:[],
  //     wieght:0,
  //   }
  // )

  const title= useRef<HTMLInputElement>(null)
  const desc= useRef<HTMLTextAreaElement>(null)
  const [brand , setBrand]= useState('انتخاب برند')
  const original= useRef<HTMLInputElement>(null)
  const details= useRef<HTMLInputElement>(null)
  const madeInIran= useRef<HTMLInputElement>(null)
  const height= useRef<HTMLInputElement>(null)
  const width= useRef<HTMLInputElement>(null)
  const length= useRef<HTMLInputElement>(null)
  const wieght= useRef<HTMLInputElement>(null)

  return (
    <div>
      <h1 className='my-10 text-xl font-bold'>اضافه کردن کالای جدید</h1>
      <div className='flex flex-col bg-white rounded-lg border p-10 border-grey-border mt-10'>

        <div className='flex items-center gap-4 '>
          <input className='w-fit my-3 border rounded-md border-grey-border p-3' ref={title} placeholder='نام محصول'/> 
        <ModalButton title={brand}  id={'brandNewProduct'} />
            <dialog id={"brandNewProduct"} className="modal">
                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    <h3 className="font-bold inline text-lg mt-2">انتخاب برند</h3>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                        <SearchableList items={Brands} showKey='title' setFunc={setBrand} showFunc={setBrand} />
                    </div>
                    <hr className='text-grey-border  my-2'></hr>
                </div>
            </dialog>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">کالای اصل</span>
              <input type='checkbox' className='checkbox' ref={original} /> 
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">ساخت ایران</span>
              <input type='checkbox' className='checkbox' ref={madeInIran} /> 
            </label>
          </div>

        </div>

        <textarea className='min-w-fit min-h-32 my-3 border rounded-md border-grey-border p-3 resize-none' ref={desc} placeholder='معرفی'/> 



        

      <ModalButton title={'پر کردن مشخصات'}  id={'details'} />
          <dialog id={"details"} className="modal">
              <div className="modal-box  w-6/12 max-w-5xl p-2 flex flex-col">
                  <form method="dialog" className='inline'>
                      <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                  </form>
                  <h3 className="font-bold inline text-lg mt-2">پر کردن مشخصات</h3>
                  <hr className='text-grey-border  my-2'></hr>

                  <div className='p-10 h-96 overflow-auto'>
                    {detailKeys.map(chunk=>(
                      <div>
                        <h3 className='mt-10 mb-3 text-lg'>{chunk.title}</h3>
                        {chunk.keys.map(key=>(
                          <div className='grid grid-cols-2 border-b border-grey-border'>
                            <p className='my-3 text-grey-dark'>{key}</p>
                            <input type='text'  className='my-3 bg-primary-bg rounded-md border border-grey-border'/>
                          </div>
                        ))}
                      </div>
                    ))}

                  </div>
                  <hr className='text-grey-border  my-2'></hr>
              </div>
          </dialog>

        

        
        <input type="file" className="file-input file-input-bordered w-full max-w-xs" />

        <input ref={length} placeholder='طول'/> 
        <input ref={width} placeholder='عرض'/> 
        <input ref={height} placeholder='ارتفاع'/> 
        <input ref={width} placeholder='وزن'/> 
       
      </div>
    </div>
  )
}

export default AddNewProduct