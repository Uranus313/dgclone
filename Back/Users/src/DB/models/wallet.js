import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user.js";
Joi.objectId = joiObjectid(Joi);

const walletSchema  = new mongoose.Schema(
    {
        money: {type: Number , required : true , default: 0},
        userID: {type : mongoose.Schema.Types.ObjectId,required : true },
        userType : {type : String , enum: ["user" , "seller"],required : true}
    }
);

export const WalletModel = mongoose.model("wallets",walletSchema);


export function validateChangeMoney (data){
    const schema = Joi.object({
        amount: Joi.number().required(),
        userID : Joi.objectId().required(),
        userType : Joi.string().valid("user","seller").required()
    });
    return schema.validateAsync(data);
}

