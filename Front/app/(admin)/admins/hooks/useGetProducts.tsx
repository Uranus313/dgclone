import { ProductInterface } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface ProductListResponse {
    products : ProductInterface[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: number
}
function useGetProducts(query : Query){
    return useQuery({
        queryKey : ['productList', query],
        queryFn : async () => {
            const result = await fetch("https://localhost:8080/products/allProducts"+`?limit=${query.limit}&offset=${query.floor}&SortMethod=${query.sort}`, {
                credentials: 'include'
            });
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