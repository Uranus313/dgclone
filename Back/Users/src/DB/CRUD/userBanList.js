import { UserBanListModel } from "../models/userBanList";
export async function saveBannedUser(bannedUserCreate){
    const result = {};
    const bannedUser = new UserBanListModel(bannedUserCreate);
    const response = await bannedUser.save();
    result.response = response.toJSON();
    return result;
}

export async function getBannedUsers(id){
    const result = {};
    if(id === undefined){
        result.response = await UserBanListModel.find();
        return result;
    }else{
        result.response = await UserBanListModel.find({_id : id}).findOne();
        return result;
    }
}
export async function deleteUserBan(id){
    const result = {};
    result.response = await UserBanListModel.deleteOne({_id : id});
    return result;
}


