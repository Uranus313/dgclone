import { useQuery } from "@tanstack/react-query";
import { Category } from "../(Customer)/page";
import { Brand } from "../components/Interfaces/interfaces";
function useGetBrands(){
    console.log('1')
    return useQuery<Brand[]>({
        queryKey : ['brand'],
        queryFn : async () => {
            console.log('2')
            const result = await fetch("https://localhost:8080/products/brand/", {
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

// ha ha ha
export default useGetBrands;