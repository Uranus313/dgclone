import { useQuery } from "@tanstack/react-query";
import {  AccessLevel } from "../menu/allEmployees/EmployeePopUp";


function useGetAccessLevels(){
    return useQuery({
        queryKey : ['accessLevels'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/employee/accessLevels", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as AccessLevel[];
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
export default useGetAccessLevels;