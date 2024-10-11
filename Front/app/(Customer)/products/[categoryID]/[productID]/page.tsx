import React from 'react'
import { ProductInterface , shipmentMethod , Comment , commentType} from '@/app/components/Interfaces/interfaces'
import ClientPart from './ClientPart'
import SeeMore from '@/app/components/SeeMore/SeeMore'
import Answer from './Answer'


// const comments:Comment[]=[
//     {
//     type:commentType.comment,
//     // answerto?:string  //for answer comments
//     id:'1',
//     productID:'1',
//     orderID:'5', //for normal comments
//     userID:'1',
//     content:'دستگاه خوب با امکانات خوبیه،سفارش منم به موقع سالم وپلمپ تحویل دادن',
//     disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
//     dateSent:'2024/5/1 22:20:01'
//     },
//     {
//     type:commentType.comment,
//     // answerto?:string  //for answer comments
//     id:'2',
//     productID:'1',
//     // orderID:'5', //for normal comments
//     userID:'2',
//     content:'برای دخترم گرفتم تازه به دستش رسیده ولی فوق العاده دوستش داره ',
//     disAndlike:[{userid:'3',disOlike:false},{userid:'1',disOlike:false},{userid:'4',disOlike:true},],
//     dateSent:'2024/5/1 22:20:02'
//     },
// ]

// const product:ProductInterface = {
//     id:'1',
//     sellcount:100,
//     visitCount:3,
//     visits:["2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" , ],
//     title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook E1504GA-BQ509-i3 N305 4GB 512SSD',
    
//     sellers:[
//         {discountId:'3',
//          sellerTitle:'پیشرو تجارت خاورمیانه',
//          sellerRating:9.1,
         
//          quantity:[{color:{hex:'#000000', title:'سیاه'} , quantity:4 ,garante:'گارانتی   حامی'},{color:{hex:'#ffffff', title:'سفید'} , quantity:10, garante:'گارانتی ۲۴  حامی'}],
//          sellerid:'1',
//          shipmentMethod:shipmentMethod.option1,
//          price:29999000
//         },
//         {
//         sellerTitle:'طرح اندیشان سمت نو',
//         sellerRating:7,
//         quantity:[{color:{hex:'#000000', title:'سیاه'} , quantity:1,garante:'گارانتی ۲۴ '},{color:{hex:'#ff9900', title:'ندانم'} , quantity:10,garante:'گارانتی  ماهه حامی'}],
//         sellerid:'2',
//         shipmentMethod:shipmentMethod.option2,
//         price:19999000
//         },
//     ],
//     rating: {rate:4,rateNum:10},
//     brand:'Asus',
//     original:true,
//     categoryID:'2',
//     details:
//         [{title:'پردازنده',
//         map : [
//         {key:'سازنده پردازنده' , value:'Intel'},
//         {key:'سری پردازنده' , value:'Core i3'},
//         {key:'سازنده پردازنده گرافیکی' , value:'Intel'},
//         {key:'پردازنده گرافیکی' , value:'UHD Graphics'},]},

//         {title:'حافظه',
//         map : [
//         {key:'ظرفیت حافظه RAM' , value:'16GB'},
//         {key:'مدل پردازنده' , value:'N۳۰۵'},
//         {key:'نوع حافظه RAM' , value:'DDR4'},
//         {key:'ظرفیت حافظه داخلی' , value:'512GB'},
//         {key:'نوع حافظه داخلی' , value:'SSD'},]}    
//     ],

//     madeInIran:false,
//     images:['https://dkstatics-public.digikala.com/digikala-products/3fe318188a27c7941af723817bd8cc631d9ca90a_1713162171.jpg',
//             'https://dkstatics-public.digikala.com/digikala-products/82b00b1416bb88971e0cc9e215bafe03e68f28e5_1713162171.jpg',
//             'https://dkstatics-public.digikala.com/digikala-products/2ed8f1fbfd7586a8d579d22b4d5e05419effebb5_1713162171.jpg',
//             'https://dkstatics-public.digikala.com/digikala-products/7b033b72c507b7989072ce0bbe1736faf09f7210_1713162172.jpg',
//             'https://dkstatics-public.digikala.com/digikala-products/32f0175a55bffa787c1c0e6b6edfcd566adc6f93_1713162172.jpg',
//             'https://dkstatics-public.digikala.com/digikala-products/e0ceb58624f648429fa3ba2c2ec4eebde6b51f79_1713162171.jpg',
//            ] , 
//     dimentions:{length:36 , width:23 , height:17} , 
//     wieght:1.7 , 
//     description: "موردانتظارترین و تأثیرگذارترین رویداد اپل در سال 2020، نخستین کامپیوتر‌های مک با پردازنده‌ی اختصاصی این شرکت را به‌ارمغان آورد. مک‌بوک ایر نخستین لپ‌تاپ اپل با پردازنده‌ی مبتنی‌بر ARM کوپرتینونشین‌ها موسوم به M1 خواهد بود.همان‌طور که انتظار می‌رفت مک‌بوک ایر به‌لحاظ ظاهر و طراحی هیچ تفاوتی با نسخه‌ی اینتل ندارد و همانند گذشته است. تغییرات اصلی مک‌ بوک ایر در داخل آن رخ می‌دهد؛ جایی‌که تراشه اختصاصی M1 توان پردازشی موردنیاز کاربر را با بهره‌وری بالاتر و مصرف انرژی کمتر فراهم می‌سازد. این تراشه در دو نسخه‌ با گرافیک 7 یا 8 هسته‌ای درون مک بوک ایر به‌کار می‌رود؛ اما در هر دو نسخه، پردازنده‌ی مرکزی 8 هسته‌ای و واحد پردازش عصبی 16 هسته‌ای دردسترس هستند. به‌مدد بهینگی بسیار بیشتر تراشه‌‌ی اختصاصی M1، کوپرتینونشین‌ها مک‌ بوک ایر را با سیستم خنک‌کننده‌ی پسیو (بدون فن) تولید می‌کنند.اپل می‌گوید CPU داخل تراشه‌ی M1 به‌مدد 4 هسته‌ی قدرتمند و 4 هسته‌ی کم‌مصرفش در مجموع بالغ‌بر 3٫5 برابر و GPU هشت هسته‌ای آن نیز تا 5 برابر سریع‌تر از نسل گذشته عمل می‌کنند. از سوی دیگر به‌لطف واحد پردازش عصبی 16 هسته‌ای M1 پردازش‌های مبتنی‌بر یادگیری ماشین نظیر تشخیص چهره یا شناسایی اجسام تا 9 برابر سریع‌تر صورت می‌گیرد. براساس ادعای اپل، تراشه‌ی M1 موجود در داخل مک بوک ایر از «98 درصد لپ‌تاپ‌های فروخته‌شده در سال گذشته» سریع‌تر است. اپل می‌گوید به‌لطف کنترلر حافظه‌ی موجود در M1 و حافظه‌های جدید، ماژول‌های SSD مک‌بوک ایر بالغ‌بر 2 برابر سریع‌تر از گذشته هستند.اولترابوک محبوب اپل جک 3٫5 میلی‌متری هدفون و دو پورت USB 4 با پشتیبانی از USB 3.1 Gen 2 (پهنای باند 10 گیگابیت‌برثانیه) و تاندربولت 3 (پهنای باند 40 گیگابیت‌برثانیه) را دراختیار کاربر می‌گذارد. این پورت‌‌ها هم‌اکنون از گرافیک اکسترنال پشتیبانی نمی‌کنند؛ اما به‌کمک آن‌ها می‌توان یک نمایشگر اکسترنال با وضوح 6K و نرخ نوسازی 60 هرتز را به مک‌بوک ایر متصل کرد.مک بوک ایر اسپیکرهای استریو با پشتیبانی از دالبی اتموس، ماژول Wi-Fi 6 و بلوتوث 5 را در بطن خود دارد. این لپ‌تاپ همانند گذشته از وب‌کم 720p استفاده می‌کند؛ اما اکنون به‌لطف پردازنده‌ی سیگنال تصویر داخل تراشه‌ی M1 تصاویر را با نویز کمتر و گستره‌ی دینامیکی وسیع‌تری ثبت می‌کند.",
//     recentComments:[
//         {
//         type:commentType.comment,
//         // answerto?:string  //for answer comments
//         id:'1',
//         productID:'1',
//         order:{color:{hex:'#ffffff', title:'سفید'},sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
//         rate:3,
//         user:{userid:'2' , firstname:'لوگان',lastname:'پال'},
//         content:'برای دخترم گرفتم تازه به دستش رسیده ولی فوق العاده دوستش داره ',
//         disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
//         dateSent:'2024/5/1 22:20:01'
//         },
//         {
//         type:commentType.comment,
//         // answerto?:string  //for answer comments
//         id:'2',
//         productID:'1',
//         // orderID:'5', //for normal comments
//         user:{userid:'1' , firstname:'ممد',lastname:'علی کلی'},
//         content:'دستگاه خوب با امکانات خوبیه،سفارش منم به موقع سالم وپلمپ تحویل دادن',
//         disAndlike:[{userid:'3',disOlike:false},{userid:'1',disOlike:false},{userid:'4',disOlike:true},],
//         dateSent:'2024/5/1 22:20:02'
//         },
//         {
//         type:commentType.question,
//         answers:[
//             {
//             type:commentType.answer,
//             id:'3',
//             productID:'1',
//             order:{color:{hex:'#ffffff', title:'سفید'},sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
//             // rate:3,
//             user:{userid:'3' , firstname:'لوگان',lastname:'پال'},
//             content:'برای بازی نه ولی درحالت عادی 8 ساعت دووم داره',
//             disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
//             dateSent:'2024/5/1 22:20:01'
//             },
//             {
//             type:commentType.answer,
//             id:'6',
//             productID:'1',
//             order:{color:{hex:'#ffffff', title:'سفید'} ,sellerTitle:'پیشرو تجارت خاورمیانه'}, //for normal comments
//             // rate:3,
//             user:{userid:'4' , firstname:'لوگان',lastname:'پال'},
//             content:'درحالت عادی 8 ساعت دووم داره',
//             disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
//             dateSent:'2024/5/2 22:20:01'
//             },
//         ], 
//         id:'4',
//         productID:'1',
//         user:{userid:'4' , firstname:'ممد',lastname:'علی کلی'},
//         content:'شارژ نگه داشتنش خوبه؟',
//         dateSent:'2024/5/1 22:20:02'
//         },
//         {
//         type:commentType.question,
//         // answerto?:string  //for answer comments
//         id:'5',
//         productID:'1',
//         user:{userid:'4' , firstname:'لوگان',lastname:'پال'},
//         content:'ویندوز روش نصبه؟',
//         dateSent:'2024/5/1 22:20:01'
//         },
//     ] 
// }

interface Props {
    params: {productID: string}  
}
const ProductPage = async({params:{productID}}:Props) => {
    
    //server
    const res = await fetch(`https://localhost:8080/products/product/${productID}`)
    const temp  = await res.json()
    const product:ProductInterface = temp.product
    const recentComments:Comment[] = temp.comments

    return (
        <div className='p-5 m-10 bg-white rounded-lg'>
            {/* <h1>{temp.product} jjj</h1> */}
            <ClientPart product={product} />
            <div className='mt-20'>
                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>معرفی</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        <p className='mt-5'>{product.description}</p>
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>مشخصات</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        <div className='mt-5 '>
                                    <table className="w-full text-right table-auto min-w-max">
                                        <tbody>
                            {product.details.map(detail=>(
                                <>
                                    <tr>
                                        <td>{detail.title}</td>
                                    </tr>
                                    {Object.entries(detail.map).map(([key, value]) => (
                                    <tr className="hover:bg-slate-50" key={key}>
                                        <td className="p-4 w-1/5">
                                        <p className="block text-grey-dark text-sm text-slate-800">
                                            {key}:
                                        </p>
                                        </td>
                                        <td className="p-4 border-b border-grey-border">
                                        <p className="block text-sm text-slate-800">
                                            {value}
                                        </p>
                                        </td>
                                    </tr>
                                    ))}
                                </>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>بازخورد ها</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    
                    className="collapse-content max-h-96 overflow-auto bg-primary-bg border-2 border-propBubble-bg">
                        {recentComments?.map((comment , index) =>{
                            console.log(comment)
                            if (comment.type == commentType.comment){
                                return <div key={comment.id} className='mt-5 p-4 bg-white border border-grey-border'>
                                    <div className='flex mt-5'>
                                        <p className='text-grey-dark text-sm'>{comment.user.firstname} {comment.user.lastname}</p>
                                        {comment.order && <p className=' bg-primary-color text-white p-1 text-xs rounded-md mx-2'>خریدار</p>}
                                    </div>
                                    {comment.rate && <div className="rating mt-5 ">
                                        <input  disabled = {!(comment.rate==1)} checked= {comment.rate==1}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==2)} checked= {comment.rate==2}  type="radio"name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==3)} checked= {comment.rate==3}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==4)} checked= {comment.rate==4}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                        <input  disabled = {!(comment.rate==5)} checked= {comment.rate==5}  type="radio" name={`rating-${index}`} className="mask mask-star-2 bg-primary-color" />
                                    </div>}
                                    <p className='my-5'>{comment.content}</p>
                                    {comment.order && <div className='flex my-5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                        </svg>
                                            
                                        <p className='text-xs'>{comment.order?.sellerTitle}</p>
                                        <div className='h-4 w-4 mx-2 border-grey-dark border rounded-full' style={{backgroundColor:comment.order.color.hex}}></div>
                                    </div>}
                                
                                </div>
                            }
                        })}
                    </div>
                </div>

                <div className="collapse collapse-arrow  bg-propBubble-bg text-black mb-3 ">
                    <input type="checkbox" className="peer"/>
                    <div 
                     className="collapse-title text-xl font-medium bg-propBubble-bg ">
                       <h2 className=''>پرسش ها</h2> 
                    </div>
                    <div style={{ wordSpacing:'5px',lineHeight:'30px'}} 
                    className="collapse-content bg-white border-2 border-propBubble-bg">
                        {recentComments?.map((comment , index) =>{
                            console.log(comment)
                            if (comment.type == commentType.question){
                                const answers = comment?.answers ?? []
                                return <div key={comment.id} className='mt-5 p-4 bg-white border border-grey-border'>
                                    <div className='flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-primary-color">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                        </svg>
                                        <p className='my-5 mx-2'>{comment.content}</p>
                                    </div>
                                    <SeeMore minItemsCount={1}>
                                        {answers.map((item, index) => (
                                            <div className=' pt-3' key={index}>
                                                <div className='flex'>
                                                    <p className='text-grey-dark text-sm ml-4'>پاسخ</p>
                                                    <div>
                                                        <p className='text-grey-dark text-sm'>{item.content}</p>
                                                        <p className='text-xs text-grey-light my-4'>{comment.user.firstname} {comment.user.lastname}</p>
                                                    </div>
                                                </div>
                                                
                                                <hr className='text-grey-border mb-3 mt-10' />
                                            </div>
                                        ))} 
                                    </SeeMore>
                                    <hr className='text-grey-border mt-5 mb-5'></hr>
                                    <Answer questionID={comment.id} questionContent={comment.content}/>      
                                
                                </div>
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProductPage