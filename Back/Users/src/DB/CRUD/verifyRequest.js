import { VerifyRequestModel } from "../models/verifyRequest";


export async function saveVerifyRequest(verifyRequestCreate){
    const result = {};
    const verifyRequest = new VerifyRequestModel(verifyRequestCreate);
    const response = await verifyRequest.save();
    result.response = response.toJSON();
    return result;
}

export async function getVerifyRequests(id , searchParams, idArray,limit , floor ){
    const result = {};
    if(id){
        result.response = await VerifyRequestModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else if(idArray){
        result.response = await VerifyRequestModel.find(searchParams);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }else{
        const data = await VerifyRequestModel.find(searchParams).skip(floor).limit(limit);
        let count = await VerifyRequestModel.countDocuments(searchParams);
            // console.log(count);
            // console.log(limit+floor);
            
        hasMore = count > (Number(limit) + Number(floor));
        console.log(hasMore)
        
        for (let index = 0; index < data.length; index++) {
            data[index] = data[index].toJSON();
            // delete data[index].password;
        }
        result.response = {
            data: data,
            hasMore: hasMore
        }
        return result;
    }
}

export async function deleteVerifyRequest(id){
    const result = {};
    result.response = await VerifyRequestModel.deleteOne({_id : id});
    return result;
}

export async function updateVerifyRequest(id,sellerID,verifyRequestUpdate ){
    const result = {};
    if(id){
        const response = await VerifyRequestModel.findByIdAndUpdate(id,{$set :verifyRequestUpdate},{new : true});
        result.response = response.toJSON();
        return(result);
    }else if(sellerID){
        const requests = await VerifyRequestModel.find({sellerID : sellerID, state: "pending"});
        for (let index = 0; index < requests.length; index++) {
            requests[index].state = verifyRequestUpdate.state;
            requests[index].save();
        }
        return true
    }
    
}

