import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";

const transporterSchema  = new mongoose.Schema(
    {
        password: {type: String , required : true},
        firstName: {type: String , required : true},
        lastName: {type: String , required : true},
        birthDate: {type: Date, required: true},
        email: {type: String , required : true},
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        nationalID: {type: String , required : true},
        pendingOrders : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        deliveredOrders : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]}
    }
);



export const TransporterModel = mongoose.model("transporters",transporterSchema);

export function validateTransporterPost (data){
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(100).required(),
        lastName: Joi.string().min(1).max(100).required(),
        password : Joi.string().min(8).max(50).required(),
        birthDate : Joi.date().required(),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const user = await TransporterModel.find({phoneNumber : phoneNumber}).findOne();
            if(user){
                throw new Error("an account with this phone number already exists");
            }
        }).required(),
        email: Joi.string().email().external( async (email) => {
            const user = await TransporterModel.find({email : email}).findOne();
            if(user){
                throw new Error("an account with this email already exists");
            }
        }).required(),
        nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
            const user = await TransporterModel.find({nationalID : nationalID}).findOne();
            if(user){
                throw new Error("an account with this national ID number already exists");
            }
        }).required(),
    });
    return schema.validateAsync(data);
}



