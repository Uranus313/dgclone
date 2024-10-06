import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
import { UserModel } from "./user.js";
import { SellerModel } from "./seller.js";
Joi.objectId = joiObjectid(Joi);

const transactionSchema  = new mongoose.Schema(
    {
        money: {type: Number , required : true},
        title: {type: String , required : true},
        sender:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true, validate:{
                validator : function(value){
                    if(value === "bankAccount" && (!this.bankAccount)){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "bankAccount needed";
                }
            }},
            entityType : {type: String,enum: ["digikala" , "user","seller","giftCard"], required: true, validate: {
                validator : function(value){
                    if((value === "user" || value === "seller") && (!this.senderID)){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "id needed";
                }
            }},
            bankAccount : {type: String},
            senderID : {type: mongoose.Schema.Types.ObjectId },
            additionalInfo : {type : String}
        }},
        receiver:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true, validate:{
                validator : function(value){
                    if(value === "bankAccount" && (!this.bankAccount)){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "bankAccount needed";
                }
            }},
            entityType : {type: String,enum: ["digikala" , "user","seller","giftCard"], required: true, validate: {
                validator : function(value){
                    if((value === "user" || value === "seller") && (!this.receiverID)){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "id needed";
                }
            }},
            bankAccount : {type: String},
            receiverID : {type: mongoose.Schema.Types.ObjectId },
            additionalInfo : {type : String}
        },required : true },
        orderHistoryID: {type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" },
        date : {type: Date, required: true, default : Date.now()}
    }
);
export const TransactionModel = mongoose.model("transactions",transactionSchema);

export function validateTeransactionPost (data){
    const schema = Joi.object({
        money: Joi.number().required(),
        money: Joi.string().required(),
        sender: Joi.object({
            method : Joi.string().valid("bankAccount" , "wallet"),
            entityType : Joi.string().valid("digikala" , "user","company","giftCard"),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
            senderID: Joi.alternatives().conditional('entityType', [
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
            entityType : Joi.string().valid("digikala" , "user","company","giftCard"),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
            receiverID: Joi.alternatives().conditional('entityType', [
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
            if(!id){
                return
            }
            const result = await fetch(productURL+"/orderHistory/"+id, {
                method: "GET",
                headers: {
                    "inner-secret": process.env.innerSecret
                }});
            const orderHistory = await result.json();
            if(!orderHistory._id){
                throw new Error("this orderhistory does not exist");
            }
        }),
        date : Joi.date()
    });
    return schema.validateAsync(data);
}