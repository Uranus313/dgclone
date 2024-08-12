import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user";
import { SellerModel } from "./seller";
Joi.objectId = joiObjectid(Joi);

const transactionSchema  = new mongoose.Schema(
    {
        money: {type: Number , required : true},
        sender:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true},
            type : {type: String,enum: ["digikala" , "user","company","giftCard"], required: true},
            bankAccount : {type: String, required: true , validate: {
                validator : function(value){
                    if(this.method === "bankAccount" && (!value || value.trim() == "")){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "bankAccount needed";
                }
            }},
            senderID : {type: mongoose.Schema.Types.ObjectId, required: true , validate: {
                validator : function(value){
                    if((this.type === "user" || this.type === "company") && (!value || value.trim() == "")){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "id needed";
                }
            }},
            additionalInfo : {type : String}
        }, required : true},
        receiver:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true},
            type : {type: String,enum: ["digikala" , "user","company","giftCard"], required: true},
            bankAccount : {type: String, required: true , validate: {
                validator : function(value){
                    if(this.method === "bankAccount" && (!value || value.trim() == "")){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "bankAccount needed";
                }
            }},
            receiverID : {type: mongoose.Schema.Types.ObjectId, required: true , validate: {
                validator : function(value){
                    if((this.type === "user" || this.type === "company") && (!value || value.trim() == "")){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "id needed";
                }
            }},
            additionalInfo : {type : String}
        }, required : true},
        orderHistoryID: {type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" },
        date : {type: Date, required: true, default : Date.now()}
    }
);
export const TransactionModel = mongoose.model("transactions",transactionSchema);

export function validateTeransactionPost (data){
    const schema = Joi.object({
        money: Joi.number().required(),
        sender: Joi.object({
            method : Joi.string().valid("bankAccount" , "wallet"),
            type : Joi.string().valid("digikala" , "user","company","giftCard"),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
            senderID: Joi.alternatives().conditional('type', [
                { is: 'user', then: Joi.string().external( async (id) => {
                    const result = await UserModel.find({_id : id}).findOne();
                    if(!result){
                        throw new Error("this user does not exist");
                    }
                }).required() },
                { is: 'seller', then: Joi.string().external( async (id) => {
                    const result = await SellerModel.find({_id : id}).findOne();
                    if(!result){
                        throw new Error("this seller does not exist");
                    }
                }).required() },
                { otherwise: Joi.forbidden() }
            ]),
            additionalInfo : Joi.string().max(2000)
        }).required(),
        receiver: Joi.object({
            method : Joi.string().valid("bankAccount" , "wallet"),
            type : Joi.string().valid("digikala" , "user","company","giftCard"),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
            receiverID: Joi.alternatives().conditional('type', [
                { is: 'user', then: Joi.string().external( async (id) => {
                    const result = await UserModel.find({_id : id}).findOne();
                    if(!result){
                        throw new Error("this user does not exist");
                    }
                }).required() },
                { is: 'seller', then: Joi.string().external( async (id) => {
                    const result = await SellerModel.find({_id : id}).findOne();
                    if(!result){
                        throw new Error("this seller does not exist");
                    }
                }).required() },
                { otherwise: Joi.forbidden() }
            ]),
            additionalInfo : Joi.string().max(2000)
        }).required(),
        orderHistoryID : Joi.objectId().email().external( async (id) => {
            const result = await fetch("http://products/orderHistory/"+id);
            const orderHistory = await result.json();
            if(!orderHistory._id){
                throw new Error("this orderhistory does not exist");
            }
        }),
        date : Joi.date()
    });
    return schema.validateAsync(data);
}