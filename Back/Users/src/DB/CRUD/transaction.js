import { TransactionModel } from "../models/transaction.js";

export async function saveTransaction(transactionCreate){
    const result = {};
    const transaction = new TransactionModel(transactionCreate);
    const response = await transaction.save();
    result.response = response.toJSON();
    return result;
}

export async function getAllUserTransactions(userID ,userType ){
    const result = {};
    result.response = await TransactionModel.find({$or : [
        {"sender.senderID" : userID, "entity.entityType" : userType},
        {"receiver.receiverID" : userID , "entity.entityType" : userType}
    ]}).sort({date : -1});
    return result;
}

export async function getTransactions(id , searchParams ,limit , floor ,sort , desc ){
    const result = {};
    let sortOrder = desc? -1 : 1;
    if(id){
        result.response = await TransactionModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        delete result.response.password;

        }
        return result;
    }else{
        if(!limit){
            limit = 20;
        }
        let data = null;
        let hasMore = false;

            data = await TransactionModel.find(searchParams).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await TransactionModel.countDocuments(searchParams);
            // console.log(count);
            // console.log(limit+floor);
            
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        
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

export async function getTransactionCount(searchParams){
    const result = {};
    let count = await TransactionModel.estimatedDocumentCount(searchParams);
    result.response = count;
    return result;
}  

export async function deleteTransaction(id){
    const result = {};
    result.response = await TransactionModel.deleteOne({_id : id});
    return result;
}

export async function updateTransaction(id,transactionUpdate ){
    const result = {};
    const response = await TransactionModel.findByIdAndUpdate(id,{$set :transactionUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

