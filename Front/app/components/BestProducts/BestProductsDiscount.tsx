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

interface BestDicounts{
  discount:{_id:string,prod:{prod_id:string,seller_id:string,original_price:number,category_id:string},new_price:number,end_date:Date},percenrage:number,product:SellerAddProdctCard
}

interface Props{
    categoryID?:string;
    color?:string;
    data: BestDicounts[]
}





const BestProductsDiscount = async({data:BestDiscountProducts,categoryID='',color=''}:Props) => {

  return (
    <div>
        <div className='grid-flow-col grid-rows-3 grid overflow-auto rounded-md mx-auto border-grey-border border-2 w-10/12 bg-white'>

            {BestDiscountProducts.map((BestDiscount , index)=>{
              console.log(categoryID)
              return <Link className='w-72' href={'/products/'+BestDiscount.product.CategoryID+"/"+BestDiscount.product.ID} key={BestDiscount.product.ID}>
                <div className='flex items-center p-3' >
                  <img width='70px' src={BestDiscount.product.Picture}/>
                  <h1 className={`m-3 ${color===""?'text-primary-color':''}  font-extrabold text-3xl`} style={{color:color}}>{index+1}</h1>
                  <div>
                    <h1 className=' line-clamp-2 text-sm font-thin text-grey-dark'>{BestDiscount.product.Title}</h1>
                    <h1 className=' line-clamp-2  line-through font-thin text-grey-dark'>{BestDiscount.discount.prod.original_price}</h1>
                    <h1 className=' line-clamp-2 text-lg text-black'>{BestDiscount.discount.new_price}</h1>
                  </div>
                  
                </div>
                <hr className='my-2 mx-auto text-grey-border w-3/4'></hr>
              </Link>
            })}
          </div>
    </div>
  )
}

export default BestProductsDiscount