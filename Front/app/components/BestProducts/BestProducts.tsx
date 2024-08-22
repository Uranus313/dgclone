import Link from 'next/link'
import React from 'react'
import { ProductCard } from '../Interfaces/interfaces'

//#region 
const BestSellerProducts:ProductCard[] = [
    {
      id:'1',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'2',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'7',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'3',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'4',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'5',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:' گوشی سامسونگ 32 گیگ بسیار عالی و توضیحات دیگر a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'5',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'5',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'5',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'5',
      title:'گوشی سامسونگ ibhbhohbokp,omo,o,po[,p,p,a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
    {
      id:'6',
      title:'گوشی سامسونگ a15',
      price:14000000,
      picture:'https://dkstatics-public.digikala.com/digikala-products/6aafaa9bdd90449f061a29c6c13641d94bb50325_1704181647.jpg',
    },
  ]
  //#endregion


interface Props{
    filter:string
}
const BestProducts = ({filter}:Props) => {
  return (
    <div>
        <div className='grid-flow-col grid-rows-3 grid overflow-auto rounded-md mx-auto border-grey-border border-2 w-10/12 bg-white'>
            {BestSellerProducts.map((BestSeller , index)=>{
              return <Link className='w-72' href={'/product/'+BestSeller.id} key={BestSeller.id}>
                <div className='flex items-center p-3' >
                  <img width='70px' src={BestSeller.picture}/>
                  <h1 className='m-3 text-primary-color font-extrabold text-3xl'>{index+1}</h1>
                  <h1 className=' line-clamp-2 text-sm font-thin text-grey-dark'>{BestSeller.title}</h1>
                  
                </div>
                <hr className='my-2 mx-auto text-grey-border w-3/4'></hr>
              </Link>
            })}
          </div>
    </div>
  )
}

export default BestProducts