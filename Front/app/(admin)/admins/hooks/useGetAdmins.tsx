import { useQuery } from "@tanstack/react-query";
import { Admin } from "../menu/allAdmins/AdminPopUp";

interface AdminListResponse {
    data : Admin[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null
}
function useGetAdmins(query : Query){
    return useQuery({
        queryKey : ['adminList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allAdmins"+`?limit=${query.limit}&floor=${query.floor}${query.nameSearch && `&nameSearch=${query.nameSearch}`}`, {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as AdminListResponse
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
export default useGetAdmins;