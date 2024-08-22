
import Image from 'next/image'
import Link from 'next/link'
import banner from './assets/images/banner.png'
import Incredibles from './components/Incredibles/Incredibles'
import { ProductCard } from './components/Interfaces/interfaces'
import BestProducts from './components/BestProducts/BestProducts'

export interface Category {
  title: string;
  children?: Category[];
  details: { title: string; list: string[] }[];
  parentID?: string;
  id: string;
  pictures: string[];
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
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "2",
            id: "8",
            pictures: ["" , ''],
          },
          {
            title: "لپتاپ ایسوس",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "2",
            id: "9",
            pictures: ["" , ''],
          },
        ],
        details: [{ title: "specs", list: ["brand", "sth"] }],
        parentID: "1",
        id: "2",
        pictures: ["" , ''],
      },
      {
        title: "موبایل",
        children: [
          {
            title: "موبایل اپل",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "3",
            id: "30",
            pictures: ["" , ''],
          },
          {
            title: "موبایل سامسونگ",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "3",
            id: "31",
            pictures: ["" , ''],
          },
        ],
        details: [{ title: "specs", list: ["brand", "sth"] }],
     
        id: "3",
        pictures: ["" , ''],
      },
  
    ],
    details: [{ title: "specs", list: ["brand", "sth"] }],
    parentID: "",
    id: "1",
    pictures: ["" , 'https://dkstatics-public.digikala.com/digikala-mega-menu/aba1e5dca8958ac1176e25cd194ff8ac622cd383_1692600155.png'],
  },

  {
    title: "لوازم برقی خانه",
    children: [
      {
        title: "یخچال",
        children: [
          {
            title: "یخچال ساید بای ساید",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "2",
            id: "8",
            pictures: ['' , ''],
          },
          {
            title: "یخچال کمپی",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "2",
            id: "9",
            pictures: ["" , ''],
          },
        ],
        details: [{ title: "specs", list: ["brand", "sth"] }],
        parentID: "1",
        id: "2",
        pictures: [""  , ''],
      },
      {
        title: "پخت و پز",
        children: [
          {
            title: "ماکروویو",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "3",
            id: "30",
            pictures: ["" , ''],
          },
          {
            title: "توستر",
            details: [{ title: "specs", list: ["brand", "sth"] }],
            parentID: "3",
            id: "31",
            pictures: ["" , ''],
          },
          
        ],
        details: [{ title: "specs", list: ["brand", "sth"] }],
     
        id: "3",
        pictures: ["" , ''],
      },
  
    ],
    details: [{ title: "specs", list: ["brand", "sth"] }],
    parentID: "",
    id: "1",
    pictures: ["" , 'https://dkstatics-public.digikala.com/digikala-mega-menu/c16b7dff700a9d99880174c32ec233d20ddb531c_1703057953.png'],
  },  

  { 
    title: 'کتاب و لوازم تحریر',
    details: [{ title: 'sth' , list: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/3582bbed0a53318c2332d2c79b051b226f02a3bb_1692600677.png'],
  },
  { 
    title: 'مد و پوشاک',
    details: [{ title: 'sth' , list: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/5795b31a635f1e23df96a908c009f31744ede38f_1692600481.png'],
  },
  { 
    title: 'کارت هدیه',
    details: [{ title: 'sth' , list: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/20c179dff5c513104599d33858b6b11e77ced9b4_1692601532.png'],
  },
  { 
    title: 'اسباب بازی',
    details: [{ title: 'sth' , list: ["brand", "sth"] }],
    id: '40',
    pictures: ['','https://dkstatics-public.digikala.com/digikala-mega-menu/0c46d2532d61dd3a5b6a3afc17552c23c1b4d39e_1692600773.png'],
  },
  
];

//#endregion

export default function Home() {


  


  return (
   <main className='overflow-auto h-fit' >
       <Image className='' src='/banner.png' width='380' height='300' alt='banner'/>
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
          <h1 className='text-black text-center text-xl   my-5'>پرفروش ترین ها</h1>
          <BestProducts filter='best-sellers'/>
          
      </div>

      <div className='p5 mb-5 mt-14 '>
          <h1 className='text-black text-center text-xl pb-10'>پرتخفیف ترین ها</h1>
          <BestProducts filter='most-discounts'/>
      </div>
    </main>
  )
}
