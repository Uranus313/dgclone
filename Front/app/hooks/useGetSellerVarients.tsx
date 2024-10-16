import { useQuery } from "@tanstack/react-query";
import { Category } from "../(Customer)/page";
import { SellerInfosOnProduct, SellerSetVarientOnProduct } from "../components/Interfaces/interfaces";
function useGetSellerVarients(){
    console.log('1')
    return useQuery<SellerInfosOnProduct>({
        queryKey : ['colors'],
        queryFn : async () => {
            console.log('2')
            const result = await fetch("https://localhost:8080/products/color", {
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
export default useGetSellerVarients;