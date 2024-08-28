import { NotificationModel } from "../models/notification.js";

export async function saveNotification(notificationCreate){
    const result = {};
    const notification = new NotificationModel(notificationCreate);
    const response = await notification.save();
    result.response = response.toJSON();
    return result;
}

export async function getNotifications(id , search, idArray){
    const result = {};
    if(id){
        result.response = await NotificationModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else if(idArray){
        result.response = await NotificationModel.find({_id :{ $in: idArray}});
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }else{
        result.response = await NotificationModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function deleteNotification(id){
    const result = {};
    result.response = await NotificationModel.deleteOne({_id : id});
    return result;
}

export async function updateNotification(id,notificationUpdate ){
    const result = {};
    const response = await NotificationModel.findByIdAndUpdate(id,{$set :notificationUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

