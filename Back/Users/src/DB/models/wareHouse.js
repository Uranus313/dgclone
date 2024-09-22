import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user.js";
import { SellerModel } from "./seller.js";
Joi.objectId = joiObjectid(Joi);

const wareHouseSchema  = new mongoose.Schema(
    {
            province: {type: String},
            city: {type: String},
            postalCode : {type: String},
            additionalInfo : {type: String},
            openTime : {type: String},
            number : {type: String},
            unit : {type: String},
            coordinates : {type:{
                x : {type: String, required : true},
                y : {type: String, required : true}
            } , required: true},
    }
        
);
export const WareHouseModel = mongoose.model("wareHouses",wareHouseSchema);

export function validateWareHousePost (data){
    const schema = Joi.object({
            province: Joi.string(),
            city: Joi.string(),
            postalCode : Joi.string(),
            number : Joi.string() ,
            unit : Joi.string(),
            additionalInfo : Joi.string(),
            openTime : Joi.string(),
            coordinates : Joi.object({
                    x : Joi.string().required(),
                    y : Joi.string().required()
                }
            ).required(),
    });
    return schema.validateAsync(data);
}