import ProductCard from '@/app/components/ProductCar/ProductCard'
import React from 'react'
import { ProductCardInterface } from '@/app/components/Interfaces/interfaces'
import Link from 'next/link'
import { getCategory } from '@/app/Functions/ServerFunctions'
import Filter from './Filter'
import Sort from './Sort'


const products : ProductCardInterface[] = [
  {
    id:'1',
    title:'لپ تاپ 15.6 اینچی لنوو مدل IdeaPad 5 15IAL7-i5 1235U 16GB 512SSD MX550',
    price:19002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/423772272c275a2c884f53fa38bb70424d49c4aa_1705152130.jpg',
  },
  {
    id:'2',
    title:'لپ تاپ 15.6 اینچی لنوو مدل Ideapad 1-Celeron N4020 4GB 256SSD',
    price:21002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/e5dfffed0fe58135b9787887394f4db17be8c5dc_1693397601.jpg',
  },
  {
    id:'3',
    title:'لپ تاپ 15.6 اینچی لنوو مدل IdeaPad Slim 3 15IRH8-i7 13620H 16GB 512SSD',
    price:23002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/41d43012149f70c0f9bc1f3d9619b6746cc29674_1692203922.jpg',
  },
  {
    id:'4',
    title:'لپ تاپ 15.6 اینچی لنوو مدل V15 G4 AMN-Athlon Silver 7120U 8GB 256SSD',
    price:34022000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/f9d556a68cc4a507cc80981935cf68ae2e3d7711_1690028248.jpg',
  },
  {
    id:'5',
    title:'لپ تاپ 15.6 اینچی لنوو مدل LOQ 15IRX9-i7 13650HX 16GB 512SSD RTX4050',
    price:34420000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/41d43012149f70c0f9bc1f3d9619b6746cc29674_1707031515.jpg',
  },
  {
    id:'6',
    title:'لپ تاپ 15.6 اینچی لنوو مدل V15 G4 IRU-i5 13420H 16GB 512SSD',
    price:32390000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/cb5c07fad386b822d6bee3ffb5709191416dcbc3_1713901509.jpg',
  },
  {
    id:'7',
    title:'پ تاپ 15.6 اینچی لنوو مدل IdeaPad 5 15IAL7-i7 1255U 16GB 512SSD MX550',
    price:445002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/8cade9127074329e1dec7706c076bfea6a36d9ab_1712562497.jpg',
  },
  {
    id:'8',
    title:'لپ تاپ 15.6 اینچی لنوو مدل LOQ 15IRX9-i7 13650HX-16GB DDR5-512GB SSD-RTX4060-FHD',
    price:342902000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/d2c4c97ada1073807f922d6f52fc1ebd6603f271_1688296477.jpg',
  },
  {
    id:'9',
    title:'لپ تاپ 15.6 اینچی لنوو مدل LOQ 15IAX9-i5 12450HX 16GB 512SSD RTX3050',
    price:19342000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/a92f456002e6d3d59ca13fca942a9cfb906a8a16_1709988101.jpg',
  },
  {
    id:'10',
    title:'لپ تاپ 15.6 اینچی ایسوس مدل Vivobook X1504ZA-NJ061-i5 1235U 8GB 512SSD',
    price:1839002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/016a9d6ed662d1653578faca7038bdf9e1f8515d_1710105522.jpg',
  },
  {
    id:'11',
    title:'پ تاپ 13.6 اینچی اپل مدل MacBook Air MRXV3 2024 ZPA-M3-8GB RAM-256GB SSD',
    price:3902000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/b872d69721bf570c6c99278a890b6c82c87687db_1718962056.jpg',
  },
  {
    id:'12',
    title:'لپ تاپ 15.6 اینچی ایسر مدل Aspire 5 A515-57G-59VY-i5 1235U 8GB 512SSD RTX2050 - کاستوم شده',
    price:23040000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/f9d556a68cc4a507cc80981935cf68ae2e3d7711_1712491233.jpg',
  },
  {
    id:'13',
    title:'لپ تاپ 15.6 اینچی لنوو مدل IdeaPad 5 15IAL7-i7 1255U 16GB 512SSD MX550',
    price:20002000,
    picture:'https://dkstatics-public.digikala.com/digikala-products/e89295ab7e1e907808099079ac4ee49a67c771c0_1704658676.jpg',
  },

]

interface Props {
    params: {id: string} 
    searchParams:{sortOrder: string}
}

const ProductPage = ({params:{id},searchParams:{sortOrder}}:Props) => {
  let category = getCategory(id)
  return (
    <div>
      <h1 className='mt-10 mb-8 mx-5 text-3xl font-black'>{category?.title}</h1>
      <div className='grid grid-cols-12 gap-2 mx-5'>
        <div className='col-span-3  bg-white rounded-md'>
          <Filter/>
        </div>
        <div className='col-span-9'>
          <div className='flex mx-2 gap-5 items-center'>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 font-bold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
            </svg>

            <p className='font-bold'>مرتب سازی :</p>
            <Sort/>
          </div>
          <div className=' grid grid-cols-3 mt-4 place-items-center'>
              {products.map((product)=>(
                <div className='m-2 p-4 bg-white rounded-md' key={product.id}>
                  <img src={product.picture}/>
                  <p>{product.title}</p>
                </div>
              )

              )}
              <ProductCard/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage