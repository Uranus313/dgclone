import { useQuery } from "@tanstack/react-query";
import { Role } from "../menu/allEmployees/EmployeePopUp";



function useGetRoles(){
    return useQuery({
        queryKey : ['roleList'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/employee/roles", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as Role[];
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
export default useGetRoles;