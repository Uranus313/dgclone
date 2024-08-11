import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";

const giftCardSchema  = new mongoose.Schema(
    {
        buyerID : {type : mongoose.Schema.Types.ObjectId , ref: "sellers",required: true },
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        code : {type : String , required : true},
        isUsed : Boolean,
        usedDate : {type: Date},
        amount :{type : Number}
    }
);

export const GiftCardModel = mongoose.model("giftCards",giftCardSchema);


