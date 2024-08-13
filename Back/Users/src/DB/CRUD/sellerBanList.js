import { SellerBanListModel } from "../models/sellerBanList";
export async function saveBannedSeller(bannedSellerCreate){
    const result = {};
    const bannedSeller = new SellerBanListModel(bannedSellerCreate);
    const response = await bannedSeller.save();
    result.response = response.toJSON();
    return result;
}

export async function getBannedSellers(sellerID){
    const result = {};
    if(sellerID === undefined){
        result.response = await SellerBanListModel.find();
        return result;
    }else{
        result.response = await SellerBanListModel.find({sellerID : sellerID}).findOne();
        return result;
    }
}
export async function deleteSellerBan(sellerID){
    const result = {};
    result.response = await SellerBanListModel.deleteOne({sellerID : sellerID});
    return result;
}


