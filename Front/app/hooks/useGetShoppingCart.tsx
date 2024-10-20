import { useQuery } from "@tanstack/react-query";
import { Wallet } from "../(Seller)/sellers/menu/layout";
import { useUser } from "./useUser";
function useGetShoppingCart(){
    const{user}=useUser()
    console.log('hhhhhh',user)
    const ids= user?.shoppingCart
    let prodIds:string
    prodIds = ids?.map((id, index) => `OrderIDs[${index}]=${id}`).join("&") ??''
    console.log(ids ,prodIds )
    return useQuery({
        queryKey : ['getProductCart', prodIds],
        queryFn : async () => {
            const result = await fetch(`https://localhost:8080/products/ordersInList/?${prodIds}`, {
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
export default useGetShoppingCart;