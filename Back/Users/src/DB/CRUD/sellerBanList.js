import { SellerBanListModel } from "../models/sellerBanList.js";
export async function saveBannedSeller(bannedSellerCreate){
    const result = {};
    const bannedSeller = new SellerBanListModel(bannedSellerCreate);
    const response = await bannedSeller.save();
    result.response = response.toJSON();
    return result;
}

export async function getSellerBans(id , search){
    const result = {};
    if(id){
        result.response = await SellerBanListModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else{
        result.response = await SellerBanListModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}
export async function deleteSellerBan(sellerID){
    const result = {};
    result.response = await SellerBanListModel.deleteOne({sellerID : sellerID});
    return result;
}


