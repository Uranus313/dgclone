import { useInfiniteQuery } from "@tanstack/react-query";
import { Brand, ProductInterface, SellerAddProdctCard } from "../components/Interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import useQueryNext from "./useQueryNext";

interface Props {
    limit: number,
    categoryID: string
    pageParamm?:number
    sort?:boolean
}

function useGetProducts({ limit, categoryID, pageParamm=0 , sort=true }: Props) {
    const {searchParams} = useQueryNext()
    const [sortOrder,setSortOrder]=useState(searchParams.get("sortOrder")) 

    useEffect(()=>{
        setSortOrder(searchParams.get('sortOrder'))
        console.log(sortOrder)
    },[searchParams.get('sortOrder')])


    return useInfiniteQuery({
        queryKey: ['product', sortOrder],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const result = await fetch(`https://localhost:8080/products/product/?limit=${limit}&offset=${pageParam * limit - limit * pageParamm}&CateID=${categoryID}${sort ? `&SortMethod=${sortOrder}` : ''}`, {
                credentials: 'include'
            });

            const jsonResult = await result.json();

            if (result.ok) {
                return {
                    products: jsonResult.products as SellerAddProdctCard[],
                    hasMore: jsonResult.hasMore as boolean
                };
            } else {
                throw new Error(jsonResult.error);
            }
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        }
    });
}

export default useGetProducts;
