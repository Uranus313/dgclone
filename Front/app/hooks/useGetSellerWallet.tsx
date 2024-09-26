import { useQuery } from "@tanstack/react-query";
import { Wallet } from "../(Seller)/sellers/menu/layout";
function useGetUserWallet(){
    return useQuery({
        queryKey : ['sellerWallet'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/seller/myWallet", {
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
export default useGetUserWallet;