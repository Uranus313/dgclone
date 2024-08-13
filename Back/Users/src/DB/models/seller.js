import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

const sellerSchema  = new mongoose.Schema(
    {
        password: {type: String , required : true},
        isBanned : Boolean,
        storeOwner: { 
            type:{
                firstName: {type: String , required : true},
                lastName: {type: String , required : true},
                birthDate: {type: Date, required: true},
                email: {type: String , required : true},
                nationalID: {type: String , required : true}
            }},  
        isCompelete: Boolean,
        isVerified: Boolean,
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
            }
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
            additionalInfo : {type: String},
            coordinates : {type:{
                x : {type: String, required : true},
                y : {type: String, required : true}
            } , required: true}
        }},
        warehouseAddress:{type:{
            country: {type: String , required : true},
            province: {type: String, required : true},
            city: {type: String, required : true},
            postalCode : {type: String, required : true},
            additionalInfo : {type: String},
            coordinates : {type:{
                x : {type: String, required : true},
                y : {type: String, required : true}
            } , required: true}
        }},
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

export function validateSellerPost (data){
    const schema = Joi.object({
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const seller = await SellerModel.find({phoneNumber : phoneNumber}).findOne();
            if(seller){
                throw new Error("an account with this phone number already exists");
            }
        }).required()
    });
    return schema.validateAsync(data);
}


export function validateSellerChangeinfo (data){
    const schema = Joi.object({
        password: Joi.string().min(8).max(50),
        phoneNumber : Joi.string().min(11).max(12).external( async (phoneNumber) => {
            const seller = await SellerModel.find({phoneNumber : phoneNumber}).findOne();
            if(seller){
                throw new Error("an account with this phone number already exists");
            }
        }),
        storeOwner: Joi.object({
            firstName: Joi.string().min(1).max(100).required(),
            lastName: Joi.string().min(1).max(100).required(),
            birthDate : Joi.date().required(),
            email: Joi.string().email().external( async (email) => {
                const seller = await SellerModel.find({email : email}).findOne();
                if(seller){
                    throw new Error("an account with this email already exists");
                }
            }).required(),
            nationalID: Joi.string().length(10).pattern(/^\d+$/).external( async (nationalID) => {
                const seller = await SellerModel.find({nationalID : nationalID}).findOne();
                if(seller){
                    throw new Error("an account with this national ID number already exists");
                }
            }).required()
        }),
        entityType : Joi.string().valid("individual" , "legal"),
        legalInfo: Joi.when("entityType",{
            is: "legal",
            then : Joi.object({
                companyName : Joi.string().min(2).max(100).required(),
                companyType : Joi.string().valid("publicCompany" , "privateCompany" , "limitedLiability" , "cooperative" , "jointLiability" , "institution" , "other").required(), 
                companyIDNumber : Joi.string().length(10).pattern(/^\d+$/).required(),
                companyEconomicNumber : Joi.string().length(10).pattern(/^\d+$/).required(),
                shabaNumber : Joi.string().length(10).pattern(/^\d+$/).required(),
                signOwners : Joi.array().items(Joi.string()).min(1).required(),
                storeName : Joi.string().min(2).max(200)
            }),
            otherwise : Joi.forbidden()
        }), 
        individualInfo: Joi.when("entityType",{
            is: "individual",
            then : Joi.object({
                nationalID : Joi.string().length(10).pattern(/^\d+$/).required(),
                bankNumberType : Joi.string().valid("shaba" , "bank").required(),
                shabaNumber : Joi.when("bankNumberType",{
                    is : "shaba",
                    then : Joi.string().length(10).pattern(/^\d+$/).required(),
                    otherwise : Joi.forbidden()
                }),
                bankNumber : Joi.when("bankNumberType",{
                    is : "bank",
                    then : Joi.string().length(10).pattern(/^\d+$/).required(),
                    otherwise : Joi.forbidden()
                })
            }),
            otherwise : Joi.forbidden()
        }), 
        additionalDocuments: Joi.array().items(Joi.string()),
        storeInfo : Joi.object({
            commercialName : Joi.string().min(2).max(100).required(),
            officePhoneNumber : Joi.string().min(11).max(12).required(),
            workDays : Joi.array().items(Joi.string()).required(),
            logo : Joi.string(),
            sellerCode : Joi.string().length(12).required(),
            aboutSeller : Joi.string().min(50).max(2000).required(),
            sellerWebsite : Joi.string(),
            offDays : Joi.array().items(Joi.string())
        }), 
        moneyReturn:Joi.object({
            method : Joi.string().valid("bankAccount" , "wallet").custom().required(),
            bankAccount : Joi.when('method', {
                is: 'bankAccount',
                then: Joi.string().required(),
                otherwise: Joi.string()
            }),
        }),
        storeAddress: Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode : Joi.string().required(),
            additionalInfo : Joi.string(),
            coordinates : Joi.object({
                    x : Joi.string().required(),
                    y : Joi.string().required()
                }
            ).required(),
        }),
        warehouseAddress: Joi.object({
            country: Joi.string().required(),
            province: Joi.string().required(),
            city: Joi.string().required(),
            postalCode : Joi.string().required(),
            additionalInfo : Joi.string(),
            coordinates : Joi.object({
                    x : Joi.string().required(),
                    y : Joi.string().required()
                }
            ).required(),
        })
    }).min(1);
    return schema.validateAsync(data);
}
