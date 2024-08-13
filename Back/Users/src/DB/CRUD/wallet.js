import { WalletModel } from "../models/wallet";
export async function saveWallet(walletCreate){
    const result = {};
    const wallet = new WalletModel(walletCreate);
    const response = await wallet.save();
    result.response = response.toJSON();
    return result;
}

export async function getWallets(id){
    const result = {};
    if(id === undefined){
        result.response = await WalletModel.find();
        return result;
    }else{
        result.response = await WalletModel.find({_id : id}).findOne();
        return result;
    }
}


export async function updateWallet(id,walletUpdate ){
    const result = {};
    const response = await WalletModel.findByIdAndUpdate(id,{$set :walletUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

