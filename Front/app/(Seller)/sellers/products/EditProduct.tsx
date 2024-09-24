'use client'
import { Brand, ProductInterface } from '@/app/components/Interfaces/interfaces'
import useQueryNext from '@/app/hooks/useQueryNext'
import React, { useRef, useState } from 'react'
import SearchableList from '@/app/components/SearchableList'
import { forEach, update } from 'lodash'
import ImageUpload from '@/app/components/ImageUpload'
import ModalButton from '../addProducts/ModalButton'


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

    
    interface Props{
        productID:string
    }
    
    const EditProduct = ({productID}:Props) => {
        const {searchParams} = useQueryNext()
        const productToEdit:ProductInterface={
            categoryID:searchParams.get('category')??'',
            brand:'اپل',
            details:[{title:'' , map:[{key:'',value:''}]}],
            dimentions:{length:0 , width:0 , height:0},
            images:[],
            madeInIran:false,
            original:false,
            rating:{rate:0 , rateNum:0},
            recentComments:[],
            sellcount:0,
            sellers:[{
              quantity:[],
              sellerid:'1', //remember to put the actual seller
              sellerRating:4,
              sellerTitle:'2',
            }],
            title:'',
            visitCount:0,
            visits:[],
            wieght:0,
        }
        const [product , setProduct] = useState<ProductInterface>(productToEdit)

  const title= useRef<HTMLInputElement>(null)
  const desc= useRef<HTMLTextAreaElement>(null)
  const [brand , setBrand]= useState('انتخاب برند')
  const original= useRef<HTMLInputElement>(null)
  const [details,setDetails]= useState<{title:string ,map:{key:string,value:string}[]}[]>([])
  const madeInIran= useRef<HTMLInputElement>(null)
  const height= useRef<HTMLInputElement>(null)
  const width= useRef<HTMLInputElement>(null)
  const length= useRef<HTMLInputElement>(null)
  const wieght= useRef<HTMLInputElement>(null)
  const [images , setImages]= useState<string[]>([])

  const [step,setStep] = useState(1) 

  function UpdateDetail(key: string, value: string, title: string) {
    console.log(details)
    setDetails(prevDetails => {
      // Find the index of the chunk with the given title
      const chunkIndex = prevDetails.findIndex(chunk => chunk.title === title);
  
      if (chunkIndex !== -1) {
        // If the chunk exists, check if the key exists in the map
        const mapIndex = prevDetails[chunkIndex].map.findIndex(item => item.key === key);
  
        let updatedMap;
        if (mapIndex !== -1) {
          // If the key exists, update the value
          updatedMap = prevDetails[chunkIndex].map.map(item =>
            item.key === key ? { key, value } : item
          );
        } else {
          // If the key doesn't exist, add the new key-value pair
          updatedMap = [...prevDetails[chunkIndex].map, { key, value }];
        }
  
        // Update the chunk with the new map
        const updatedChunk = {
          ...prevDetails[chunkIndex],
          map: updatedMap
        };
  
        // Return the updated details array
        return [
          ...prevDetails.slice(0, chunkIndex),
          updatedChunk,
          ...prevDetails.slice(chunkIndex + 1)
        ];
      } else {
        // If the chunk doesn't exist, add a new one
        return [
          ...prevDetails,
          { title, map: [{ key, value }] }
        ];
      }
    });
  }
  
  

  return (
    <dialog id={"EditProduct"} className="modal">
                <div className="modal-box  w-11/12 max-w-5xl p-2 flex flex-col">
                  <div className=' mb-3'>
                    <form method="dialog" className='inline'>
                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                    </form>
                    
                    <ul className="steps w-11/12">
                      <li className={`step  ${step>= 1 && 'step-accent'} `}>معرفی محصول</li>
                      <li className={`step  ${step>= 2 && 'step-accent'} `}>عکس های محصول</li>
                      <li className={`step  ${step>= 3 && 'step-accent'} `}>مشخصات محصول</li>
                      <li className={`step  ${step>= 4 && 'step-accent'} `}>درخواست بررسی</li>
                    </ul>
                  </div>
                    <hr className='text-grey-border  my-2'></hr>

                    <div className='p-10 h-96 overflow-auto'>
                   
    
     
                <div className='flex flex-col bg-white '>

                    
                        <div className={`${step!=1?'hidden':''}`}>
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

                    <textarea className='min-w-fit w-full min-h-32 my-3 border rounded-md border-grey-border p-3 resize-none' ref={desc} placeholder='معرفی'/> 
                    </div>   
                
                        
                        
                     <div className={`${step!=2?'hidden':''} grid grid-cols-4 gap-4`}>
                        <ImageUpload setImages={setImages}/>
                        {images.map(image=>(
                            <ImageUpload setImages={setImages}/>
                        ))}
                        
                    </div>
                        
                        
                      <div className={`${step!=3?'hidden':''} flex flex-col`}> 
                        {detailKeys.map(chunk=>(
                        <div>
                            <h3 className='mt-10 mb-3 text-lg'>{chunk.title}</h3>
                            {chunk.keys.map(key=>(
                            <div className='grid grid-cols-2 border-b border-grey-border'>
                                <p className='my-3 text-grey-dark'>{key}</p>
                                <input type='text' onChange={e=>(UpdateDetail(key,e.target.value ,chunk.title ))}  className='my-3 p-3 bg-primary-bg rounded-md border border-grey-border'/>
                            </div>
                            ))}
                        </div>
                        ))}

                    

                    
                        <div className='flex items-center mt-10'>
                            <p className='m-2'>ابعاد</p>
                            <input className='border border-grey-border rounded-md m-2 p-3' ref={length} placeholder='طول'/> 
                            <input className='border border-grey-border rounded-md m-2 p-3' ref={width} placeholder='عرض'/> 
                            <input className='border border-grey-border rounded-md m-2 p-3' ref={height} placeholder='ارتفاع'/> 
                        </div>
                        <div className='flex items-center my-3'>
                            <p className='m-2'>وزن</p>
                            <input className='border border-grey-border rounded-md m-2 p-3'ref={wieght} placeholder='وزن'/> 
                        </div>
                    </div>
                

                
                <div className={`${step!=4?'hidden':''}`}>
                <div className="collapse collapse-arrow bg-propBubble-bg my-3">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title text-xl font-medium">معرفی</div>
                    <div className="collapse-content">
                        <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                            <p className='me-3 font-bold text-grey-dark '>نام کالا :</p>
                            <p>{title.current?.value}</p>
                        </div>
                        <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                            <p className='me-3 font-bold text-grey-dark '>معرفی:</p>
                            <p className='leading-9'>{desc.current?.value}</p>
                        </div>

                        <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                            <p className='me-3 font-bold text-grey-dark'>برند :</p>
                            <p>{brand}</p>
                        </div>
                        <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                            <p className='me-3 font-bold text-grey-dark'>اصل :</p>
                            {original.current?.checked 
                                ?  <p>است</p>
                                :  <p>نیست</p>
                            }
                        </div>
                        <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                            <p className='me-3 font-bold text-grey-dark'>ساخت ایران :</p>
                            {madeInIran.current?.checked 
                                ?  <p>است</p>
                                :  <p>نیست</p>
                            }
                        </div>


                    </div>
                    </div>
                    <div className="collapse collapse-arrow bg-propBubble-bg my-3">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">عکس ها</div>
                    <div className="collapse-content">
                        <div className='grid grid-cols-6'>
                            {images.map(image=>(
                                <img className='h-32 w-32 object-cover rounded-lg' src={image} />
                            ))}
                        </div>
                    </div>
                    </div>

                    <div className="collapse collapse-arrow bg-propBubble-bg my-3">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title text-xl font-medium">مشخصات</div>
                        <div className="collapse-content">
                            {details.map(detail=>(
                                <div>
                                    <p>{detail.title}</p>
                                    {detail.map.map(keyValue=>(
                                        <div className='grid grid-cols-2 border-b p-3 border-grey-border gap-4 my-5'>
                                            <p>{keyValue.key}</p>
                                            <p>{keyValue.value}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                                <p className='me-3 font-bold text-grey-dark'>ابعاد :</p>
                                <p>{length.current?.value}cm x{width.current?.value}cm x{height.current?.value}cm</p>
                            </div>

                            <div className='flex border-b p-3 border-grey-border w-fit my-5'>
                                <p className='me-3 font-bold text-grey-dark'>وزن :</p>
                                <p>{wieght.current?.value}kg</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                
              </div>
            </div>

    
            <hr className='text-grey-border  my-2'></hr>
            <div  className='flex'>
            {step!=1 && <button className='px-5 m-5 py-2 w-fit self-end rounded-md  bg-propBubble-bg' onClick={()=>{setStep(step-1)}}>قبلی</button>}
            {step!=4 ? <button className='px-5 m-5 py-2 w-fit self-end rounded-md text-white bg-primary-seller' onClick={()=>{setStep(step+1)}}>بعدی</button>  
            :<button className='px-5 m-5 py-2 w-fit self-end rounded-md text-white bg-primary-seller' onClick={()=>{}}>درخواست بررسی</button>
             
            }
            </div>
        </div>
    </dialog>
  )
}

export default EditProduct