import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { SellerModel } from "./seller.js";
import { UserModel } from "./user.js";
Joi.objectId = joiObjectid(Joi);

const notificationSchema  = new mongoose.Schema(
    {
        content: {type: String , required : true},
        userEmail: {type: String },
        userPhone: {type: String , required : true},
        userType: {type: String , enum : ["seller","user"], required : true, validate:{
            validator : function(value){
                if(value === "seller" && (!this.sellerID)){
                    return false;
                }else if(value === "user" && (!this.userID)){
                    return false;
                }
                return true;
            },
            message : (props) => {
                return "entity details needed";
            }
        }},
        sellerID : {type : mongoose.Schema.Types.ObjectId , ref: "sellers" },
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        isSeen : Boolean,
        date : {type: Date, required: true, default : Date.now()},
        type : {type: String,enum: ["information" , "order","suggestion"], required: true}
    }
);

export const NotificationModel = mongoose.model("notifications",notificationSchema);

export function validateNotificationPost (notification){
    const schema = Joi.object({
        content: Joi.string().min(1).max(2000).required(),
        userEmail : Joi.string().email(),
        userPhone : Joi.string().required(),
        userType : Joi.string().valid("seller" , "user").required().custom((value , helpers) => {
            if(value.userType == "seller" && !value.sellerID){
                return helpers.error("seller ID needed");
            }
            if(value.userType == "user" && !value.userID){
                return helpers.error("user ID needed");
            }
            return value;
        },"you should provide seller/user ID"),
        sellerID : Joi.objectId().external( async (data) => {
            if(!data){
                return
            }
            const seller = await SellerModel.find({_id : data}).findOne();
            if(!seller){
                throw new Error("seller not found")
            }
        }),
        userID : Joi.objectId().external( async (data) => {
            if(!data){
                return
            }
            const user = await UserModel.find({_id : data}).findOne();
            if(!user){
                throw new Error("user not found")
            }
        }),
        date : Joi.date(),
        type : Joi.string().valid("information" , "order","suggestion").required()
    })
    return schema.validateAsync(notification);
}

