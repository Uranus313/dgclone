import { AdminModel } from "../models/admin.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveAdmin(adminCreate){
    const result = {};
    adminCreate.password = await hashPassword(adminCreate.password);
    const admin = new AdminModel(adminCreate);
    const response = await admin.save();
    result.response = response.toJSON();
    return result;
}

export async function getAdmins(id , search){
    const result = {};
    if(id){
        result.response = await AdminModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else{
        result.response = await AdminModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
            delete result.response[index].password;
        }
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
    delete result.response.password;
    return(result);
}

