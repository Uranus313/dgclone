import { UserBanListModel } from "../models/userBanList.js";
export async function saveBannedUser(bannedUserCreate){
    const result = {};
    const bannedUser = new UserBanListModel(bannedUserCreate);
    const response = await bannedUser.save();
    result.response = response.toJSON();
    return result;
}

export async function getUserBans(id , search){
    const result = {};
    if(id){
        result.response = await UserBanListModel.find({_id : id}).findOne();
        return result;
        
    }else{
        result.response = await UserBanListModel.find(search);
        return result;
    }
}
export async function deleteUserBan(id){
    const result = {};
    result.response = await UserBanListModel.deleteOne({_id : id});
    return result;
}


