import { useInfiniteQuery } from "@tanstack/react-query";
import { Brand, ProductInterface, SellerAddProdctCard } from "../components/Interfaces/interfaces";
import { useEffect, useRef, useState } from "react";
import useQueryNext from "./useQueryNext";
import useGetBrands from "./useGetBrands";
import { useSearchParams } from "next/navigation";

interface Props {
    limit: number,
    categoryID: string
    pageParamm?:number
    sort?:boolean
}

function useGetProducts({ limit, categoryID, pageParamm=0 , sort=true }: Props) {
    const {searchParams,pathname} = useQueryNext()
    // const searchParams = useSearchParams();
    const [sortOrder,setSortOrder]=useState(searchParams.get("sortOrder"))
    // const {data:brands} = useGetBrands() 
    const [filterBrands,setFilterBrands] = useState('')
    const paramsArray = Array.from(searchParams.entries());
    const brands:string[] = [];

    paramsArray.forEach(([key, value]) => {
        if (key.startsWith('brand[') && key.endsWith(']')) {
        brands.push(value);
        }
    });


    useEffect(()=>{
        setSortOrder(searchParams.get('sortOrder'))
  
    },[searchParams.get('sortOrder')])

    useEffect(()=>{
        console.log('brandss',brands)
        console.log('kkkkk',)
        const temp = brands.map((brand, index) => `brandFilters[${index}]=${brand}`).join("&")
        setFilterBrands(temp)
    },[searchParams])


    return useInfiniteQuery({
        queryKey: ['product', sortOrder,brands,pathname],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const result = await fetch(`https://localhost:8080/products/product/?limit=${limit}&offset=${pageParam * limit - limit * pageParamm}&CateID=${categoryID}${sort ? `&SortMethod=${sortOrder}` : ''}&${brands.length > 0 ? filterBrands :''}`, {
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
