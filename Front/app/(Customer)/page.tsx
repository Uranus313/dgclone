
import Image from 'next/image'
import Link from 'next/link'
import banner from './assets/images/banner.png'
import Incredibles from '../components/Incredibles/Incredibles'
import { ProductCardInterface } from '../components/Interfaces/interfaces'
import BestProducts from '../components/BestProducts/BestProducts'


export interface detail{
  title: string,
  keys: string[]
}
export interface Category {
  title: string;
  children?: Category[];
  details: detail[]; //fix
  commisionPercent:number
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
            commisionPercent:2,
          },
          {
            title: "لپتاپ ایسوس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "2",
            id: "9",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        parentID: "1",
        id: "2",
        pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/dcb735863856217c8f64d891269b876c621772d7_1672570805.jpg'],
        commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "موبایل سامسونگ",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "3",
            id: "31",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "ایکس باکس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "42",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
     
        id: "40",
        pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
        commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "ایکس باکس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "44",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "ایکس باکس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "42",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
        id: "40",
        pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
      },

      {
        title: "کنسول بازی",
        children: [
          {
            commisionPercent:2,
            title: "پلی استیشن",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "41",
            pictures: ["" , ''],
          },
          {
            commisionPercent:2,
            title: "ایکس باکس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "42",
            pictures: ["" , ''],
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
        id: "40",
        pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
      },

      {
        title: "کنسول بازی",
        children: [
          {
            commisionPercent:2,
            title: "پلی استیشن",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "41",
            pictures: ["" , ''],
          },
          {
            commisionPercent:2,
            title: "ایکس باکس",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "40",
            id: "42",
            pictures: ["" , ''],
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
        id: "40",
        pictures: ["" , '','https://dkstatics-public.digikala.com/digikala-products/fe1424bb03add04e7c173f49417e1b07ed358eb8_1605100837.jpg'],
      },
  
    ],
    details: [{ title: "specs", keys: ["brand", "sth"] }],
    parentID: "",
    id: "1",
    commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "یخچال کمپی",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "2",
            id: "9",
            pictures: ["" , ''],
            commisionPercent:2,
          },
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        parentID: "1",
        id: "60",
        pictures: [""  , ''],
        commisionPercent:2,
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
            commisionPercent:2,
          },
          {
            title: "توستر",
            details: [{ title: "specs", keys: ["brand", "sth"] }],
            parentID: "3",
            id: "31",
            commisionPercent:2,
            pictures: ["" , ''],
          },
          
        ],
        details: [{ title: "specs", keys: ["brand", "sth"] }],
        commisionPercent:2,
     
        id: "3",
        pictures: ["" , ''],
      },
  
    ],
    commisionPercent:2,
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
    commisionPercent:2,
  },
  { 
    title: 'مد و پوشاک',
    details: [{ title: 'sth' , keys: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/5795b31a635f1e23df96a908c009f31744ede38f_1692600481.png'],
    commisionPercent:2,
  },
  { 
    title: 'کارت هدیه',
    details: [{ title: 'sth' , keys: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/20c179dff5c513104599d33858b6b11e77ced9b4_1692601532.png'],
    commisionPercent:2,
  },
  { 
    title: 'اسباب بازی',
    details: [{ title: 'sth' , keys: ["brand", "sth"] }],
    commisionPercent:2,
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/0c46d2532d61dd3a5b6a3afc17552c23c1b4d39e_1692600773.png'],
  },
  
];

//#endregion

export default function Home() {


  


  return (
   <main className='overflow-auto h-fit' >
      <Image className='' src='/banner.png' width='2000' height='1000' alt='banner'/>

      <div className='p-5 mt-10'>
        <Incredibles/>
      </div>

      <div className='p5 my-5 '>
        <h1 className='text-black text-center text-xl pb-10'>خرید بر اساس دسته بندی</h1>

        <div className='flex justify-center'>
          {Categories.map((category)=>{
            return <div className='mx-5' key={category.id}>
              <img width='100px' src={category.pictures[1]}/>
              <p className='text-center text-xs mt-3 font-semibold'>{category.title}</p>
            </div>
          })}
        </div>
    
      </div>

      <div className='p5 mb-5 mt-14  '>

          <div className='flex justify-center  my-5'>
            <h1 className='text-black text-xl'>
              پرفروش ترین ها      
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-center mx-1  text-primary-color">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
          </div>
          <BestProducts filter='best-sellers'/>
          
      </div>

      <div className='p5 mb-5 mt-14 '>
      <div className='flex justify-center  my-5'>
            <h1 className='text-black text-xl'>
            پرتخفیف ترین ها 
            </h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-center mx-1  text-primary-color">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

          </div>
          <BestProducts filter='most-discounts'/>
      </div>
    </main>
  )
}
