import { TransactionModel } from "../models/transaction.js";

export async function saveTransaction(transactionCreate){
    const result = {};
    const transaction = new TransactionModel(transactionCreate);
    const response = await transaction.save();
    result.response = response.toJSON();
    return result;
}

export async function getAllUserTransactions(userID ){
    const result = {};
    result.response = await TransactionModel.find({$or : [
        {"sender.senderID" : userID},
        {"receiver.receiverID" : userID}
    ]}).sort({date : -1});
    return result;
}

export async function getTransactions(id , search){
    const result = {};
    if(id){
        result.response = await TransactionModel.find({_id : id}).findOne();
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

