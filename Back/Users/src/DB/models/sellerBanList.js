import mongoose from "mongoose";
import { SellerModel } from "./seller";
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

export function validateBan (data){
    const schema = Joi.object({
        sellerID : Joi.objectId().external( async (sellerID) => {
            const user = await SellerModel.find({_id : sellerID}).findOne();
            if(!user){
                throw new Error("user not found")
            }else if (user.isBanned){
                throw new Error("user is already banned")    
            }
        })
    });
    return schema.validateAsync(data);
}