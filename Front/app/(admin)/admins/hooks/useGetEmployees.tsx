import { User } from "@/app/components/Interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";

interface EmployeeListResponse {
    data : User[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    sort: string
}
function useGetEmployees(query : Query){
    return useQuery({
        queryKey : ['employeeList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allEmployees" +`?sort=${query.sort}&limit=${query.limit}&floor=${query.floor}${query.nameSearch && `&nameSearch=${query.nameSearch}`}`, {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as EmployeeListResponse;
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
export default useGetEmployees;