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
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
    }else{
        result.response = await UserBanListModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}
export async function deleteUserBan(id){
    const result = {};
    result.response = await UserBanListModel.deleteOne({_id : id});
    return result;
}


