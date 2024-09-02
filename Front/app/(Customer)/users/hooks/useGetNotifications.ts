import { useQuery } from "@tanstack/react-query";
export interface Notification{
    _id: string,
    content:string,
    title:string,
    teaser:string,
    imageUrl? : string,
    orderID? : string,
    isSeen? : boolean,
    date : string,
    type : string
}
function useGetUserNotifications(){
    
    return useQuery({
        queryKey : ['notifications'],
        queryFn : async () => {
            const result = await fetch("http://localhost:3005/users/user/myNotifications", {
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
export default useGetUserNotifications;