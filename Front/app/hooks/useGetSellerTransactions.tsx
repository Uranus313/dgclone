import { useQuery } from "@tanstack/react-query";
import { Transaction } from "../components/Interfaces/interfaces";

function useGetSellerTransactions(){
    return useQuery<Transaction[]>({
        queryKey : ['sellerTransations'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/seller/myTransactions", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })
}
export default useGetSellerTransactions;