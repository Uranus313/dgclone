import { SellerModel } from "../models/seller.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveSeller(sellerCreate){
    const result = {};
    const seller = new SellerModel(sellerCreate);
    const response = await seller.save();
    result.response = response.toJSON();
    return result;
}

export async function getSellers(id){
    const result = {};
    if(id === undefined){
        result.response = await SellerModel.find();
        return result;
    }else{
        result.response = await SellerModel.find({_id : id}).findOne();
        return result;
    }
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
    const passwordCheck = await comparePassword(password , seller.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = seller.toJSON();
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
    return(result);
}

