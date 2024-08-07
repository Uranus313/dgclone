import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const walletSchema  = new mongoose.Schema(
    {
        money: {type: Number , required : true},
        userID: {type : mongoose.Schema.Types.ObjectId,required : true }
    }
);

export const WalletModel = mongoose.model("wallets",walletSchema);

