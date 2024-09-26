import { useQuery } from "@tanstack/react-query";
// import { VerifyRequest } from "../menu/allVerifyRequests/VerifyRequestPopUp";
export interface VerifyRequest{
    sellerID : string,
        adminID: string | undefined,
        requestDate : string | undefined,
        state : "pending" | "accepted" | "rejected"  | undefined,
        _id : string
}

interface VerifyRequestListResponse {
    data : VerifyRequest[],
    hasMore : boolean,
}
interface Query{
    floor : number,
    limit : number,
    nameSearch : string | null,
    state : "pending" | "accepted" | "rejected"  | undefined | null

}
function useGetVerifyRequests(query : Query){
    return useQuery({
        queryKey : ['verifyRequestList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/verifyRequests"+`?limit=${query.limit}&floor=${query.floor}${query.nameSearch && `&nameSearch=${query.nameSearch}`}${query.state && `&state=${query.state}`}`, {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as VerifyRequestListResponse
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
export default useGetVerifyRequests;