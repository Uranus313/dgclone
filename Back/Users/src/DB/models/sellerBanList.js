import mongoose from "mongoose";
import { SellerModel } from "./seller.js";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const sellerBanListSchema  = new mongoose.Schema(
    {
        sellerID: {type : mongoose.Schema.Types.ObjectId , ref: "sellers" },
        endDate : {type: Date, required: true}
    }
);

export const SellerBanListModel = mongoose.model("sellerBanLists",sellerBanListSchema);

export function validateSellerBan (data){
    const schema = Joi.object({
        sellerID : Joi.objectId().external( async (sellerID) => {
            const seller = await SellerModel.find({_id : sellerID}).findOne();
            if(!seller){
                throw new Error("seller not found")
            }else if (seller.isBanned){
                throw new Error("seller is already banned")    
            }
        }).required()
    });
    return schema.validateAsync(data);
}