import { useQuery } from "@tanstack/react-query";
import { Transaction } from "../menu/allTransactions/TransactionPopUp";

interface TransactionListResponse {
    data : Transaction[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: string
}
function useGetTransactions(query : Query){
    return useQuery({
        queryKey : ['transactionList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allTransactions" +`?sort=${query.sort}&limit=${query.limit}&floor=${query.floor}${query.nameSearch && `&nameSearch=${query.nameSearch}`}`, {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as TransactionListResponse;
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
export default useGetTransactions;