import { AdminModel } from "../models/admin.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveAdmin(adminCreate){
    const result = {};
    const admin = new AdminModel(adminCreate);
    const response = await admin.save();
    result.response = response.toJSON();
    return result;
}

export async function getAdmins(id){
    const result = {};
    if(id === undefined){
        result.response = await AdminModel.find();
        return result;
    }else{
        result.response = await AdminModel.find({_id : id}).findOne();
        return result;
    }
}

export async function logIn(email , phoneNumber , password){
    const result = {};
    let admin = null;
    if (email){
        admin = await AdminModel.find({email : email}).findOne();
        if(!admin){
            result.error = "no admin with this email exists";
            return result;
        }
    }else{
        admin = await AdminModel.find({phoneNumber : phoneNumber}).findOne();
        if(!admin){
            result.error = "no admin with this phoneNumber exists";
            return result;
        }
    }
    const passwordCheck = await comparePassword(password , admin.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = admin.toJSON();
    return result;
}
export async function deleteAdmin(id){
    const result = {};
    result.response = await AdminModel.deleteOne({_id : id});
    return result;
}

export async function updateAdmin(id,adminUpdate ){
    const result = {};
    if(adminUpdate.password){
        adminUpdate.password = await hashPassword(adminUpdate.password);
    }
    const response = await AdminModel.findByIdAndUpdate(id,{$set :adminUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

