import { User } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface AdminListResponse {
    data : User[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: string
}
function useGetAdmins(query : Query){
    return useQuery({
        queryKey : ['adminList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allAdmins"+`?sort=${query.sort}&limit=${query.limit}&floor=${query.floor}${query.nameSearch && `&nameSearch=${query.nameSearch}`}`, {
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