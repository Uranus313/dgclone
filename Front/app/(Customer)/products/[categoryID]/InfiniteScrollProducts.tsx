'use client'
import Link from 'next/link'
import React from 'react'
import useGetProducts from '../../../hooks/useGetProducts'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'next/navigation';



interface Props{
    categoryID:string
    startFromBeg?:number
    sort?:string
}
const InfiniteScrollProducts = ({categoryID ,sort, startFromBeg=1}:Props) => {


    const {data , error , isLoading , fetchNextPage , isFetchingNextPage } = useGetProducts({categoryID:categoryID, limit:12 , pageParamm:startFromBeg})
    console.log('prod prod',data)
    const totalFetchedGames =
    data?.pages.reduce((total, page) => total + page?.products?.length, 0) ||
    0;
    return (
        <InfiniteScroll
            dataLength={totalFetchedGames} //This is important field to render the next data
            next={() => fetchNextPage()}
            hasMore={data?.pages[data?.pages.length-1].hasMore??false}
            loader={<span className="loading loading-dots loading-lg"></span>}
            endMessage={
            <p style={{ textAlign: "center" }}>
                {!isLoading ?<b>رسیدی به تهش</b>:<span className="loading loading-dots loading-lg"></span>}
            </p>
            }
        >
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-4 place-items-center'>
            {data?.pages.map((page , index)=>(
                <React.Fragment key={index}>
                    {page?.products?.map(product=>(
                        <Link href={`/products/${categoryID}/${product.ID}`} className='m-2 p-4 bg-white rounded-md flex flex-col' key={product.ID}>
                            <img className='w-2/3 self-center mb-10 mt-3' src={product.Picture}/>
                            <p className='text-lg font-semibold '>{product.Title}</p>
                            <p className='pt-3 text-primary-color text-lg'>{product.Price}</p>
                        </Link>
                    ))}
                </React.Fragment>
            ))}
        </div>
    </InfiniteScroll>
    )
}

export default InfiniteScrollProducts