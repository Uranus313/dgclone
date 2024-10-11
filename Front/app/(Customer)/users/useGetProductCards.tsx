'use client'
import { useQuery } from "@tanstack/react-query";
import { SellerAddProdctCard } from "../../components/Interfaces/interfaces";
import { useSearchParams } from "next/navigation";

interface Props{
   categoryID: string
}
function useGetProductCards({categoryID}:Props){
   
    console.log('1')
    return useQuery<{products:SellerAddProdctCard[],hasMore:boolean}>({
        queryKey : ['productCards',categoryID],
        queryFn : async () => {
            console.log('2')
            const result = await fetch(`https://dummyjson.com/users`, );
                           
            const jsonResult = await result.json();
            if(result.ok){
                console.log('4')
                return jsonResult
            }else{
                console.log('err')
                throw new Error(jsonResult.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })
}
export default useGetProductCards;