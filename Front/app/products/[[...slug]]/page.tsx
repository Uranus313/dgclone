import ProductCard from '@/app/components/ProductCar/ProductCard'
import React from 'react'

interface Props {
    params: {slug: string[]}
    searchParams:{sortOrder: string}
}

const ProductPage = ({params:{slug},searchParams:{sortOrder}}:Props) => {
  return (
    <div>ProductPage {slug} {sortOrder}
      <ProductCard/>
    </div>
  )
}

export default ProductPage