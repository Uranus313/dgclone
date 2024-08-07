import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

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
        userID: {type : mongoose.Schema.Types.ObjectId , ref: "users" },
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

