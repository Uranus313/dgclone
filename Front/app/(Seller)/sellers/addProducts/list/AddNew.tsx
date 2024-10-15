'use client'
import { Brand, commentType, details, ProductCardInterface, ProductInterface, shipmentMethod } from '@/app/components/Interfaces/interfaces'
import useQueryNext from '@/app/hooks/useQueryNext'
import React, { useEffect, useRef, useState } from 'react'
import ModalButton from '../ModalButton'
import SearchableList from '@/app/components/SearchableList'
import { forEach, update } from 'lodash'
import ImageUpload from '@/app/components/ImageUpload'
import { useSeller } from '@/app/hooks/useSeller'
import useGetBrands from '@/app/hooks/useGetBrands'


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
  productID?:string //if the seller is the creator of this product he can edit it
}



async function AddProductRequest(product:ProductInterface) {
  try {
    const response = await fetch('https://localhost:8080/products/product', {
      credentials:'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

const AddNew = ({productID}:Props) => {
  const {data:Brands}= useGetBrands()
  const {searchParams} = useQueryNext()
  const set = useRef(false)
  const [product , setProduct] = useState<ProductInterface>()
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

  const [prevProduct,setPrevProduct]=useState<ProductInterface>()


  const categoryID = searchParams.get('category')
  const title= useRef<HTMLInputElement>(null)
  const desc= useRef<HTMLTextAreaElement>(null)
  const [brand , setBrand]= useState('انتخاب برند')
  const[brandID , setBrandID] = useState({_id:'',title:''})
  const original= useRef<HTMLInputElement>(null)
  const [details,setDetails]= useState<details[]>([])
  const madeInIran= useRef<HTMLInputElement>(null)
  const height= useRef<HTMLInputElement>(null)
  const width= useRef<HTMLInputElement>(null)
  const length= useRef<HTMLInputElement>(null)
  const wieght= useRef<HTMLInputElement>(null)
  const [images , setImages]= useState<string[]>([])
  const {seller} = useSeller()
  const [step,setStep] = useState(1) 



  useEffect(()=>{
    if(!set.current && product){
      setPrevProduct(product)
      setImages(product?.images)
      setDetails(product?.details)
      set.current=true
    }
  },[product])
  

  

  function UpdateDetail(key: string, value: string, title: string) {
    console.log(details)
    setDetails(prevDetails => {
      // Find the index of the chunk with the given title
      const chunkIndex = prevDetails.findIndex(chunk => chunk.title === title);
  
      if (chunkIndex !== -1) {
        // If the chunk exists, update the map
        const updatedMap = {
          ...prevDetails[chunkIndex].map,
          [key]: value
        };
  
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
          { title, map: { [key]: value } }
        ];
      }
    });
  }
  

  return (
    <dialog id={"addNewProduct"} className="modal">
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
                        <input defaultValue={prevProduct?.title} className='w-full my-3 border rounded-md border-grey-border p-3' ref={title} placeholder='نام محصول'/> 
                        <ModalButton title={brand}  id={'brandNewProduct'} />
                            <dialog id={"brandNewProduct"} className="modal">
                                <div className="modal-box  w-4/12 max-w-5xl p-2 flex flex-col">
                                    <form method="dialog" className='inline'>
                                        <button className="btn btn-lg btn-circle btn-ghost">✕</button>
                                    </form>
                                    <h3 className="font-bold inline text-lg mt-2">انتخاب برند</h3>
                                    <hr className='text-grey-border  my-2'></hr>

                                    <div className='p-10 h-96 overflow-auto'>
                                        <SearchableList defaultValue={prevProduct?.brand_id} items={Brands??[]} showKey='title' setFunc={setBrandID} showFunc={setBrand} />
                                    </div>
                                    <hr className='text-grey-border  my-2'></hr>
                                </div>
                            </dialog>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                            <span className="label-text">کالای اصل</span>
                            <input defaultChecked={!!prevProduct?.is_original} type='checkbox' className='checkbox' ref={original} /> 
                            </label>
                        </div>
                        {/* <button onClick={()=>{console.log(original.current?.checked , madeInIran.current?.checked)}}>gii</button> */}

                        <div className="form-control">
                            <label className="label cursor-pointer">
                            <span className="label-text">ساخت ایران</span>
                            <input defaultChecked ={!!prevProduct?.is_from_iran} type='checkbox' className='checkbox' ref={madeInIran} /> 
                            </label>
                        </div>

                        </div>

                    <textarea defaultValue={prevProduct?.description} className='min-w-fit w-full min-h-32 my-3 border rounded-md border-grey-border p-3 resize-none' ref={desc} placeholder='معرفی'/> 
                    </div>   
                
                        
                        
                     <div className={`${step!=2?'hidden':''} grid grid-cols-4 gap-4`}>
                        <ImageUpload defaultImage={true} setImages={setImages}/>
                        {images.map((image,index)=>(
                            <ImageUpload prevProductImage={image} index={index} setImages={setImages}/>
                        ))}
                        
                    </div>
                        
                        
                      <div className={`${step!=3?'hidden':''} flex flex-col`}> 
                        {detailKeys.map((chunk,index1)=>(
                        <div>
                            <h3 className='mt-10 mb-3 text-lg'>{chunk.title}</h3>
                            {chunk.keys.map((key,index2)=>(
                            <div className='grid grid-cols-2 border-b border-grey-border'>
                                <p className='my-3 text-grey-dark'>{key}</p>
                                {/* <input defaultValue={prevProduct?.details[index1].map[index2].value} type='text' onChange={e=>(UpdateDetail(key,e.target.value ,chunk.title ))}  className='my-3 p-3 bg-primary-bg rounded-md border border-grey-border'/> */}
                                <input defaultValue={prevProduct?.details[index1].map[key]} type='text' onChange={e=>(UpdateDetail(key,e.target.value ,chunk.title ))}  className='my-3 p-3 bg-primary-bg rounded-md border border-grey-border'/>
                            </div>
                            ))}
                        </div>
                        ))}

                    

                    
                        <div className='flex items-center mt-10'>
                            <p className='m-2'>ابعاد</p>
                            <input defaultValue={prevProduct?.dimentions.length} className='border border-grey-border rounded-md m-2 p-3' ref={length} placeholder='طول'/> 
                            <input defaultValue={prevProduct?.dimentions.width} className='border border-grey-border rounded-md m-2 p-3' ref={width} placeholder='عرض'/> 
                            <input defaultValue={prevProduct?.dimentions.height} className='border border-grey-border rounded-md m-2 p-3' ref={height} placeholder='ارتفاع'/> 
                        </div>
                        <div className='flex items-center my-3'>
                            <p className='m-2'>وزن</p>
                            <input defaultValue={prevProduct?.wieght_KG} className='border border-grey-border rounded-md m-2 p-3'ref={wieght} placeholder='وزن'/> 
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
                        <div className='grid grid-cols-6 gap-4'>
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
                                    {Object.keys(detail.map).map(key=>(
                                        <div className='grid grid-cols-2 border-b p-3 border-grey-border gap-4 my-5'>
                                            <p>{key}</p>
                                            <p>{detail.map[key]}</p>
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
            :<button className='px-5 m-5 py-2 w-fit self-end rounded-md text-white bg-primary-seller' onClick={()=>{
              AddProductRequest(
                {
                  sell_count:0,
                  // date_added: '',
                  brand_id: brandID._id,
                  visit_count: 0,
                  visits:[],
                  title: title.current?.value ?? '',
                  sellers: [{
                    seller_id: seller?._id??'',
                    seller_title: seller?.storeInfo?.commercialName??'',
                    seller_rating: seller?.rating??0,
                    seller_quantity:[], 
                    price: 0,
                  }],
                  rating: { rate: 0, rate_num: 0 },
                  category_id: categoryID??'',
                  details: details,
                  is_from_iran: madeInIran.current?.checked??false,
                  is_original: original.current?.checked??false,
                  images:images,
                  dimentions: { length: Number(length.current?.value)??0, width: Number(width.current?.value)??0, height: Number(height.current?.value)??0 },
                  wieght_KG: Number(wieght.current?.value),
                  description: desc.current?.value,
                  validation_state: 1
                }
              )
            }}>درخواست بررسی</button>
             

            }
            </div>
        </div>
    </dialog>
  )
}

export default AddNew