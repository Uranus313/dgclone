import { useQuery } from "@tanstack/react-query";
import { Admin } from "../menu/allAdmins/AdminPopUp";
function useGetAdmins(){
    return useQuery({
        queryKey : ['adminList'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allAdmins", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as Admin[]
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 3
    })
}
export default useGetAdmins;