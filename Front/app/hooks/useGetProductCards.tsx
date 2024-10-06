'use client'
import { useQuery } from "@tanstack/react-query";
import { SellerAddProdctCard } from "../components/Interfaces/interfaces";
import { useSearchParams } from "next/navigation";

interface Props{
    category:string|null
}
function useGetProductCards(){
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    console.log('1')
    return useQuery<SellerAddProdctCard[]>({
        queryKey : ['productCards'],
        queryFn : async () => {
            console.log('2')
            const result = await fetch(`http://localhost:8080/products/product/?CateID=${category}$$limit=20&&offset=0`, {
                            credentials: 'include'});
                           
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