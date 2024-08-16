import { UserModel } from "../models/user.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveUser(userCreate){
    const result = {};
    const user = new UserModel(userCreate);
    const response = await user.save();
    result.response = response.toJSON();
    return result;
}

export async function getUsers(id , search){
    const result = {};
    if(id){
        result.response = await UserModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else{
        result.response = await UserModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function logIn(email , phoneNumber , password){
    const result = {};
    let user = null;
    if (email){
        user = await UserModel.find({email : email}).findOne();
        if(!user){
            result.error = "no user with this email exists";
            return result;
        }
    }else{
        user = await UserModel.find({phoneNumber : phoneNumber}).findOne();
        if(!user){
            result.error = "no user with this phoneNumber exists";
            return result;
        }
    }
    if(!user.password){
        result.error = "this user does not have a password";
        return result;
    }
    const passwordCheck = await comparePassword(password , user.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = user.toJSON();
    return result;
}
export async function deleteUser(id){
    const result = {};
    result.response = await UserModel.deleteOne({_id : id});
    return result;
}

export async function updateUser(id,userUpdate ){
    const result = {};
    if(userUpdate.password){
        userUpdate.password = await hashPassword(userUpdate.password);
    }
    const response = await UserModel.findByIdAndUpdate(id,{$set :userUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

