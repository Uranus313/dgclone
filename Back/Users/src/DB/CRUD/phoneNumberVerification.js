import { PhoneNumberVerificationModel } from "../models/phoneNumberVerification.js";

export async function savePhoneNumberVerification(phoneNumberVerificationCreate){
    const result = {};
    const phoneNumberVerification = new PhoneNumberVerificationModel(phoneNumberVerificationCreate);
    const response = await phoneNumberVerification.save();
    result.response = response.toJSON();
    return result;
}

export async function getPhoneNumberVerifications(id , phoneNumber){
    const result = {};
    if(id){
        result.response = await PhoneNumberVerificationModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else if (phoneNumber){
        result.response = await PhoneNumberVerificationModel.find({phoneNumber: phoneNumber}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }
}

export async function deletePhoneNumberVerification(id,phoneNumber){
    const result = {};
    if(id){
        result.response = await PhoneNumberVerificationModel.deleteOne({_id : id});

    }else if (phoneNumber){
        result.response = await PhoneNumberVerificationModel.deleteOne({phoneNumber: phoneNumber});

    }
    return result;
}



