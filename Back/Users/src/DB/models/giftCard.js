import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user";
Joi.objectId = joiObjectid(Joi);

const giftCardSchema  = new mongoose.Schema(
    {
        buyerID : {type : mongoose.Schema.Types.ObjectId , ref: "sellers",required: true },
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        code : {type : String , required : true},
        isUsed : Boolean,
        useDate : {type: Date},
        amount :{type : Number},
        buyDate : {type: Date , required : true, default : Date.now()}
    }
);

export const GiftCardModel = mongoose.model("giftCards",giftCardSchema);

export function validateGiftCardPost (data){
    const schema = Joi.object({
        buyerID: Joi.objectId().external( async (userID) => {
            const user = await UserModel.find({_id : userID}).findOne();
            if(!user){
                throw new Error("no user found with this ID");
            }
        }).required(),
        // code : Joi.string().length(16).required(),
        amount : Joi.number().required(),
        buyDate : Joi.date()
    });
    return schema.validateAsync(data);
}

export function validateGiftCardUse (data){
    const schema = Joi.object({
        code : Joi.string().length(16).required()
    });
    return schema.validateAsync(data);
}






