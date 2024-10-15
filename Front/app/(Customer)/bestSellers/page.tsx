import { SellerAddProdctCard } from '@/app/components/Interfaces/interfaces'
import Link from 'next/link'
import React from 'react'

const BestSellers = async() => {
    const res2 = await fetch("https://localhost:8080/products/salediscount/MostDiscounts")
    const mostProducts  = await res2.json()
    const bestSellers:SellerAddProdctCard[] = mostProducts.best_sales
    return (
        <div className=' grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mt-4 place-items-center'>
            {/* <h1>{JSON.stringify(mostProducts)}</h1> */}
        {bestSellers?.map((product)=>(
          <Link href={`/products/${product.CategoryID}/${product?.ID}`} className='m-2 p-4 bg-white rounded-md flex flex-col' key={product.ID}>
            <img className='w-2/3 self-center mb-10 mt-3' src={product?.Picture}/>
            <p className='text-lg font-semibold '>{product.Title}</p>
            <p className='pt-3 text-primary-color text-lg'>{product.UrbanPrice}</p>
          </Link>
        )

        )}
    </div>
    )
}

export default BestSellers