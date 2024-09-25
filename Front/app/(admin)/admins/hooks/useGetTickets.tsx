import { useQuery } from "@tanstack/react-query";
import { Ticket } from "../menu/allTickets/TicketPopUP";

interface TransactionListResponse {
    data : Ticket[],
    hasMore : boolean
}
interface Query{
    floor : number,
    limit : number,
    sort: string
}
function useGetTicket(query : Query){
    return useQuery({
        queryKey : ['ticketList', query],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/general/allTransactions" +`?sort=${query.sort}&limit=${query.limit}&floor=${query.floor}`, {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult as TransactionListResponse;
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
export default useGetTicket;