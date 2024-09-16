import { UserModel } from "../models/user.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveUser(userCreate){
    const result = {};
    const user = new UserModel(userCreate);
    const response = await user.save();
    result.response = response.toJSON();
    return result;
}

export async function getUsers(id , searchParams,limit , floor ,nameSearch){
    const result = {};
    if(id){
        result.response = await UserModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
            delete result.response.password;
        }
        return result;
    }else{
        let data = null;
        let hasMore = false;
        if(nameSearch && nameSearch != ''){
            data = await UserModel.find({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } }).skip(floor).limit(limit);
            let count = await UserModel.countDocuments({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } });
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }else{
            data = await UserModel.find(searchParams).skip(floor).limit(limit);
            let count = await UserModel.countDocuments();
            // console.log(count);
            // console.log(limit+floor);
            
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }
        for (let index = 0; index < data.length; index++) {
            data[index] = data[index].toJSON();
            delete data[index].password;
        }
        result.response = {
            data: data,
            hasMore: hasMore
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
    delete result.response.password;
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
    delete result.response.password;
    return(result);
}
export async function addBoughtGiftCard(id,giftCardID ){
    const result = {};
    const response = await UserModel.findByIdAndUpdate(id,{$push :{boughtGiftCards : giftCardID}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}
export async function addNotification(id,notificationID ){
    const result = {};
    const response = await UserModel.findByIdAndUpdate(id,{$push :{notifications : notificationID}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}
export async function addreceivedGiftCard(id,giftCardID ){
    const result = {};
    const response = await UserModel.findByIdAndUpdate(id,{$push :{receivedGiftCards : giftCardID}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}
export async function changeUserPassword(id,newPassword , oldPassword ){
    const result = {};
    const user = await UserModel.find({_id : id}).findOne();
    if (user.password){
        const answer = await comparePassword(oldPassword,user.password);
        if(!answer){
            result.error = "wrong password"
            return result;
        }
    }else if (oldPassword){
        result.error = "wrong password"
        return result;
    }
    const hashedPassword = await hashPassword(newPassword);
    const response = await UserModel.findByIdAndUpdate(id,{$set :{password : hashedPassword}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}

