import React from 'react'
import { ProductInterface , shipmentMethod , Comment , commentType} from '@/app/components/Interfaces/interfaces'
import ClientPart from './ClientPart'

const comments:Comment[]=[
    {
    type:commentType.comment,
    // answerto?:string  //for answer comments
    id:'1',
    productID:'1',
    orderID:'5', //for normal comments
    userID:'1',
    content:'',
    disAndlike:[{userid:'2',disOlike:true},{userid:'3',disOlike:false},{userid:'4',disOlike:true},],
    dateSent:'2024/5/1 22:20:01'
    },
    {
    type:commentType.comment,
    // answerto?:string  //for answer comments
    id:'2',
    productID:'1',
    // orderID:'5', //for normal comments
    userID:'2',
    content:'',
    disAndlike:[{userid:'3',disOlike:false},{userid:'1',disOlike:false},{userid:'4',disOlike:true},],
    dateSent:'2024/5/1 22:20:02'
    },
]

const product:ProductInterface = {
    id:'1',
    sellcount:100,
    visitCount:3,
    visits:["2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" ,"2019-01-16 22:10:28" , ],
    title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook E1504GA-BQ509-i3 N305 4GB 512SSD',
    
    sellers:[
        {discountId:'3',
         price:21999000,
         sellerTitle:'پیشرو تجارت خاورمیانه',
         sellerRating:9.1,
         garante:{title:'گارانتی ۲۴ ماهه حامی' , desc:'گارانتی خوب'},
         quantity:[{color:'#000000' , quantity:4},{color:'#ffffff' , quantity:10}],
         sellerid:'1',
         shipmentMethod:shipmentMethod.option1
        },
        {garante:{title:'گارانتی ۲۴ ماهه حامی' , desc:'گارانتی خوب'},
        price:19999000,
        sellerTitle:'طرح اندیشان سمت نو',
        sellerRating:7,
        quantity:[{color:'#000000' , quantity:1},{color:'#ff9900' , quantity:10}],
        sellerid:'2',
        shipmentMethod:shipmentMethod.option2
        }
    ],
    rating: {rate:4,rateNum:10},
    brand:'Asus',
    original:true,
    categoryID:'2',
    details:[
        {key:'سازنده پردازنده' , value:'Intel'},
        {key:'سری پردازنده' , value:'Core i3'},
        {key:'ظرفیت حافظه RAM' , value:'16GB'},
        {key:'مدل پردازنده' , value:'N۳۰۵'},
        {key:'نوع حافظه RAM' , value:'DDR4'},
        {key:'ظرفیت حافظه داخلی' , value:'512GB'},
        {key:'نوع حافظه داخلی' , value:'SSD'},
        {key:'سازنده پردازنده گرافیکی' , value:'Intel'},
        {key:'پردازنده گرافیکی' , value:'UHD Graphics'},
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
}

interface Props {
    params: {productID: string}  
}
const ProductPage = ({params:{productID}}:Props) => {
    

    return (
        <div className='p-5 m-10 bg-white rounded-lg'>
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
                               

                                            <tr className="hover:bg-slate-50">
                                                <td className="p-4 w-1/5">
                                                    <p className="block text-grey-dark text-sm text-slate-800">
                                                        {detail.key}:
                                                    </p>
                                                </td>
                                                <td className="p-4 border-b border-grey-border">
                                                    <p className="block text-sm text-slate-800">
                                                        {detail.value}
                                                    </p>
                                                </td>
                                            </tr> 
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
                    className="collapse-content max-h-96 overflow-auto bg-white border-2 border-propBubble-bg">
                        <p className='mt-5'>{product.description}</p>
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
                        <p className='mt-5'>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProductPage