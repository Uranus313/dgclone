import Link from 'next/link'
import React from 'react'
import { ProductCardInterface, SellerAddProdctCard } from '../Interfaces/interfaces'

//#region 
const BestSellerProducts:ProductCardInterface[] = [
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
    categoryID?:string;
    color?:string;
    data: SellerAddProdctCard[]
}


// {"discount":{"_id":"670c3a531684af4970f7ff8b","prod":{"prod_id":"6701d1ba71d45cf3c74c3d4e","seller_id":"6701755968449eaadc51dc34","original_price":414,"category_id":"000000000000000000000000"},"new_price":0,"end_date":"2024-12-18T18:17:55Z"},"percenrage":100,"product":{"ID":"6701d1ba71d45cf3c74c3d4e","Title":"rerum","Price":390,"Picture":"https://dkstatics-public.digikala.com/digikala-products/c23b49b0be1c4ae5b2a3d7a3281d2f1731065243_1726037574.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/format,webp/quality,q_80","DiscountID":"000000000000000000000000","SellerCount":2,"UrbanPrice":390,"Commission":0}}



const BestProducts = async({data:BestSellerProducts,categoryID='',color=''}:Props) => {

  return (
    <div>
        <div className='grid-flow-col grid-rows-3 grid overflow-auto rounded-md mx-auto border-grey-border border-2 w-10/12 bg-white'>

            {BestSellerProducts.map((BestSeller , index)=>{
              console.log(categoryID)
              return <Link className='w-72' href={'/products/'+BestSeller.CategoryID+"/"+BestSeller.ID} key={BestSeller.ID}>
                <div className='flex items-center p-3' >
                  <img width='70px' src={BestSeller.Picture}/>
                  <h1 className={`m-3 ${color===""?'text-primary-color':''}  font-extrabold text-3xl`} style={{color:color}}>{index+1}</h1>
                  <h1 className=' line-clamp-2 text-sm font-thin text-grey-dark'>{BestSeller.Title}</h1>
                  
                </div>
                <hr className='my-2 mx-auto text-grey-border w-3/4'></hr>
              </Link>
            })}
          </div>
    </div>
  )
}

export default BestProducts