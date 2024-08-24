import { useQuery } from "@tanstack/react-query";
function useUserCheckToken(){
    return useQuery({
        queryKey : ['user'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/user/checkToken", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult
            }else{
                throw new Error(jsonResult.error.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1
    })
}
export default useUserCheckToken;