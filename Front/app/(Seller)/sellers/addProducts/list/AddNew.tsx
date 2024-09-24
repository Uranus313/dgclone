'use client'
import { Brand, commentType, ProductInterface, shipmentMethod } from '@/app/components/Interfaces/interfaces'
import useQueryNext from '@/app/hooks/useQueryNext'
import React, { useRef, useState } from 'react'
import ModalButton from '../ModalButton'
import SearchableList from '@/app/components/SearchableList'
import { forEach, update } from 'lodash'
import ImageUpload from '@/app/components/ImageUpload'



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
  productID?:string //if the seller is the creator of this product he can edit it
}


const product:ProductInterface = {
  id:'1',
  sellcount:100,
  visitCount:3,
  visits:["2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" , ],
  title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook E1504GA-BQ509-i3 N305 4GB 512SSD',
  
  sellers:[
      {discountId:'3',
       sellerTitle:'پیشرو تجارت خاورمیانه',
       sellerRating:9.1,
       
       quantity:[{color:{hex:'#000000', title:'سیاه'} , quantity:4 , price:21999000,garante:'گارانتی   حامی'},{color:{hex:'#ffffff', title:'سفید'} , quantity:10, price:22999000,garante:'گارانتی ۲۴  حامی'}],
       sellerid:'1',
       shipmentMethod:shipmentMethod.option1
      },
      {
      sellerTitle:'طرح اندیشان سمت نو',
      sellerRating:7,
      quantity:[{color:{hex:'#000000', title:'سیاه'} , quantity:1,price:19999000,garante:'گارانتی ۲۴ '},{color:{hex:'#ff9900', title:'ندانم'} , quantity:10,price:10999000,garante:'گارانتی  ماهه حامی'}],
      sellerid:'2',
      shipmentMethod:shipmentMethod.option2
      },
  ],
  rating: {rate:4,rateNum:10},
  brand:'اپل',
  original:true,
  categoryID:'2',
  details:
      [{title:'پردازنده',
      map : [
      {key:'سازنده پردازنده' , value:'Intel'},
      {key:'سری پردازنده' , value:'Core i3'},
      {key:'سازنده پردازنده گرافیکی' , value:'Intel'},
      {key:'پردازنده گرافیکی' , value:'UHD Graphics'},]},

      {title:'حافظه',
      map : [
      {key:'ظرفیت حافظه RAM' , value:'16GB'},
      {key:'مدل پردازنده' , value:'N۳۰۵'},
      {key:'نوع حافظه RAM' , value:'DDR4'},
      {key:'ظرفیت حافظه داخلی' , value:'512GB'},
      {key:'نوع حافظه داخلی' , value:'SSD'},]}    
  ],

  madeInIran:false,
  images:['https://dkstatics-public.digikala.com/digikala-products/3fe318188a27c7941af723817bd8cc631d9ca90a_1713162171.jpg',
          'https://dkstatics-public.digikala.com/digikala-products/82b00b1416bb88971e0cc9e215bafe03e68f28e5_1713162171.jpg',
          'https://dkstatics-public.digikala.com/digikala-products/2ed8f1fbfd7586a8d579d22b4d5e05419effebb5_1713162171.jpg',
          'https://dkstatics-public.digikala.com/digikala-products/7b033b72c507b7989072ce0bbe1736faf09f7210_1713162172.jpg',
          'https://dkstatics-public.digikala.com/digikala-products/32f0175a55bffa787c1c0e6b6edfcd566adc6f93_1713162172.jpg',
          'https://dkstatics-public.digikala.com/digikala-products/e0ceb58624f648429fa3ba2c2ec4eebde6b51f79_1713162171.jpg',
         ] , 
  dimentions:{length:36 , width:23 , height:17} , 
  wieght:1.7 , 
  description: "موردانتظارترین و تأثیرگذارترین رویداد اپل در سال 2020، نخستین کامپیوتر‌های مک با پردازنده‌ی اختصاصی این شرکت را به‌ارمغان آورد. مک‌بوک ایر نخستین لپ‌تاپ اپل با پردازنده‌ی مبتنی‌بر ARM کوپرتینونشین‌ها موسوم به M1 خواهد بود.همان‌طور که انتظار می‌رفت مک‌بوک ایر به‌لحاظ ظاهر و طراحی هیچ تفاوتی با نسخه‌ی اینتل ندارد و همانند گذشته است. تغییرات اصلی مک‌ بوک ایر در داخل آن رخ می‌دهد؛ جایی‌که تراشه اختصاصی M1 توان پردازشی موردنیاز کاربر را با بهره‌وری بالاتر و مصرف انرژی کمتر فراهم می‌سازد. این تراشه در دو نسخه‌ با گرافیک 7 یا 8 هسته‌ای درون مک بوک ایر به‌کار می‌رود؛ اما در هر دو نسخه، پردازنده‌ی مرکزی 8 هسته‌ای و واحد پردازش عصبی 16 هسته‌ای دردسترس هستند. به‌مدد بهینگی بسیار بیشتر تراشه‌‌ی اختصاصی M1، کوپرتینونشین‌ها مک‌ بوک ایر را با سیستم خنک‌کننده‌ی پسیو (بدون فن) تولید می‌کنند.اپل می‌گوید CPU داخل تراشه‌ی M1 به‌مدد 4 هسته‌ی قدرتمند و 4 هسته‌ی کم‌مصرفش در مجموع بالغ‌بر 3٫5 برابر و GPU هشت هسته‌ای آن نیز تا 5 برابر سریع‌تر از نسل گذشته عمل می‌کنند. از سوی دیگر به‌لطف واحد پردازش عصبی 16 هسته‌ای M1 پردازش‌های مبتنی‌بر یادگیری ماشین نظیر تشخیص چهره یا شناسایی اجسام تا 9 برابر سریع‌تر صورت می‌گیرد. براساس ادعای اپل، تراشه‌ی M1 موجود در داخل مک بوک ایر از «98 درصد لپ‌تاپ‌های فروخته‌شده در سال گذشته» سریع‌تر است. اپل می‌گوید به‌لطف کنترلر حافظه‌ی موجود در M1 و حافظه‌های جدید، ماژول‌های SSD مک‌بوک ایر بالغ‌بر 2 برابر سریع‌تر از گذشته هستند.اولترابوک محبوب اپل جک 3٫5 میلی‌متری هدفون و دو پورت USB 4 با پشتیبانی از USB 3.1 Gen 2 (پهنای باند 10 گیگابیت‌برثانیه) و تاندربولت 3 (پهنای باند 40 گیگابیت‌برثانیه) را دراختیار کاربر می‌گذارد. این پورت‌‌ها هم‌اکنون از گرافیک اکسترنال پشتیبانی نمی‌کنند؛ اما به‌کمک آن‌ها می‌توان یک نمایشگر اکسترنال با وضوح 6K و نرخ نوسازی 60 هرتز را به مک‌بوک ایر متصل کرد.مک بوک ایر اسپیکرهای استریو با پشتیبانی از دالبی اتموس، ماژول Wi-Fi 6 و بلوتوث 5 را در بطن خود دارد. این لپ‌تاپ همانند گذشته از وب‌کم 720p استفاده می‌کند؛ اما اکنون به‌لطف پردازنده‌ی سیگنال تصویر داخل تراشه‌ی M1 تصاویر را با نویز کمتر و گستره‌ی دینامیکی وسیع‌تری ثبت می‌کند.",
  recentComments:[
      {
      type:commentType.comment,
      // answerto?:string  //for answer comments
      id:'1',
      productID:'1',
      order:{color:{hex:'#ffffff', title:'سفید'},sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
      rate:3,
      user:{userid:'2' , firstname:'لوگان',lastname:'پال'},
      content:'برای دخترم گرفتم تازه به دستش رسیده ولی فوق العاده دوستش داره ',
      disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
      dateSent:'2024/5/1 22:20:01'
      },
      {
      type:commentType.comment,
      // answerto?:string  //for answer comments
      id:'2',
      productID:'1',
      // orderID:'5', //for normal comments
      user:{userid:'1' , firstname:'ممد',lastname:'علی کلی'},
      content:'دستگاه خوب با امکانات خوبیه،سفارش منم به موقع سالم وپلمپ تحویل دادن',
      disAndlike:[{userid:'3',disOlike:false},{userid:'1',disOlike:false},{userid:'4',disOlike:true},],
      dateSent:'2024/5/1 22:20:02'
      },
      {
      type:commentType.question,
      answers:[
          {
          type:commentType.answer,
          id:'3',
          productID:'1',
          order:{color:{hex:'#ffffff', title:'سفید'},sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
          // rate:3,
          user:{userid:'3' , firstname:'لوگان',lastname:'پال'},
          content:'برای بازی نه ولی درحالت عادی 8 ساعت دووم داره',
          disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
          dateSent:'2024/5/1 22:20:01'
          },
          {
          type:commentType.answer,
          id:'6',
          productID:'1',
          order:{color:{hex:'#ffffff', title:'سفید'} ,sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
          // rate:3,
          user:{userid:'4' , firstname:'لوگان',lastname:'پال'},
          content:'درحالت عادی 8 ساعت دووم داره',
          disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
          dateSent:'2024/5/2 22:20:01'
          },
      ], 
      id:'4',
      productID:'1',
      user:{userid:'4' , firstname:'ممد',lastname:'علی کلی'},
      content:'شارژ نگه داشتنش خوبه؟',
      dateSent:'2024/5/1 22:20:02'
      },
      {
      type:commentType.question,
      // answerto?:string  //for answer comments
      id:'5',
      productID:'1',
      user:{userid:'4' , firstname:'لوگان',lastname:'پال'},
      content:'ویندوز روش نصبه؟',
      dateSent:'2024/5/1 22:20:01'
      },
  ] 
}

const AddNew = ({productID}:Props) => {
  const {searchParams} = useQueryNext()
  const set = useRef(false)
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

  const [prevProduct,setPrevProduct]=useState<ProductInterface>()




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

  if(!set.current && productID){
    setPrevProduct(product)
    setImages(product.images)
    setDetails(product.details)
    set.current=true
  }
  

  

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
                                        <SearchableList defaultValue={prevProduct?.brand} items={Brands} showKey='title' setFunc={setBrand} showFunc={setBrand} />
                                    </div>
                                    <hr className='text-grey-border  my-2'></hr>
                                </div>
                            </dialog>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                            <span className="label-text">کالای اصل</span>
                            <input defaultChecked={!!prevProduct?.original} type='checkbox' className='checkbox' ref={original} /> 
                            </label>
                        </div>
                        {/* <button onClick={()=>{console.log(original.current?.checked , madeInIran.current?.checked)}}>gii</button> */}

                        <div className="form-control">
                            <label className="label cursor-pointer">
                            <span className="label-text">ساخت ایران</span>
                            <input defaultChecked ={!!prevProduct?.madeInIran} type='checkbox' className='checkbox' ref={madeInIran} /> 
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
                                <input defaultValue={prevProduct?.details[index1].map[index2].value} type='text' onChange={e=>(UpdateDetail(key,e.target.value ,chunk.title ))}  className='my-3 p-3 bg-primary-bg rounded-md border border-grey-border'/>
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
                            <input defaultValue={prevProduct?.wieght} className='border border-grey-border rounded-md m-2 p-3'ref={wieght} placeholder='وزن'/> 
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

export default AddNew