import { Order } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface OrderListResponse {
    orders : Order[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: number,
    state: string
}
function useGetOrders(query : Query){
    return useQuery({
        queryKey : ['orderList', query],
        queryFn : async () => {
            const result = await fetch("https://localhost:8080/products/order"+`?limit=${query.limit}&offset=${query.floor}&SortMethod=${query.sort}&ProdTitle=${query.nameSearch}&OrderStates[0]=${query.state}`, {
                credentials: 'include'
            });
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as OrderListResponse
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
export default useGetOrders;