import { VerifyRequestModel } from "../models/verifyRequest";


export async function saveVerifyRequest(verifyRequestCreate){
    const result = {};
    const verifyRequest = new VerifyRequestModel(verifyRequestCreate);
    const response = await verifyRequest.save();
    result.response = response.toJSON();
    return result;
}

export async function getVerifyRequests(id , search, idArray){
    const result = {};
    if(id){
        result.response = await VerifyRequestModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else if(idArray){
        result.response = await VerifyRequestModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }else{
        result.response = await VerifyRequestModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function deleteVerifyRequest(id){
    const result = {};
    result.response = await VerifyRequestModel.deleteOne({_id : id});
    return result;
}

export async function updateVerifyRequest(id,verifyRequestUpdate ){
    const result = {};
    const response = await VerifyRequestModel.findByIdAndUpdate(id,{$set :verifyRequestUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

