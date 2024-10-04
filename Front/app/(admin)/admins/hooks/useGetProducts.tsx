import { ProductInterface } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface ProductListResponse {
    data : ProductInterface[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: string
}
function useGetProducts(query : Query){
    return useQuery({
        queryKey : ['productList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:8080/products/allProducts");
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as ProductListResponse
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 3,
        // keepPreviousData: true
    })
}
export default useGetProducts;