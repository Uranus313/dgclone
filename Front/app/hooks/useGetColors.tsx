import { useQuery } from "@tanstack/react-query";
import { Category } from "../(Customer)/page";
function useGetColors(){
    console.log('1')
    return useQuery({
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
export default useGetColors;