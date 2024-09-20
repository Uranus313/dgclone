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

export async function getAdmins(id , searchParams ,limit , floor ,nameSearch,sort , desc ){
    const result = {};
    let sortOrder = desc? -1 : 1;
    if(id){
        result.response = await AdminModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        delete result.response.password;

        }
        return result;
    }else{
        let data = null;
        let hasMore = false;
        if(nameSearch && nameSearch != ''){
            data = await AdminModel.find({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } }).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await AdminModel.countDocuments({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } });
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }else{
            data = await AdminModel.find(searchParams).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await AdminModel.countDocuments(searchParams);
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
    delete result.response.password;

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

export async function changeAdminPassword(id,newPassword , oldPassword ){
    const result = {};
    const admin = await AdminModel.find({_id : id}).findOne();
    if (admin.password){
        const answer = await comparePassword(oldPassword,admin.password);
        if(!answer){
            result.error = "wrong password"
            return result;
        }
    }else if (oldPassword){
        result.error = "wrong password"
        return result;
    }
    const hashedPassword = await hashPassword(newPassword);
    const response = await AdminModel.findByIdAndUpdate(id,{$set :{password : hashedPassword}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}