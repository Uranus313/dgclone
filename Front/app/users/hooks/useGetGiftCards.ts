import { useQuery } from "@tanstack/react-query";
import { Wallet } from "../menu/layout";


export interface GiftCard{
    code : string,
    amount : number,
    isUsed? : boolean,
    buyer? : {
        phoneNumber : string,
        firstName? : string,
        lastName? : string
    }
    user? : {
        phoneNumber : string,
        firstName? : string,
        lastName? : string
    }
}

function useGetUserGiftCards(){
    return useQuery({
        queryKey : ['giftCards'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/user/myGiftCards", {
                            credentials: 'include'});
            const jsonResult = await result.json();
            console.log(jsonResult)
            if(result.ok){
                return jsonResult
            }else{
                throw new Error(jsonResult.error);
            }    
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })
}
export default useGetUserGiftCards;