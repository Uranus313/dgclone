import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { SellerModel } from "./seller.js";
import { UserModel } from "./user.js";
Joi.objectId = joiObjectid(Joi);

const tokenSchema  = new mongoose.Schema(
    {
        content: {type: String , required : true},
        title: {type: String , required : true},
        orderID: {type : mongoose.Schema.Types.ObjectId },
        sellerID : {type : mongoose.Schema.Types.ObjectId , ref: "sellers" },
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        employeeID : {type : mongoose.Schema.Types.ObjectId , ref: "employees" },
        adminID: {type : mongoose.Schema.Types.ObjectId , ref: "admins" },
        isSeen : Boolean,
        date : {type: Date, required: true, default : Date.now()},
        importance : {type: String,enum: ["low" , "medium","high"], required: true}
    }
);

export const TicketModel = mongoose.model("tokens",tokenSchema);


export function validateTicketPost (notification){
    const schema = Joi.object({
        content: Joi.string().min(1).max(2000).required(),
        title: Joi.string().min(1).max(100).required(),
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
        importance : Joi.string().valid("low" , "medium","high").required()
    })
    return schema.validateAsync(notification);
}

