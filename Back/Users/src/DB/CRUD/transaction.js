import { TransactionModel } from "../models/transaction.js";

export async function saveTransaction(transactionCreate){
    const result = {};
    const transaction = new TransactionModel(transactionCreate);
    const response = await transaction.save();
    result.response = response.toJSON();
    return result;
}

export async function getTransactions(id){
    const result = {};
    if(id === undefined){
        result.response = await TransactionModel.find();
        return result;
    }else{
        result.response = await TransactionModel.find({_id : id}).findOne();
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

