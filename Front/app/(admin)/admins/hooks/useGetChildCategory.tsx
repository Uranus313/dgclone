import { Category } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";


function useGetChildCategory(cateId: string | undefined){
    return useQuery({
        queryKey : ['childCategoryList'+cateId],
        queryFn : async () => {
            const result = await fetch("https://localhost:8080/products/categoryChildren/"+`${cateId}`, {
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
        retry: 3,
        // keepPreviousData: true
    })
}
export default useGetChildCategory;