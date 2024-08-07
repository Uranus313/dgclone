import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const banListSchema  = new mongoose.Schema(
    {
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        endDate : {type: Date, required: true}
    }
);

export const BanListModel = mongoose.model("banLists",banListSchema);

