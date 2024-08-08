import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const userBanListSchema  = new mongoose.Schema(
    {
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        endDate : {type: Date, required: true}
    }
);

export const UserBanListModel = mongoose.model("userBanLists",userBanListSchema);

