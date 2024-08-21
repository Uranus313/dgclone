import { useSession } from "next-auth/react";
async function updateUserSession(user : any){
    const {update} = useSession();
    const result = await update({user : user});
    console.log(result);
    return result;
}
export default updateUserSession;