'use client'
import Link from 'next/link'
import React from 'react'
import useGetProducts from '../../../hooks/useGetProducts'
import InfiniteScroll from 'react-infinite-scroll-component';



interface Props{
    categoryID:string
    startFromBeg?:number
    sort?:string
}
const InfiniteScrollProducts = ({categoryID ,sort, startFromBeg=1}:Props) => {

    const {data , error , isLoading , fetchNextPage , isFetchingNextPage } = useGetProducts({categoryID:categoryID , sort:sort, limit:12 , pageParamm:startFromBeg})
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
                <b>رسیدی به تهش</b>
            </p>
            }
        >
        <div className='grid grid-cols-3 mt-4 place-items-center'>
            {data?.pages.map((page , index)=>(
                <React.Fragment key={index}>
                    {page?.products?.map(product=>(
                        <Link href={`/products/${categoryID}/${product.ID}`} className='m-2 p-4 bg-white rounded-md flex flex-col' key={product.ID}>
                            <img className='w-2/3 self-center mb-10 mt-3' src={product.Picture}/>
                            <p className='text-lg font-semibold '>{product.Title}</p>
                            <p className='pt-3 text-primary-color text-lg'>{product.UrbanPrice}</p>
                        </Link>
                    ))}
                </React.Fragment>
            ))}
        </div>
    </InfiniteScroll>
    )
}

export default InfiniteScrollProducts