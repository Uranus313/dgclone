import { Comment } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface OrderListResponse {
    pendingComments : Comment[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: string
}
function useGetPendingComments(query : Query){
    return useQuery({
        queryKey : ['commentList', query],
        queryFn : async () => {
            const result = await fetch("https://localhost:8080/products/comments/pending", {
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
export default useGetPendingComments;