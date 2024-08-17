import { TransporterModel } from "../models/transporter.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveTransporter(transporterCreate){
    const result = {};
    const transporter = new TransporterModel(transporterCreate);
    const response = await transporter.save();
    result.response = response.toJSON();
    return result;
}

export async function getTransporters(id , search){
    const result = {};
    if(id){
        result.response = await TransporterModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else{
        result.response = await TransporterModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
            delete result.response[index].password;
        }
        return result;
    }
}

export async function logIn(email , phoneNumber , password){
    const result = {};
    let transporter = null;
    if (email){
        transporter = await TransporterModel.find({email : email}).findOne();
        if(!transporter){
            result.error = "no transporter with this email exists";
            return result;
        }
    }else{
        transporter = await TransporterModel.find({phoneNumber : phoneNumber}).findOne();
        if(!transporter){
            result.error = "no transporter with this phoneNumber exists";
            return result;
        }
    }
    const passwordCheck = await comparePassword(password , transporter.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = transporter.toJSON();
    return result;
}
export async function deleteTransporter(id){
    const result = {};
    result.response = await TransporterModel.deleteOne({_id : id});
    return result;
}

export async function updateTransporter(id,transporterUpdate ){
    const result = {};
    if(transporterUpdate.password){
        transporterUpdate.password = await hashPassword(transporterUpdate.password);
    }
    const response = await TransporterModel.findByIdAndUpdate(id,{$set :transporterUpdate},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}

