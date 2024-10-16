import { useQuery } from "@tanstack/react-query";
function useGetGaurantees(){
    return useQuery<{_id:string,title:string}[]>({
        queryKey : ['ggg'],
        queryFn : async () => {
            console.log('2')
            const result = await fetch("https://localhost:8080/products/guarantee", {
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
export default useGetGaurantees;