import { SellerModel } from "../models/seller.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveSeller(sellerCreate){
    const result = {};
    const seller = new SellerModel(sellerCreate);
    const response = await seller.save();
    result.response = response.toJSON();
    return result;
}

export async function getSellers(id , searchParams , idArray ,limit , floor ,nameSearch , sort , desc){
    const result = {};
    let sortOrder = (desc == true || desc == "true")? -1 : 1;

    if(id){
        result.response = await SellerModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        delete result.response.password;

        }
        return result;
        
    }else if(idArray){
        result.response = await SellerModel.find(searchParams);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
            delete result.response[index].password;
        }
        return result;
    }else{
        if(!limit){
            limit = 20;
        }
        let data = null;
        let hasMore = false;
        if(nameSearch && nameSearch != ''){
            data = await SellerModel.find({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } }).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await SellerModel.countDocuments({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } });
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }else{
            data = await SellerModel.find(searchParams).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await SellerModel.countDocuments(searchParams);
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

export async function getSellerCount(searchParams){
    const result = {};
    let count = await SellerModel.estimatedDocumentCount(searchParams);
    result.response = count;
    return result;
}  

export async function logIn(email , phoneNumber , password){
    const result = {};
    let seller = null;
    if (email){
        seller = await SellerModel.find({"storeOwner.email" : email}).findOne();
        if(!seller){
            result.error = "no seller with this email exists";
            return result;
        }
    }else{
        seller = await SellerModel.find({phoneNumber : phoneNumber}).findOne();
        if(!seller){
            result.error = "no seller with this phoneNumber exists";
            return result;
        }
    }
    if(!seller.password){
        result.error = "this seller does not have a password";
        return result;
    }
    const passwordCheck = await comparePassword(password , seller.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = seller.toJSON();
    delete result.response.password;

    return result;
}
export async function deleteSeller(id){
    const result = {};
    result.response = await SellerModel.deleteOne({_id : id});
    return result;
}

export async function updateSeller(id,sellerUpdate ){
    const result = {};
    if(sellerUpdate.password){
        sellerUpdate.password = await hashPassword(sellerUpdate.password);
    }
    const response = await SellerModel.findByIdAndUpdate(id,{$set :sellerUpdate},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}
export async function sellerAddNotification(id,notificationID ){
    const result = {};
    const response = await SellerModel.findByIdAndUpdate(id,{$push :{notifications : notificationID}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}
export async function changeSellerPassword(id,newPassword , oldPassword ){
    const result = {};
    const seller = await SellerModel.find({_id : id}).findOne();
    if (seller.password){
        const answer = await comparePassword(oldPassword,seller.password);
        if(!answer){
            result.error = "wrong password"
            return result;
        }
    }else if (oldPassword){
        result.error = "wrong password"
        return result;
    }
    const hashedPassword = await hashPassword(newPassword);
    const response = await SellerModel.findByIdAndUpdate(id,{$set :{password : hashedPassword}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}