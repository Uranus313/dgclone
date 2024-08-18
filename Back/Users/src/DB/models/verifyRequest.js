import mongoose from "mongoose";
import Joi, { required } from "joi";
import joiObjectid from "joi-objectid";
import { SellerModel } from "./seller.js";
import { UserModel } from "./user.js";
Joi.objectId = joiObjectid(Joi);

const verifyRequestSchema  = new mongoose.Schema(
    {
        sellerID : {type : mongoose.Schema.Types.ObjectId , ref: "sellers" , required : true },
        adminID: {type : mongoose.Schema.Types.ObjectId , ref: "admins" },
        requestDate : {type: Date, required: true, default : Date.now()},
        state : {type: String,enum: ["pending", "accepted", "rejected"], required: true , default : "pending"}
    }
);

export const VerifyRequestModel = mongoose.model("verifyRequests",verifyRequestSchema);

export function validateVerifyRequestAnswer (notification){
    const schema = Joi.object({
        state: Joi.string().valid("accepted", "rejected").required(),
        requestID : Joi.objectId().external( async (data) => {
            if(!data){
                return
            }
            const request = await VerifyRequestModel.find({_id : data}).findOne();
            if(!request){
                throw new Error("verify request not found")
            }
            if(request.state != "pending"){
                throw new Error("verify request is already answered")
            }
        }).required()
    })
    return schema.validateAsync(notification);
}

