import Kavenegar from 'kavenegar';
const api = Kavenegar.KavenegarApi({apikey: process.env.smsKey});
export async function sendSMS({message ,phoneNumber}){
    api.Send({ message: message , sender: "2000500666" , receptor: phoneNumber }, (info,error) =>{
        if(error){
            console.log(error)
            return {error:error}
        }
        if(info){
            return {info:info}
        }
    });
}