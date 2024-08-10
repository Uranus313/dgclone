import mongoose from "mongoose";
// import Joi from "joi";
// import joiObjectid from "joi-objectid";
// Joi.objectId = joiObjectid(Joi);

const sellerSchema  = new mongoose.Schema(
    {

        password: {type: String , required : true},
        storeOwner: { 
            type:{
                firstName: {type: String , required : true},
                lastName: {type: String , required : true},
                birthDate: {type: Date, required: true},
                email: {type: String , required : true},
                nationalID: {type: String , required : true}
            },
            required: true},
        // financialInfo:{

        // }    
        isCompelete: Boolean,
        phoneNumber: {type: String , required : true},
        entityType: {type: String,enum: ["individual" , "legal"], required: true,
            validate: {
                validator : function(value){
                    if(value === "individual" && (!this.individualInfo)){
                        return false;
                    }else if(value === "legal" && (!this.legalInfo)){
                        return false;
                    }
                    return true;
                },
                message : (props) => {
                    return "entity details needed";
                }
            }
        },
        legalInfo:{ 
            type:{
                companyName : {type: String , required : true},
                companyType : {type: String, enum: ["publicCompany" , "privateCompany" , "limitedLiability" , "cooperative" , "jointLiability" , "institution" , "other"], required: true},
                companyIDNumber : {type: String , required : true},
                companyEconomicNumber : {type: String , required : true},
                shabaNumber : {type: String , required : true},
                signOwners : {type: [String] , required : true },
                storeName : {type: String}
            }
        },
        additionalDocuments: {type: [String]},
        individualInfo:{ 
            type: {
                nationalID : {type: String , required : true},
                bankNumberType : {type: String,enum: ["shaba" , "bank"], required: true,
                    validate: {
                        validator : function(value){
                            if(value === "shaba" && (!this.shabaNumber)){
                                return false;
                            }else if(value === "bank" && (!this.bankNumber)){
                                return false;
                            }
                            return true;
                        },
                        message : (props) => {
                            return "bank/shaba number details needed";
                        }
                    }
                },
                shabaNumber : {type: String },
                bankNumber : {type: String}
            }   
        },
        storeInfo: {
            type:{
                commercialName : {type: String , required : true},
                officePhoneNumber : {type: String , required : true},
                workDays : {type: [String] , required : true},
                logo : {type: String , required : true},
                sellerCode : {type: String , required : true},
                aboutSeller : {type: String},
                sellerWebsite : {type: String},
                offDays : {type: [String]}
            },
            required: true
        },
        walletID: {type : mongoose.Schema.Types.ObjectId , ref: "jobs" },
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
        storeAddress:{type:{
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
        warehouseAddress:{type:{
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
        productList : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "products" }]},
        saleHistory : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        // orderHistories :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orderHistories" }]},
        socialInteractions :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "comments" }]},
        // wishLists :  { type :[{title : {type: String, required: true},products:[{type : mongoose.Schema.Types.ObjectId , ref: "products"}] }]},
        notifications :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "notifications" }]},
        lastVisited :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "products" }]},
        // shoppingCart :  { type :[{type : mongoose.Schema.Types.ObjectId , ref: "orders" }]},
        transactionHistory : { type :[{type : mongoose.Schema.Types.ObjectId , ref: "transactions" }]}
    }
);

export const SellerModel = mongoose.model("sellers",sellerSchema);

