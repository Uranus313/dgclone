import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const userSchema  = new mongoose.Schema(
    {

        password: {type: String , required : true},
        firstName: {type: String , required : true},
        lastName: {type: String , required : true},
        birthDate: {type: Date, required: true},
        email: {type: String , required : true},
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        walletID: {type : mongoose.Schema.Types.ObjectId , ref: "jobs" },
        isBanned : Boolean,
        nationalID: {type: String , required : true},
        moneyReturn:{type : {
            method : {type: String,enum: ["bankAccount" , "wallet"], required: true , default : "wallet"},
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
            }}
        }, required : true , default : {
            method : "wallet"
        }},
        address:{type:{
            country: {type: String , required : true},
            province: {type: String, required : true},
            city: {type: String, required : true},
            postalCode : {type: String, required : true},
            additionalInfo : {type: String, required : true},
            coordinates : {type:{
                x : {type: String, required : true},
                y : {type: String, required : true}
            } , required: true}
        }, required : true},
        orderHistories :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" }]},
        socialInteractions :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "comments" }]},
        wishLists :  { type :[{title : {type: String, required: true},products:[{type : mongoose.Schema.Types.ObjectId , ref: "products"}] }]},
        notifications :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "notifications" }]},
        lastVisited :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "products" }]},
        shoppingCart :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        transactionHistory : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "transactions" }]}
    }
);

export const UserModel = mongoose.model("users",userSchema);

