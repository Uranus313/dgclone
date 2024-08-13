import { NotificationModel } from "../models/notification.js";

export async function saveNotification(notificationCreate){
    const result = {};
    const notification = new NotificationModel(notificationCreate);
    const response = await notification.save();
    result.response = response.toJSON();
    return result;
}

export async function getNotifications(id){
    const result = {};
    if(id === undefined){
        result.response = await NotificationModel.find();
        return result;
    }else{
        result.response = await NotificationModel.find({_id : id}).findOne();
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

