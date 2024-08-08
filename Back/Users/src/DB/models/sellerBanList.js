import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const sellerBanListSchema  = new mongoose.Schema(
    {
        sellerID: {type : mongoose.Schema.Types.ObjectId , ref: "sellers" },
        endDate : {type: Date, required: true}
    }
);

export const SellerBanListModel = mongoose.model("sellerBanLists",sellerBanListSchema);

