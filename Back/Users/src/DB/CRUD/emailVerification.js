import { EmailVerificationModel } from "../models/emailVerification.js";

export async function saveEmailVerification(emailVerificationCreate){
    const result = {};
    const emailVerification = new EmailVerificationModel(emailVerificationCreate);
    const response = await emailVerification.save();
    result.response = response.toJSON();
    return result;
}

export async function getEmailVerifications(id , email){
    const result = {};
    if(id){
        result.response = await EmailVerificationModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else if (email){
        result.response = await EmailVerificationModel.find({email: email}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }
}

export async function deleteEmailVerification(id,email){
    const result = {};
    if(id){
        result.response = await EmailVerificationModel.deleteOne({_id : id});

    }else if (email){
        result.response = await EmailVerificationModel.deleteOne({email: email});

    }
    return result;
}



