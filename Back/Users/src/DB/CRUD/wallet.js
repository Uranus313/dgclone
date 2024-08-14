import { WalletModel } from "../models/wallet.js";
export async function saveWallet(walletCreate){
    const result = {};
    const wallet = new WalletModel(walletCreate);
    const response = await wallet.save();
    result.response = response.toJSON();
    return result;
}


export async function getWallets(id , search){
    const result = {};
    if(id){
        result.response = await WalletModel.find({_id : id}).findOne();
        return result;
    }else{
        result.response = await WalletModel.find(search);
        return result;
    }
}

export async function updateWallet(id,walletUpdate ){
    const result = {};
    const response = await WalletModel.findByIdAndUpdate(id,{$set :walletUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}
export async function changeWalletMoney(id,amount ){
    const result = {};
    const response = await WalletModel.findByIdAndUpdate(id,{$inc :{amount : amount}},{new : true});
    result.response = response.toJSON();
    return(result);
}


