import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user.js";
Joi.objectId = joiObjectid(Joi);

const userBanListSchema  = new mongoose.Schema(
    {
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        endDate : {type: Date, required: true}
    }
);

export const UserBanListModel = mongoose.model("userBanLists",userBanListSchema);

export function validateUserBan (data){
    const schema = Joi.object({
        userID : Joi.objectId().external( async (userID) => {
            const user = await UserModel.find({_id : userID}).findOne();
            if(!user){
                throw new Error("user not found")
            }else if (user.isBanned){
                throw new Error("user is already banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}
