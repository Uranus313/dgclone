import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const notificationSchema  = new mongoose.Schema(
    {
        content: {type: String , required : true},
        userEmail: {type: String , required : true},
        userPhone: {type: String , required : true},
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
        isSeen : Boolean,
        date : {type: Date, required: true, default : Date.now()},
        type : {type: String,enum: ["information" , "order","suggestion"], required: true}
    }
);

export const NotificationModel = mongoose.model("notifications",notificationSchema);

