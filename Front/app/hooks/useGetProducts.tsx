import { useInfiniteQuery } from "@tanstack/react-query";
import { Brand, ProductInterface, SellerAddProdctCard } from "../components/Interfaces/interfaces";
import { useRef } from "react";

interface Props {
    limit: number,
    categoryID: string
}

function useGetProducts({ limit, categoryID }: Props) {
    return useInfiniteQuery({
        queryKey: ['product', categoryID],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const result = await fetch(`https://localhost:8080/products/product/?limit=${limit}&offset=${pageParam * limit}&&CateID=${categoryID}`, {
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
