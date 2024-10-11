import { useQuery } from "@tanstack/react-query";
import { Category } from "../(Customer)/page";
function useGetCategories(){
    console.log('1')
    return useQuery<Category[]>({
        queryKey : ['categories'],
        queryFn : async () => {
            console.log('2')
            const result = await fetch("https://127.0.0.1:8080/products/category", {
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
export default useGetCategories;